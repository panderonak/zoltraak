import { db } from "@zoltraak/db";
import { deliveryPersons, orders } from "@zoltraak/db/schema";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import type { Request, Response } from "express";
import {
	deliveryPersonSchema,
	updateDeliveryPersonSchema,
} from "@/modules/delivery-persons/model";
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

		const [person] = await db
			.insert(deliveryPersons)
			.values({
				name,
				phone,
				warehouseId,
				status: "available",
				ownerId: req.user.id,
			})
			.returning({ id: deliveryPersons.id });

		if (!person?.id) {
			return res.status(500).json({
				error: "DELIVERY_PERSON_SAVE_FAILED",
				message: "Unable to save delivery person",
			});
		}

		return res.status(201).json({ id: person.id, message: "Success" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			error: "DELIVERY_PERSON_SAVE_FAILED",
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

		const totalItems = await db.$count(deliveryPersons);
		const totalPages = Math.ceil(totalItems / limit);

		const items = await db.query.deliveryPersons.findMany({
			columns: { id: true, name: true, phone: true, status: true },
			with: { warehouse: { columns: { name: true } } },
			orderBy: ({ createdAt }, { desc }) => desc(createdAt),
			limit,
			offset,
			where: ({ ownerId }, { eq }) => eq(ownerId, req.user.id),
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
			error: "DELIVERY_PERSON_FETCH_FAILED",
			message: "Failed to fetch delivery persons. Please try again later.",
		});
	}
}

async function updateDeliveryPerson(req: Request, res: Response) {
	try {
		const { id } = req.params;
		if (!id || typeof id !== "string") {
			return res.status(400).json({
				error: "VALIDATION_ERROR",
				message: "Invalid delivery person ID",
			});
		}

		const parsed = updateDeliveryPersonSchema.safeParse(req.body);
		if (!parsed.success) {
			return res.status(400).json({
				error: "VALIDATION_ERROR",
				message: "Invalid request data",
				issues: parsed.error.issues,
			});
		}

		const [updated] = await db
			.update(deliveryPersons)
			.set(parsed.data)
			.where(
				and(
					eq(deliveryPersons.ownerId, req.user.id),
					eq(deliveryPersons.id, id),
				),
			)
			.returning({ id: deliveryPersons.id });

		if (!updated) {
			return res.status(404).json({
				error: "DELIVERY_PERSON_NOT_FOUND",
				message: "Delivery person not found",
			});
		}

		return res
			.status(200)
			.json({ id: updated.id, message: "Updated successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			error: "DELIVERY_PERSON_UPDATE_FAILED",
			message: "Failed to update delivery person.",
		});
	}
}

async function deleteDeliveryPerson(req: Request, res: Response) {
	try {
		const { id } = req.params;
		if (!id || typeof id !== "string") {
			return res.status(400).json({
				error: "VALIDATION_ERROR",
				message: "Invalid delivery person ID",
			});
		}

		const [deleted] = await db
			.delete(deliveryPersons)
			.where(
				and(
					eq(deliveryPersons.ownerId, req.user.id),
					eq(deliveryPersons.id, id),
				),
			)
			.returning({ id: deliveryPersons.id });

		if (!deleted) {
			return res.status(404).json({
				error: "DELIVERY_PERSON_NOT_FOUND",
				message: "Delivery person not found",
			});
		}

		return res.status(200).json({ message: "Deleted successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			error: "DELIVERY_PERSON_DELETE_FAILED",
			message: "Failed to delete delivery person.",
		});
	}
}

