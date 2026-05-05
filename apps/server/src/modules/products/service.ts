import { db } from "@zoltraak/db";
import { productImages, products } from "@zoltraak/db/schema";
import { env } from "@zoltraak/env/server";
import { asc, desc, eq, sql } from "drizzle-orm";
import type { Request, RequestHandler, Response } from "express";
import { v4 as uuid } from "uuid";
import { createPresignedUrlWithClient } from "@/lib/s3";
import {
  paramsSchema,
  preSignedUrlSchema,
  productSchema,
  searchSchema,
} from "@/modules/products/model";
import type { PaginatedResult } from "@/types";

async function getPresignedUrls(req: Request, res: Response) {
  console.log("I am here");
  try {
    const preSignedUrlsValidation = preSignedUrlSchema.safeParse(req.body);

    if (!preSignedUrlsValidation.success) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Invalid request data",
        issues: preSignedUrlsValidation.error.issues,
      });
    }

    const { files } = preSignedUrlsValidation.data;

    const preSignedUrls = await Promise.all(
      files.map(async ({ file, id }) => {
        const extension = file.split(".").pop()?.toLowerCase();

        const filename = `${uuid()}.${extension}`;

        const url = await createPresignedUrlWithClient({
          bucket: env.S3_BUCKET_NAME,
          key: filename,
        });

        return { id, url, filename };
      }),
    );

    res.send({
      preSignedUrls,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      code: "UPLOAD_URL_GENERATION_FAILED",
      message: "Failed to generate presigned URL. Please try again later.",
    });
  }
}

async function createProduct(req: Request, res: Response) {
  try {
    const productsValidation = productSchema.safeParse(req.body);

    if (!productsValidation.success) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Invalid request data",
        issues: productsValidation.error.issues,
      });
    }

    const { name, description, price, images, category } =
      productsValidation.data;

    const sellerId = req.user.id;

    await db.transaction(async (tx) => {
      const [product] = await tx
        .insert(products)
        .values({
          name,
          description,
          category,
          price,
          sellerId,
        })
        .returning({ id: products.id });

      if (!product?.id) {
        throw new Error("PRODUCT_SAVE_FAILED");
      }

      await tx.insert(productImages).values(
        images.map((name) => ({
          name,
          product_id: product.id,
        })),
      );
    });

    res.status(201).json({
      message: "Success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: "PRODUCT_SAVE_FAILED",
      message: "Failed to save the product. Please try again later.",
    });
  }
}

async function getAllAdminProducts(req: Request, res: Response) {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    const currentPage = Math.max(1, page);
    const offset = (currentPage - 1) * limit;

    const totalItems = await db.$count(products);

    const totalPages = Math.ceil(totalItems / limit);

    const items = await db.query.products.findMany({
      with: {
        images: true,
      },
      orderBy: ({ createdAt, id }, { desc }) => [desc(createdAt), desc(id)],
      offset,
      limit,
      where: ({ sellerId }, { eq }) => eq(sellerId, req.user.id),
    });

    return res.status(200).json({
      items,
      currentPage,
      totalPages,
      totalItems,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    } satisfies PaginatedResult<typeof products.$inferSelect>);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: "PRODUCTS_FETCH_FAILED",
      message: "Failed to fetch products. Please try again later.",
    });
  }
}

const getProduct: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const paramsValidation = paramsSchema.safeParse(req.params);

    if (!paramsValidation.success) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Invalid request data",
        issues: paramsValidation.error.issues,
      });
    }

    const { id } = paramsValidation.data;

    const product = await db.query.products.findFirst({
      where: (product, { eq }) => eq(product.id, id),
    });

    if (!product) {
      return res.status(404).json({
        code: "PRODUCT_NOT_FOUND",
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: "PRODUCTS_FETCH_FAILED",
      message: "Failed to fetch products.",
    });
  }
};

async function searchProducts(req: Request, res: Response) {
  const limit = Number(req.query.limit ?? 10);

  const productValidation = searchSchema.safeParse({
    query: req.query.search,
  });

  if (!productValidation.success) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "Invalid request data",
      issues: productValidation.error.issues,
    });
  }

  const { query } = productValidation.data;

  console.log("QUERY=>", query);

  const result = await db
    .select({
      id: products.id,
      name: products.name,
      similarity: sql<number>`
        similarity(${products.name}, ${query})
      `.as("similarity"),
    })
    .from(products)
    .where(
      sql`
      ${products.name} ILIKE ${`%${query}%`}
      OR similarity(${products.name}, ${query}) > 0.2
    `,
    )
    .orderBy(desc(sql`similarity(${products.name}, ${query})`))
    .limit(limit);

  return res.json(result);
}

const SORT_MAP = {
  price_asc: asc(products.price),
  price_desc: desc(products.price),
  newest: desc(products.createdAt),
} as const;

type SortKey = keyof typeof SORT_MAP;

function isSortKey(value: unknown): value is SortKey {
  return typeof value === "string" && value in SORT_MAP;
}

const CATEGORIES = [
  "Fresh",
  "Dairy",
  "Snacks",
  "Beverages",
  "Staples",
  "Instant Food",
  "Personal Care",
  "Household",
] as const;

type Category = (typeof CATEGORIES)[number];

function isCategory(value: unknown): value is Category {
  return (
    typeof value === "string" &&
    (CATEGORIES as readonly string[]).includes(value)
  );
}

async function getProducts(req: Request, res: Response) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 20);
  const offset = (page - 1) * limit;

  const category = req.query.category as string | undefined;

  const sortKey = isSortKey(req.query.sort) ? req.query.sort : "newest";

  const categoryParam = isCategory(req.query.category)
    ? req.query.category
    : undefined;

  const where = categoryParam
    ? eq(products.category, categoryParam)
    : undefined;

  const orderBy = SORT_MAP[sortKey];

  try {
    const [items, count] = await Promise.all([
      db.query.products.findMany({
        with: { images: true },
        where,
        orderBy,
        limit,
        offset,
      }),

      await db
        .select({ count: sql<number>`count(*)` })
        .from(products)
        .where(where),
    ]);

    const totalItems = count[0]?.count ?? 0;

    res.json({ items, page, limit, totalPages: Math.ceil(totalItems / limit) });
  } catch {
    res.status(500).json({ error: "PRODUCT_FETCH_FAILED" });
  }
}

export {
  createProduct,
  getAllAdminProducts,
  getPresignedUrls,
  getProduct,
  getProducts,
  searchProducts,
};
