import { db } from "@zoltraak/db";
import { deliveryPersons, warehouses } from "@zoltraak/db/schema";
import type { Request, Response } from "express";
import { deliveryPersonSchema } from "@/modules/delivery-persons/model";
import type { PaginatedResult } from "@/types";

async function createDeliveryPerson(req: Request, res: Response) {
  try {
    const deliveryPersonValidation = deliveryPersonSchema.safeParse(req.body);

    if (!deliveryPersonValidation.success) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Invalid request data",
        issues: deliveryPersonValidation.error.issues,
      });
    }

    const { name, phone, warehouseId } = deliveryPersonValidation.data;

    const [deliveryPerson] = await db
      .insert(deliveryPersons)
      .values({
        name,
        phone,
        warehouseId,
      })
      .returning({ id: deliveryPersons.id });

    if (!deliveryPerson?.id) {
      return res.status(500).json({
        error: "DELIVERY_PERSON_SAVE_FAILED",
        message: "Unable to save delivery person",
      });
    }

    res.status(201).json({
      id: deliveryPerson.id,
      message: "Success",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      code: "DELIVERY_PERSON_SAVE_FAILED",
      message: "Failed to save the delivery person. Please try again later.",
    });
  }
}

async function getAllDeliveryPerson(req: Request, res: Response) {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    const currentPage = Math.max(1, page);
    const offset = (currentPage - 1) * limit;

    const totalItems = await db.$count(warehouses);

    const totalPages = Math.ceil(totalItems / limit);

    const items = await db.query.deliveryPersons.findMany({
      columns: {
        id: true,
        name: true,
        phone: true,
      },
      with: {
        warehouse: {
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
      code: "DELIVERY_PERSON_FETCH_FAILED",
      message: "Failed to fetch delivery persons. Please try again later.",
    });
  }
}

export { createDeliveryPerson, getAllDeliveryPerson };
