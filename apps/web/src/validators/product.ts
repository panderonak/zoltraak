import { MAX_FILES, MAX_SIZE } from "@zoltraak/config";
import z from "zod";

const categories = [
  "Fresh",
  "Dairy",
  "Snacks",
  "Beverages",
  "Staples",
  "Instant Food",
  "Personal Care",
  "Household",
] as const;

const productSchema = z.object({
  name: z
    .string()
    .min(3, "Product name must be at least 3 characters long")
    .max(30, "Product name cannot be longer than 30 characters")
    .regex(
      /^[a-zA-Z0-9\s\-_]/,
      "Product name can contain only letters, numbers, spaces, hyphens, and underscores",
    )
    .trim(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long")
    .max(500, "Description cannot be longer than 500 characters")
    .trim(),
  category: z.enum(categories, { error: "Select a category" }),
  price: z
    .string()
    .trim()
    .refine((value) => {
      const price = Number.parseFloat(value);
      return Number.isFinite(price) && price > 0 && price <= 999_999.99;
    }, "Price must be between ₹1 and ₹999,999.99"),
  images: z
    .array(
      z.instanceof(File).refine((file) => file.size <= MAX_SIZE, {
        message: "File too large",
      }),
    )
    .max(MAX_FILES, `You can upload up to ${MAX_FILES} images`),
});

export { categories, productSchema };
