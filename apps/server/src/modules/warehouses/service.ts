import { db } from "@zoltraak/db";
import { warehouses } from "@zoltraak/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import type { Request, Response } from "express";
import { searchSchema, warehouseSchema } from "@/modules/warehouses/model";
import type { PaginatedResult } from "@/types";

async function createWarehouse(req: Request, res: Response) {
	try {
		const warehouseValidation = warehouseSchema.safeParse(req.body);

		if (!warehouseValidation.success) {
			return res.status(400).json({
				error: "VALIDATION_ERROR",
				message: "Invalid request data",
				issues: warehouseValidation.error.issues,
			});
		}

		const { name, pincode } = warehouseValidation.data;

		const [warehouse] = await db
			.insert(warehouses)
			.values({
				name,
				pincode,
				ownerId: req.user.id,
			})
			.returning({ id: warehouses.id });

		if (!warehouse?.id) {
			return res.status(500).json({
				error: "WAREHOUSE_SAVE_FAILED",
				message: "Unable to save warehouse",
			});
		}

		res.status(201).json({
			id: warehouse.id,
			message: "Success",
		});
	} catch (error) {
		console.error(error);

		res.status(500).json({
			code: "WAREHOUSE_SAVE_FAILED",
			message: "Failed to save the warehouse. Please try again later.",
		});
	}
}

async function getAllWarehouses(req: Request, res: Response) {
	try {
		const page = Number(req.query.page ?? 1);
		const limit = Number(req.query.limit ?? 10);

		const currentPage = Math.max(1, page);
		const offset = (currentPage - 1) * limit;

		const totalItems = await db.$count(warehouses);

		const totalPages = Math.ceil(totalItems / limit);

		const items = await db.query.warehouses.findMany({
			orderBy: ({ createdAt, id }, { desc }) => [desc(createdAt), desc(id)],
			offset,
			limit,
			where: ({ ownerId }, { eq }) => eq(ownerId, req.user.id),
		});

		return res.status(200).json({
			items,
			currentPage,
			totalPages,
			totalItems,
			hasNextPage: currentPage < totalPages,
			hasPreviousPage: currentPage > 1,
		} satisfies PaginatedResult<typeof warehouses.$inferSelect>);
	} catch (error) {
		console.error(error);
		res.status(500).json({
			code: "WAREHOUSE_FETCH_FAILED",
			message: "Failed to fetch warehouses. Please try again later.",
		});
	}
}

async function searchWarehouses(req: Request, res: Response) {
	const limit = Number(req.query.limit ?? 10);

	const warehouseValidation = searchSchema.safeParse({
		query: req.query.search,
	});

	if (!warehouseValidation.success) {
		return res.status(400).json({
			error: "VALIDATION_ERROR",
			message: "Invalid request data",
			issues: warehouseValidation.error.issues,
		});
	}

	const { query } = warehouseValidation.data;

	const result = await db
		.select({
			id: warehouses.id,
			name: warehouses.name,
			pincode: warehouses.pincode,
			similarity: sql<number>`
        similarity(${warehouses.name}, ${query})
      `.as("similarity"),
		})
		.from(warehouses)
		.where(
			and(
				eq(warehouses.ownerId, req.user.id),
				sql`
				${warehouses.name} ILIKE ${`%${query}%`}
				OR ${warehouses.pincode} ILIKE ${`%${query}%`}
				OR similarity(${warehouses.name}, ${query}) > 0.2
			`,
			),
		)
		.orderBy(desc(sql`similarity(${warehouses.name}, ${query})`))
		.limit(limit);

	return res.json(result);
}

export { createWarehouse, getAllWarehouses, searchWarehouses };
