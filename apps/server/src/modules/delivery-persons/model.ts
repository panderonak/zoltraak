import * as z from "zod";

const deliveryPersonStatusEnum = z.enum(["available", "busy", "offline"]);

const deliveryPersonSchema = z.object({
	name: z.string({ error: "Delivery person name should be a string" }),
	phone: z
		.string({ error: "Phone should be a string" })
		.length(13, { error: "Delivery person phone should be 13 chars long" }),
	warehouseId: z.uuid({ error: "Warehouse id should be a valid UUID" }),
});

const updateDeliveryPersonSchema = z.object({
	name: z.string().optional(),
	phone: z.string().length(13).optional(),
	warehouseId: z.uuid().optional(),
	status: deliveryPersonStatusEnum.optional(),
});

export {
	deliveryPersonSchema,
	deliveryPersonStatusEnum,
	updateDeliveryPersonSchema,
};
