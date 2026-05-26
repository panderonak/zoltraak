import { db } from "@zoltraak/db";
import { inventories } from "@zoltraak/db/schema";
import { and, eq } from "drizzle-orm";
import type { Request, Response } from "express";
import type { PaginatedResult } from "@/types";
import { inventorySchema } from "./model";

async function createInventory(req: Request, res: Response) {
  try {
    const inventoryValidation = inventorySchema.safeParse(req.body);
    if (!inventoryValidation.success) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Invalid request data",
        issues: inventoryValidation.error.issues,
      });
    }

    const { sku, warehouseId, productId, quantity } = inventoryValidation.data;

    const existing = await db.query.inventories.findFirst({
      where: (inventories, { eq }) => eq(inventories.sku, sku),
      columns: { id: true },
    });

    if (existing) {
      return res.status(409).json({
        error: "DUPLICATE_SKU",
        message: `An inventory item with SKU "${sku}" already exists.`,
      });
    }

    const [inventory] = await db
      .insert(inventories)
      .values({ sku, warehouseId, productId, quantity, ownerId: req.user.id })
      .returning({ id: inventories.id });

    if (!inventory?.id) {
      return res.status(500).json({
        error: "INVENTORY_SAVE_FAILED",
        message: "Unable to save inventory",
      });
    }

    return res.status(201).json({ id: inventory.id, message: "Success" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "INVENTORY_SAVE_FAILED",
      message: "Failed to save the inventory. Please try again later.",
    });
  }
}

async function getAllInventories(req: Request, res: Response) {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const currentPage = Math.max(1, page);
    const offset = (currentPage - 1) * limit;

    const totalItems = await db.$count(inventories);
    const totalPages = Math.ceil(totalItems / limit);

    const items = await db.query.inventories.findMany({
      columns: { id: true, sku: true, quantity: true },
      with: {
        warehouse: { columns: { name: true } },
        product: { columns: { name: true } },
      },
      orderBy: ({ createdAt }, { desc }) => desc(createdAt),
      where: ({ ownerId }, { eq }) => eq(ownerId, req.user.id),
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
    return res.status(500).json({
      error: "INVENTORIES_FETCH_FAILED",
      message: "Failed to fetch inventories. Please try again later.",
    });
  }
}

async function deleteInventory(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        error: "INVALID_DELIVERY_PERSON_ID",
        message: "Invalid delivery person id",
      });
    }

    const [deleted] = await db
      .delete(inventories)
      .where(and(eq(inventories.id, id), eq(inventories.ownerId, req.user.id)))
      .returning({ id: inventories.id });

    if (!deleted) {
      return res.status(404).json({
        error: "INVENTORY_NOT_FOUND",
        message: "Inventory item not found",
      });
    }

    return res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "INVENTORY_DELETE_FAILED",
      message: "Failed to delete inventory.",
    });
  }
}

export { createInventory, deleteInventory, getAllInventories };
