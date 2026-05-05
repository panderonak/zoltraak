import crypto from "node:crypto";
import { db } from "@zoltraak/db";
import {
  deliveryPersons,
  inventories,
  orderItems,
  orders,
} from "@zoltraak/db/schema";
import { env } from "@zoltraak/env/server";
import { and, eq, inArray, isNull } from "drizzle-orm";
import type { Request, Response } from "express";
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
      columns: {
        id: true,
        price: true,
        status: true,
        createdAt: true,
      },

      with: {
        user: {
          columns: {
            name: true,
          },
        },
        orderItems: {
          columns: {
            quantity: true,
          },
          with: {
            product: {
              columns: {
                name: true,
              },
            },
          },
        },
      },
      limit,
      offset,
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
      .set({
        status,
      })
      .where(eq(orders.id, orderId))
      .returning({ id: orders.id, status: orders.status });

    if (!order?.id) {
      return res.status(500).json({
        error: "ORDER_STATUS_UPDATE_FAILED",
        message: "Unable to update the order",
      });
    }

    res.status(200).json({
      id: order.id,
      status: order.status,
      message: "Success",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      code: "ORDER_STATUS_UPDATE_FAILED",
      message: "Failed to update the order status. Please try again later.",
    });
  }
}

// async function createOrder(req: Request, res: Response) {
//   try {
//     const orderValidation = orderSchema.safeParse(req.body);

//     if (!orderValidation.success) {
//       return res.status(400).json({
//         error: "VALIDATION_ERROR",
//         message: "Invalid request data",
//         issues: orderValidation.error.issues,
//       });
//     }

//     const { productId, pincode, quantity, address } = orderValidation.data;

//     const warehouse = await db.query.warehouses.findFirst({
//       where: (warehouse, { eq }) => eq(warehouse.pincode, pincode),
//       columns: {
//         id: true,
//       },
//     });

//     if (!warehouse?.id) {
//       return res.status(404).json({
//         error: "WAREHOUSE_NOT_FOUND",
//         message: "Warehouse not found",
//       });
//     }

//     const product = await db.query.products.findFirst({
//       where: (product, { eq }) => eq(product.id, productId),
//       columns: {
//         id: true,
//         price: true,
//       },
//     });

//     if (!product?.id) {
//       return res.status(404).json({
//         error: "PRODUCT_NOT_FOUND",
//         message: "Product not found",
//       });
//     }

//     const order = await db.transaction(async (tx) => {
//       const price = Number(product.price) * quantity;

//       const [order] = await tx
//         .insert(orders)
//         .values({
//           userId: req.user.id,
//           productId,
//           quantity,
//           address,
//           price,
//           status: "received",
//         })
//         .returning({
//           id: orders.id,
//           price: orders.price,
//         });

//       if (!order?.id) {
//         throw new Error("Unable to place the order. Please try again");
//       }

//       const stock = await tx
//         .select({ id: inventories.id })
//         .from(inventories)
//         .where(
//           and(
//             eq(inventories.warehouseId, warehouse.id),
//             eq(inventories.productId, product.id),
//             isNull(inventories.orderId),
//           ),
//         )
//         .limit(quantity)
//         .for("update", { skipLocked: true });

//       if (stock.length < quantity) {
//         throw new Error(
//           `Stock is low, only ${stock.length} items are available`,
//         );
//       }

//       const [person] = await tx
//         .select({ id: deliveryPersons.id })
//         .from(deliveryPersons)
//         .where(
//           and(
//             isNull(deliveryPersons.orderId),
//             eq(deliveryPersons.warehouseId, warehouse.id),
//           ),
//         )
//         .limit(1)
//         .for("update");

//       if (!person?.id) {
//         throw new Error("No delivery person available");
//       }

//       await tx
//         .update(inventories)
//         .set({ orderId: order.id })
//         .where(
//           inArray(
//             inventories.id,
//             stock.map((s) => s.id),
//           ),
//         );

//       await tx
//         .update(deliveryPersons)
//         .set({ orderId: order.id })
//         .where(eq(deliveryPersons.id, person.id));

//       await tx
//         .update(orders)
//         .set({
//           status: "reserved",
//         })
//         .where(eq(orders.id, order.id));

//       return order;
//     });

//     const razorpayOrder = await payment.orders.create({
//       amount: Number(order.price) * 100,
//       currency: "INR",
//       receipt: `receipt-${Date.now()}`,
//       notes: {
//         orderId: order.id,
//         userId: req.user.id,
//         productId: product.id,
//       },
//     });

//     await db
//       .update(orders)
//       .set({
//         paymentId: razorpayOrder.id,
//         status: "payment_pending",
//       })
//       .where(eq(orders.id, order.id));

//     return res.json({
//       success: true,
//       orderId: order.id,
//       razorpayOrderId: razorpayOrder.id,
//       amount: razorpayOrder.amount,
//       currency: razorpayOrder.currency,
//     });
//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       code: "ORDER_PLACED_FAILED",
//       message: "Failed to place an order status. Please try again later.",
//     });
//   }
// }

