import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { FetchProductsParams } from "./products";
import { fetchProducts } from "@/http/api";
// import { fetchProducts, type FetchProductsParams } from '@/lib/api/products';

export const productKeys = {
  all: ["products"] as const,
  list: (params: FetchProductsParams) => ["products", "list", params] as const,
};

export function useProducts(params: FetchProductsParams) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => fetchProducts(Number(params)),
    // Keeps the previous page visible while the next one loads — no grid flash
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 2, // 2 min cache
  });
}