async function completeDelivery(req: Request, res: Response) {
	try {
		const { deliveryPersonId, orderId } = req.body as {
			deliveryPersonId: string;
			orderId: string;
		};

		if (!deliveryPersonId || !orderId) {
			return res.status(400).json({
				error: "VALIDATION_ERROR",
				message: "deliveryPersonId and orderId are required",
			});
		}

		await db.transaction(async (tx) => {
			// Verify the order is paid and belongs to this delivery person
			const order = await tx.query.orders.findFirst({
				where: and(
					eq(orders.id, orderId),
					eq(orders.deliveryPersonId, deliveryPersonId),
					eq(orders.userId, req.user.id),
				),
				columns: { id: true, status: true },
			});

			if (!order) throw new Error("ORDER_NOT_FOUND");

			if (order.status !== "paid") {
				throw new Error("ORDER_NOT_PAID");
			}

			await tx
				.update(orders)
				.set({ status: "delivered" })
				.where(and(eq(orders.id, orderId), eq(orders.userId, req.user.id)));

			// Free the delivery person — order stays "paid" for history
			const [updatedPerson] = await tx
				.update(deliveryPersons)
				.set({ status: "available", orderId: null })
				.where(
					and(
						eq(deliveryPersons.id, deliveryPersonId),
						eq(deliveryPersons.ownerId, req.user.id),
					),
				)
				.returning({ id: deliveryPersons.id });

			if (!updatedPerson) throw new Error("DELIVERY_PERSON_NOT_FOUND");
		});

		return res.status(200).json({ message: "Delivery completed successfully" });
	} catch (error) {
		console.error(error);
		const message =
			error instanceof Error ? error.message : "COMPLETE_DELIVERY_FAILED";
		const statusCode = message.includes("NOT_FOUND")
			? 404
			: message === "ORDER_NOT_PAID"
				? 409
				: 500;
		return res.status(statusCode).json({
			error: message,
			message: "Failed to complete delivery.",
		});
	}
}

async function getDeliveryPersonOrders(req: Request, res: Response) {
	try {
		const { id } = req.params;
		if (!id || typeof id !== "string") {
			return res.status(400).json({
				error: "VALIDATION_ERROR",
				message: "Invalid delivery person ID",
			});
		}

		const page = Number(req.query.page ?? 1);
		const limit = Number(req.query.limit ?? 10);
		const currentPage = Math.max(1, page);
		const offset = (currentPage - 1) * limit;

		const person = await db.query.deliveryPersons.findFirst({
			where: eq(deliveryPersons.id, id),
			columns: {
				id: true,
				name: true,
				phone: true,
				status: true,
				orderId: true,
			},
			with: { warehouse: { columns: { name: true } } },
		});

		if (!person) {
			return res.status(404).json({
				error: "DELIVERY_PERSON_NOT_FOUND",
				message: "Delivery person not found",
			});
		}

		const totalItems = await db.$count(orders, eq(orders.deliveryPersonId, id));
		const totalPages = Math.ceil(totalItems / limit);

		const items = await db.query.orders.findMany({
			where: eq(orders.deliveryPersonId, id),
			columns: {
				id: true,
				status: true,
				price: true,
				address: true,
				createdAt: true,
			},
			with: {
				user: { columns: { name: true, email: true } },
				orderItems: {
					columns: { quantity: true, price: true },
					with: { product: { columns: { name: true } } },
				},
				inventories: {
					columns: { sku: true, quantity: true },
				},
			},
			// in-progress orders float to top, then newest first
			orderBy: [
				asc(
					sql`CASE WHEN ${orders.status} IN ('received','reserved','payment_pending')
              THEN 0 ELSE 1 END`,
				),
				desc(orders.createdAt),
			],
			limit,
			offset,
		});

		return res.status(200).json({
			person,
			items,
			currentPage,
			totalPages,
			totalItems,
			hasNextPage: currentPage < totalPages,
			hasPreviousPage: currentPage > 1,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			error: "DELIVERY_PERSON_ORDERS_FETCH_FAILED",
			message: "Failed to fetch delivery person orders.",
		});
	}
}

export {
	completeDelivery,
	createDeliveryPerson,
	deleteDeliveryPerson,
	getAllDeliveryPerson,
	getDeliveryPersonOrders,
	updateDeliveryPerson,
};
