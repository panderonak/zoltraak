import { db } from "@zoltraak/db";
import { inventories, warehouses } from "@zoltraak/db/schema";
import type { Request, Response } from "express";
import { inventorySchema } from "@/modules/inventories/model";
import type { PaginatedResult } from "@/types";

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

    const { sku, warehouseId, productId } = inventoryValidation.data;

    const [inventory] = await db
      .insert(inventories)
      .values({
        sku,
        warehouseId,
        productId,
      })
      .returning({ id: inventories.id });

    if (!inventory?.id) {
      return res.status(500).json({
        error: "INVENTORY_SAVE_FAILED",
        message: "Unable to save inventory",
      });
    }

    res.status(201).json({
      id: inventory.id,
      message: "Success",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      code: "INVENTORY_SAVE_FAILED",
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

    const totalItems = await db.$count(warehouses);

    const totalPages = Math.ceil(totalItems / limit);

    const items = await db.query.inventories.findMany({
      columns: {
        id: true,
        sku: true,
      },
      with: {
        warehouse: {
          columns: {
            name: true,
          },
        },
        product: {
          columns: {
            name: true,
          },
        },
      },
      orderBy: ({ id }, { desc }) => desc(id),
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
      code: "INVENTORIES_FETCH_FAILED",
      message: "Failed to fetch inventories. Please try again later.",
    });
  }
}

export { createInventory, getAllInventories };
