import { ACCEPTED_TYPES, MAX_FILES } from "@zoltraak/config";
import z from "zod";

const preSignedUrlSchema = z.object({
  files: z
    .array(
      z.object({
        id: z.uuid().min(1, "Please select a file"),
        file: z
          .string()
          .min(1, "File name is required")
          .refine((file) => {
            const extension = file.split(".").pop()?.toLowerCase();

            return !!extension && ACCEPTED_TYPES.includes(extension);
          }, "This file type is not supported"),
      }),
    )
    .min(1, "Please select at least one image")
    .max(MAX_FILES, `You can upload up to ${MAX_FILES} images`),
});

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
    }, "Price must be between $1 and $999,999.99"),
  images: z
    .array(z.string().min(1, "Invalid image file"))
    .max(MAX_FILES, `You can upload up to ${MAX_FILES} images`),
});

const paramsSchema = z.object({
  id: z.uuid(),
});

const searchSchema = z.object({
  query: z.string().min(1, { error: "Product name cannot be empty" }),
});

export { paramsSchema, preSignedUrlSchema, productSchema, searchSchema };
