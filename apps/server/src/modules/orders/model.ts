import * as z from "zod";

const orderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.uuid({ error: "Product Id is not valid" }),
      quantity: z.number({ error: "Quantity should be a number" }),
    }),
  ),
  pincode: z.string({ error: "Pincode should be a string" }),
  address: z
    .string({
      error: "Address should be a string",
    })
    .min(5, { error: "Address should be at least 5 characters long" }),
});

const orderStatusSchema = z.object({
  orderId: z.uuid({ error: "Order Id is not valid" }),
  status: z.enum(["received", "reserved", "payment_pending", "paid", "failed"]),
});

export { orderSchema, orderStatusSchema };