async function createOrder(req: Request, res: Response) {
  try {
    const validation = orderSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        issues: validation.error.issues,
      });
    }

    const { items, pincode, address } = validation.data;

    const warehouse = await db.query.warehouses.findFirst({
      where: (w, { eq }) => eq(w.pincode, pincode),
      columns: { id: true },
    });

    if (!warehouse) {
      return res.status(404).json({ error: "WAREHOUSE_NOT_FOUND" });
    }

    const order = await db.transaction(async (tx) => {
      let totalPrice = 50;

      // 1. Validate products + calculate price
      const productsData = await Promise.all(
        items.map(async (item) => {
          const product = await tx.query.products.findFirst({
            where: (p, { eq }) => eq(p.id, item.productId),
            columns: { id: true, price: true },
          });

          if (!product) throw new Error("PRODUCT_NOT_FOUND");

          const price = Number(product.price) * item.quantity;
          totalPrice += price;

          return { ...item, price: Number(product.price) };
        }),
      );

      // 2. Create order
      const [order] = await tx
        .insert(orders)
        .values({
          userId: req.user.id,
          address,
          price: totalPrice,
          status: "received",
        })
        .returning({ id: orders.id, price: orders.price });

      if (!order) throw new Error("FAILED_TO_CREATE_ORDER");

      // 3. Insert order items
      await tx.insert(orderItems).values(
        productsData.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      );

      // 4. Reserve inventory per item
      for (const item of productsData) {
        const stock = await tx
          .select({ id: inventories.id })
          .from(inventories)
          .where(
            and(
              eq(inventories.productId, item.productId),
              eq(inventories.warehouseId, warehouse.id),
              isNull(inventories.orderId),
            ),
          )
          .limit(item.quantity)
          .for("update", { skipLocked: true });

        console.log(`STOCKSSS => ${stock}`);
        console.log(`STOCK => ${stock.length}`);
        console.log(`ITEM => ${item.quantity}`);

        if (stock.length < item.quantity) {
          throw new Error("STOCK_LOW");
        }

        await tx
          .update(inventories)
          .set({ orderId: order.id })
          .where(
            inArray(
              inventories.id,
              stock.map((s) => s.id),
            ),
          );
      }

      // 5. Assign delivery person
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

      console.log("PERSON");
      console.log(person);
      console.log("PERSON");

      if (!person) throw new Error("NO_DELIVERY_PERSON");

      await tx
        .update(deliveryPersons)
        .set({ orderId: order.id })
        .where(eq(deliveryPersons.id, person.id));

      await tx
        .update(orders)
        .set({ status: "reserved" })
        .where(eq(orders.id, order.id));

      return order;
    });

    // 6. Create Razorpay order
    const razorpayOrder = await payment.orders.create({
      amount: order.price * 100,
      currency: "INR",
      receipt: `order_${Date.now()}`,
      notes: {
        internalOrderId: order.id,
      },
    });

    await db
      .update(orders)
      .set({
        paymentId: razorpayOrder.id, // store razorpay order id
        status: "payment_pending",
      })
      .where(eq(orders.id, order.id));

    return res.json({
      orderId: order.id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (err) {
    if (err instanceof Error) {
      switch (err.message) {
        case "PRODUCT_NOT_FOUND":
          return res.status(404).json({
            error: "PRODUCT_NOT_FOUND",
            message: "One or more products in your cart were not found.",
          });
        case "STOCK_LOW":
          return res.status(409).json({
            error: "STOCK_LOW",
            message:
              "Insufficient stock for one or more items in your cart. Please update quantities and try again.",
          });
        case "NO_DELIVERY_PERSON":
          return res.status(409).json({
            error: "NO_DELIVERY_PERSON",
            message:
              "No delivery partner is currently available for this pincode. Please try again later.",
          });
        case "FAILED_TO_CREATE_ORDER":
          return res.status(500).json({
            error: "ORDER_FAILED",
            message: "Unable to create the order. Please try again.",
          });
      }
    }

    console.error("Unexpected createOrder error:", err);
    return res.status(500).json({
      error: "ORDER_FAILED",
      message: "Failed to place order. Please try again later.",
    });
  }
}

// async function paymentHandler(req: Request, res: Response) {
//   try {
//     const signature = req.headers["x-razorpay-signature"] as string;

//     const expectedSignature = crypto
//       .createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET)
//       .update(req.body) // raw buffer
//       .digest("hex");

//     if (signature !== expectedSignature) {
//       return res.status(400).json({
//         error: "INVALID_SIGNATURE",
//       });
//     }

//     const event = JSON.parse(req.body.toString());

//     // ✅ HANDLE SUCCESS PAYMENT
//     if (event.event === "payment.captured") {
//       const payment = event.payload.payment.entity;

//       const orderId = payment.order_id;
//       const paymentId = payment.id;

//       // 🔒 IDEMPOTENCY CHECK
//       const existing = await db.query.orders.findFirst({
//         where: (orders, { eq }) => eq(orders.paymentId, paymentId),
//         columns: { id: true },
//       });

//       if (existing) {
//         return res.json({ success: true });
//       }

//       const [order] = await db
//         .update(orders)
//         .set({
//           status: "paid",
//           paymentId,
//         })
//         .where(eq(orders.id, orderId))
//         .returning({ id: orders.id });

//       if (!order) {
//         throw new Error("Order not found");
//       }

//       console.log("✅ Payment captured:", order.id);
//     }

//     return res.json({ received: true });
//   } catch (error) {
//     console.error("Webhook error:", error);

//     return res.status(500).json({
//       error: "WEBHOOK_FAILED",
//     });
//   }
// }

async function verifyPayment(req: Request, res: Response) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const expected = crypto
    .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expected !== razorpay_signature) {
    return res.status(400).json({ error: "INVALID_SIGNATURE" });
  }

  // find order using razorpay order id
  const order = await db.query.orders.findFirst({
    where: (o, { eq }) => eq(o.paymentId, razorpay_order_id),
  });

  if (!order) return res.status(404).json({ error: "ORDER_NOT_FOUND" });

  await db
    .update(orders)
    .set({
      status: "paid",
      paymentId: razorpay_payment_id,
    })
    .where(eq(orders.id, order.id));

  return res.json({ success: true });
}

export { createOrder, getAllOrders, updateOrderStatus, verifyPayment };
