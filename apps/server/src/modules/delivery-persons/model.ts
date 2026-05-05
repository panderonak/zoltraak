import * as z from "zod";

const deliveryPersonSchema = z.object({
	name: z.string({ error: "Delivery person name should be a string" }),
	phone: z
		.string({ error: "Phone should be a string" })
		.length(13, { error: "Delivery person phone should be 13 chars long" }),
	warehouseId: z.uuid({ error: "Warehouse id should be a number" }),
});

export { deliveryPersonSchema };
