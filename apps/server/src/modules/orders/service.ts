import crypto from "node:crypto";
import { db } from "@zoltraak/db";
import {
  deliveryPersons,
  inventories,
  orderItems,
  orders,
} from "@zoltraak/db/schema";
import { env } from "@zoltraak/env/server";
import { and, eq, inArray, isNull, sql } from "drizzle-orm";
import type { Request, Response } from "express";
import { DELIVERY_FEE } from "@/config";
import { payment } from "@/lib/payment";
import { orderSchema, orderStatusSchema } from "@/modules/orders/model";
import type { PaginatedResult } from "@/types";

async function getAllOrders(req: Request, res: Response) {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    const currentPage = Math.max(1, page);
    const offset = (currentPage - 1) * limit;

    const totalItems = await db.$count(orders);
    const totalPages = Math.ceil(totalItems / limit);

    const items = await db.query.orders.findMany({
      columns: { id: true, price: true, status: true, createdAt: true },
      with: {
        user: { columns: { name: true } },
        orderItems: {
          columns: { quantity: true },
          with: { product: { columns: { name: true } } },
        },
      },
      limit,
      offset,
      orderBy: ({ createdAt }, { desc }) => desc(createdAt),
    });

    return res.status(200).json({
      items,
      currentPage,
      totalPages,
      totalItems,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    } satisfies PaginatedResult<(typeof items)[number]>);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: "ORDERS_FETCH_FAILED",
      message: "Failed to fetch orders. Please try again later.",
    });
  }
}

async function updateOrderStatus(req: Request, res: Response) {
  try {
    const orderStatusValidation = orderStatusSchema.safeParse(req.body);

    if (!orderStatusValidation.success) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Invalid request data",
        issues: orderStatusValidation.error.issues,
      });
    }

    const { orderId, status } = orderStatusValidation.data;

    const [order] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, orderId))
      .returning({ id: orders.id, status: orders.status });

    if (!order?.id) {
      return res.status(500).json({
        error: "ORDER_STATUS_UPDATE_FAILED",
        message: "Unable to update the order",
      });
    }

    res
      .status(200)
      .json({ id: order.id, status: order.status, message: "Success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: "ORDER_STATUS_UPDATE_FAILED",
      message: "Failed to update the order status. Please try again later.",
    });
  }
}

/**
 * Creates an order in three distinct phases, each with its own responsibility
 * and failure handling:
 *
 *   Phase 1 — Pre-transaction reads (no locks held)
 *     Validate input, find warehouse, batch-fetch all products.
 *     Done outside the transaction to keep the transaction as short as possible.
 *
 *   Phase 2 — DB transaction (row locks held)
 *     Insert order + line items, lock and reserve inventory, assign delivery person.
 *     Everything here is atomic: if any step throws, Postgres rolls back the
 *     entire transaction so no resources are left partially reserved.
 *
 *   Phase 3 — Razorpay (after transaction commits)
 *     Create the Razorpay order and update the DB record with the payment ID.
 *     Done after the transaction so we don't hold row locks while waiting on
 *     an external HTTP call. If Razorpay fails here, releaseOrderResources()
 *     cleans up what the transaction committed.
 */
