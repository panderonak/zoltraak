import * as z from "zod";

const warehouseSchema = z.object({
	name: z.string().min(1, { error: "Warehouse name is required" }),
	pincode: z
		.string()
		.length(6, { error: "Pincode must be exactly 6 characters" }),
});

export { warehouseSchema };
