import * as z from "zod";

const inventorySchema = z.object({
	sku: z
		.string({ error: "SKU should be a string" })
		.length(8, { error: "SKU should be 8 characters long" }),
	warehouseId: z.uuid({ error: "Warehouse Id is not valid" }),
	productId: z.uuid({ error: "Product Id is not valid" }),
	quantity: z
		.number({ error: "Quantity should be a number" })
		.int()
		.min(0, { error: "Quantity cannot be negative" })
		.default(0),
});

export { inventorySchema };