async function createOrder(req: Request, res: Response) {
  // ── Phase 1a: Validate request body ───────────────────────────────────────

  const validation = orderSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      issues: validation.error.issues,
    });
  }

  const { items, pincode, address } = validation.data;

  // ── Phase 1b: Resolve warehouse ───────────────────────────────────────────
  //
  // Each warehouse serves a single pincode. If no warehouse covers this pincode
  // we can't fulfil the order, so we stop early with a 404.

  const warehouse = await db.query.warehouses.findFirst({
    where: (w, { eq }) => eq(w.pincode, pincode),
    columns: { id: true },
  });

  if (!warehouse) {
    return res.status(404).json({
      error: "WAREHOUSE_NOT_FOUND",
      message: "We don't deliver to this pincode yet.",
    });
  }

  // ── Phase 1c: Batch-fetch all products ────────────────────────────────────
  //
  // WHY BEFORE THE TRANSACTION?
  // Fetching inside the transaction one-by-one (as the previous code did with
  // Promise.all + findFirst) keeps row locks open for each round-trip. A single
  // findMany with inArray fetches everything in one query, and doing it outside
  // the transaction means we hold no locks at all during this step.
  //
  // WHY VALIDATE UPFRONT?
  // Finding a missing product mid-transaction would roll back all the work done
  // up to that point (order insert, inventory locks) and waste those resources.
  // Validating before the transaction starts means we fail fast and cheaply.

  const productIds = items.map((item) => item.productId);

  const fetchedProducts = await db.query.products.findMany({
    where: (p, { inArray }) => inArray(p.id, productIds),
    columns: { id: true, price: true },
  });

  // Build a Map for O(1) lookup by product ID during enrichment below.
  const productMap = new Map(fetchedProducts.map((p) => [p.id, p]));

  const missingId = productIds.find((id) => !productMap.has(id));
  if (missingId) {
    return res.status(404).json({
      error: "PRODUCT_NOT_FOUND",
      message: "One or more products in your cart were not found.",
    });
  }

  // ── Phase 1d: Pre-compute line items and total ────────────────────────────
  //
  // Prices are captured from the DB here, not from the client request.
  // This prevents price tampering — a client could send any price they want,
  // but we always use the server-side price for billing.

  const enrichedItems = items.map((item) => {
    const unitPrice = Number(productMap.get(item.productId)?.price);
    return { ...item, unitPrice, lineTotal: unitPrice * item.quantity };
  });

  const subtotal = enrichedItems.reduce((sum, i) => sum + i.lineTotal, 0);
  // DELIVERY_FEE is a named constant imported from config, not a magic number.
  // It must be kept in sync with the FEE constant on the frontend.
  const totalPrice = subtotal + DELIVERY_FEE;

  // ── Phase 2: DB transaction ───────────────────────────────────────────────

  let order: { id: string; price: number };

  try {
    order = await db.transaction(async (tx) => {
      // Step 1: Create the order record at "received" status.
      // Status progression: received → reserved → payment_pending → paid.
      // "received" means we've accepted the request but haven't yet locked resources.
      const [created] = await tx
        .insert(orders)
        .values({
          userId: req.user.id,
          address,
          price: totalPrice,
          status: "received",
        })
        .returning({ id: orders.id, price: orders.price });

      if (!created) throw new Error("FAILED_TO_CREATE_ORDER");

      // Step 2: Insert all line items in one statement (not one per item).
      // Batching into a single INSERT is more efficient and keeps the
      // transaction shorter.
      await tx.insert(orderItems).values(
        enrichedItems.map((item) => ({
          orderId: created.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.unitPrice,
        })),
      );

      // Step 3: Reserve inventory units for each product.
      //
      // FOR UPDATE SKIP LOCKED is the key to safe concurrent checkouts:
      //   - FOR UPDATE: lock the selected rows so no other transaction can
      //     modify them until this transaction commits or rolls back.
      //   - SKIP LOCKED: if a row is already locked by another transaction
      //     (i.e. another user is checking out the same item), skip it
      //     instead of waiting. This means two users can't accidentally
      //     reserve the same inventory unit, and neither transaction deadlocks.
      //
      // We loop over products sequentially (not Promise.all) to avoid
      // acquiring locks in different orders across concurrent transactions,
      // which is a classic deadlock pattern.

      for (const item of enrichedItems) {
        const [stock] = await tx
          .select({ id: inventories.id, quantity: inventories.quantity })
          .from(inventories)
          .where(
            and(
              eq(inventories.productId, item.productId),
              eq(inventories.warehouseId, warehouse.id),
            ),
          )
          .limit(1)
          .for("update", { skipLocked: true });

        if (!stock || stock.quantity < item.quantity) {
          throw new Error("STOCK_LOW");
        }

        await tx
          .update(inventories)
          .set({
            quantity: stock.quantity - item.quantity,
            orderId: created.id,
          })
          .where(eq(inventories.id, stock.id));
      }

      // Step 4: Assign an available delivery person from the same warehouse.
      //
      // FOR UPDATE (without SKIP LOCKED) here is intentional — we need exactly
      // one person, so we wait for the lock rather than skipping, which could
      // cause two transactions to assign the same person.

      const [person] = await tx
        .select({ id: deliveryPersons.id })
        .from(deliveryPersons)
        .where(
          and(
            isNull(deliveryPersons.orderId),
            eq(deliveryPersons.warehouseId, warehouse.id),
          ),
        )
        .limit(1)
        .for("update");

      if (!person) throw new Error("NO_DELIVERY_PERSON");

      await tx
        .update(deliveryPersons)
        .set({ orderId: created.id, status: "busy" })
        .where(eq(deliveryPersons.id, person.id));

      // Step 5: Advance to "reserved" — all resources are now committed.
      // This status means inventory is locked and a delivery person is assigned,
      // but payment hasn't started yet.
      await tx
        .update(orders)
        .set({ status: "reserved", deliveryPersonId: person.id })
        .where(eq(orders.id, created.id));

      return created;
    });
  } catch (err) {
    // handleTransactionError maps known error strings to HTTP responses.
    // It's extracted into a helper so this function reads as a linear
    // happy path rather than a wall of error handling at the end.
    return handleTransactionError(res, err);
  }

  // ── Phase 3: Create Razorpay order ────────────────────────────────────────
  //
  // WHY OUTSIDE THE TRANSACTION?
  // The DB transaction has committed and all locks are released. If Razorpay
  // were called inside the transaction, any delay in its response (network
  // latency, rate limits) would hold row-level locks on inventory and
  // delivery_persons for that entire duration — blocking every other checkout
  // that touches the same warehouse.
  //
  // TRADE-OFF: if Razorpay fails after the transaction commits, the order is
  // already "reserved" in the DB with resources locked. We handle this with
  // the explicit cleanup in the catch block below.

  try {
    const razorpayOrder = await payment.orders.create({
      amount: order.price * 100, // Razorpay expects amounts in paise (1 INR = 100 paise)
      currency: "INR",
      // Razorpay enforces a 40-character max on receipt. A UUID is 36 chars,
      // but "order_" + UUID = 42 chars (over the limit). Stripping hyphens
      // gives 32 chars — unique, within the limit, and still tied to our order ID.
      receipt: order.id.replace(/-/g, ""),
      notes: { internalOrderId: order.id },
    });

    // Store the Razorpay order ID as paymentId so we can look up the order
    // during payment verification (verifyPayment queries by paymentId).
    await db
      .update(orders)
      .set({ paymentId: razorpayOrder.id, status: "payment_pending" })
      .where(eq(orders.id, order.id));

    return res.status(201).json({
      orderId: order.id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (err) {
    console.error(`[createOrder] Razorpay failed for order ${order.id}:`, err);

    // Release all reserved resources so they become available to other orders.
    // If this cleanup itself fails, we log it but don't rethrow — the 502
    // must still reach the client. The orphaned order can be caught by a
    // monitoring alert or a reconciliation job that finds "reserved" orders
    // older than a threshold with no paymentId.
    await releaseOrderResources(order.id).catch((cleanupErr) =>
      console.error(
        `[createOrder] Cleanup failed for order ${order.id}:`,
        cleanupErr,
      ),
    );

    return res.status(502).json({
      error: "PAYMENT_INIT_FAILED",
      message:
        "Unable to initialise payment. Your cart has not been charged — please try again.",
    });
  }
}

/**
 * Verifies a Razorpay payment and marks the order as paid.
 *
 * This endpoint is called by the frontend immediately after the Razorpay modal
 * closes with a successful payment. It should not be confused with a webhook —
 * it's a client-initiated verification, not a server-to-server event.
 *
 * Four guards run in sequence:
 *   1. Field presence   — are all required Razorpay fields present?
 *   2. HMAC signature   — is the payment cryptographically authentic?
 *   3. Idempotency      — has this payment already been verified?
 *   4. Status guard     — is the order in the expected state?
 */
async function verifyPayment(req: Request, res: Response) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    // Guard 1: Field presence.
    // The Razorpay SDK always sends all three fields on success, but a
    // malformed or replayed request might not. Checking upfront produces a
    // clear 400 rather than a cryptic downstream failure.
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        error: "MISSING_FIELDS",
        message:
          "razorpay_order_id, razorpay_payment_id, and razorpay_signature are all required.",
      });
    }

    // Guard 2: HMAC signature verification.
    //
    // Razorpay signs its response by HMAC-SHA256 hashing "orderId|paymentId"
    // with our secret key. We recompute that hash and compare. If they match,
    // the response genuinely came from Razorpay and hasn't been tampered with.
    //
    // WHY timingSafeEqual INSTEAD OF ===?
    // String equality short-circuits on the first mismatched character, which
    // means response time leaks information about how many characters match.
    // An attacker can exploit that timing difference to brute-force a valid
    // signature. timingSafeEqual always takes the same amount of time regardless
    // of where the strings diverge, eliminating that attack vector.

    const expected = crypto
      .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const signaturesMatch = crypto.timingSafeEqual(
      Buffer.from(expected, "hex"),
      Buffer.from(razorpay_signature, "hex"),
    );

    if (!signaturesMatch) {
      return res.status(400).json({
        error: "INVALID_SIGNATURE",
        message: "Payment signature verification failed.",
      });
    }

    // Look up the order using the Razorpay order ID stored as paymentId.
    // We only fetch id and status — the minimum needed to run the guards below.
    const order = await db.query.orders.findFirst({
      where: (o, { eq }) => eq(o.paymentId, razorpay_order_id),
      columns: { id: true, status: true },
    });

    if (!order) {
      return res.status(404).json({
        error: "ORDER_NOT_FOUND",
        message: "No order was found for this payment.",
      });
    }

    // Guard 3: Idempotency.
    //
    // WHY THIS MATTERS: Razorpay retries webhook delivery on non-2xx responses,
    // and the client itself may retry on a network failure. Without this guard,
    // a second call would fall through to the status guard below and return 409,
    // causing Razorpay to retry infinitely. Returning 200 on an already-paid
    // order is correct — the operation succeeded on the first call.

    if (order.status === "paid") {
      return res.status(200).json({ success: true });
    }

    // Guard 4: Status validation.
    //
    // Only "payment_pending" orders should reach this point. Any other status
    // ("received", "reserved", "failed") means the order is in an unexpected
    // state — possibly a replay attack or a race condition — and should be
    // rejected rather than silently marked as paid.

    if (order.status !== "payment_pending") {
      return res.status(409).json({
        error: "INVALID_ORDER_STATE",
        message: `Order cannot be verified in its current state: "${order.status}".`,
      });
    }

    // All guards passed — mark the order as paid and replace the Razorpay
    // order ID (stored temporarily as paymentId) with the actual payment ID.
    // The payment ID is the canonical reference for a completed Razorpay payment.
    await db
      .update(orders)
      .set({ status: "paid", paymentId: razorpay_payment_id })
      .where(eq(orders.id, order.id));

    await db
      .update(inventories)
      .set({
        quantity: sql`GREATEST(${inventories.quantity} - 1, 0)`,
        orderId: null,
      })
      .where(eq(inventories.orderId, order.id));

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("[verifyPayment] Unexpected error:", err);
    return res.status(500).json({
      error: "VERIFICATION_FAILED",
      message:
        "Payment verification failed on our end. If your account was charged, please contact support.",
    });
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Releases all resources tied to an order and marks it as "failed".
 *
 * This is the cleanup path for when Razorpay fails after the DB transaction
 * has already committed. Without this, the order would sit as "reserved"
 * indefinitely — inventory locked and a delivery person unavailable — with
 * no way to recover without a manual DB fix.
 *
 * WHY A SEPARATE TRANSACTION?
 * The original DB transaction has already committed, so we need a new one
 * to ensure all three updates (inventories, delivery_persons, orders) are
 * atomic. If this transaction fails partway through, none of the updates
 * apply — which is safer than a partial release.
 */
