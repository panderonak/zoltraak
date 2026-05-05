// import { api } from '@/lib/api'; // your existing axios instance
// import type { ProductsResponse, SortOption } from '@/lib/types/product';

import type { ProductsResponse } from "@/types";
import type { SortOption } from "./product";
import { api } from "@/lib/axios";

export interface FetchProductsParams {
  page: number;
  limit?: number;
  category?: string; // empty string = no filter
  sort?: SortOption; // maps 1-to-1 to API sort param
}

export async function fetchProducts(
  params: FetchProductsParams,
): Promise<ProductsResponse> {
  const { page, limit = 10, category, sort } = params;

  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (category) query.set("category", category);
  if (sort) query.set("sort", sort);

  const res = await api.get<ProductsResponse>(`/products?${query}`);
  return res.data;
}

/**
 * Build the URL for a product image.
 * Swap the base for your CDN/S3 origin as needed.
 */
export function getImageUrl(imageName: string | undefined): string {
  if (!imageName) return "/placeholder-product.jpg";
  return `${process.env.NEXT_PUBLIC_API_URL}/images/${imageName}`;
}
