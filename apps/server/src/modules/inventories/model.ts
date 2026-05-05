import * as z from "zod";

const inventorySchema = z.object({
  sku: z
    .string({ error: "SKU should be a string" })
    .length(8, { error: "SKU should be 8 characters long" }),
  warehouseId: z.uuid({ error: "Warehouse Id is not valid" }),
  productId: z.uuid({ error: "Product Id is not valid" }),
});

export { inventorySchema };