async function releaseOrderResources(orderId: string) {
  await db.transaction(async (tx) => {
    // Unlink inventory units so they become available to future orders.
    await tx
      .update(inventories)
      .set({ orderId: null })
      .where(eq(inventories.orderId, orderId));

    // Unlink the delivery person so they can be assigned to future orders.
    await tx
      .update(deliveryPersons)
      .set({ orderId: null, status: "available" })
      .where(eq(deliveryPersons.orderId, orderId));

    // Mark the order as failed so it's visible in admin tooling and won't be
    // confused for a legitimate in-progress order by monitoring or cron jobs.
    await tx
      .update(orders)
      .set({ status: "failed" })
      .where(eq(orders.id, orderId));
  });
}

/**
 * Maps known transaction error strings to their appropriate HTTP responses.
 *
 * WHY EXTRACTED?
 * The switch would otherwise sit at the bottom of createOrder, making the
 * function feel like it ends in a wall of error handling. Extracting it lets
 * createOrder read as a linear happy path, with this function handling the
 * exceptional cases separately.
 *
 * WHY ERROR STRINGS INSTEAD OF CUSTOM ERROR CLASSES?
 * Inside a Drizzle transaction, the only way to abort and signal a specific
 * failure is to throw. Custom error classes work fine, but plain Error strings
 * are simpler and equally readable for the small set of cases here.
 */
function handleTransactionError(res: Response, err: unknown): Response {
  if (err instanceof Error) {
    switch (err.message) {
      case "STOCK_LOW":
        return res.status(409).json({
          error: "STOCK_LOW",
          message:
            "Insufficient stock for one or more items. Please update quantities and try again.",
        });

      case "NO_DELIVERY_PERSON":
        return res.status(409).json({
          error: "NO_DELIVERY_PERSON",
          message:
            "No delivery partner is available for this area right now. Please try again shortly.",
        });

      case "FAILED_TO_CREATE_ORDER":
        return res.status(500).json({
          error: "ORDER_FAILED",
          message: "Unable to create your order. Please try again.",
        });
    }
  }

  console.error("[createOrder] Unexpected transaction error:", err);
  return res.status(500).json({
    error: "ORDER_FAILED",
    message: "Failed to place order. Please try again later.",
  });
}

export { createOrder, getAllOrders, updateOrderStatus, verifyPayment };
