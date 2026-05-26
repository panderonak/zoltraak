"use client";

import { AddToCartButton } from "@/components/add-to-cart-button";
import { ErrorState } from "@/components/error-state";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { fetchProduct } from "@/http/api";
import { formatPrice } from "@/lib/price";
import type { ProductResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { env } from "@zoltraak/env/web";
import { notFound } from "next/navigation";
import ImageSlider from "./image-slider";
import { Skeleton } from "@zoltraak/ui/components/skeleton";

interface ProductsProps {
  productId: string;
}

export function Products({ productId }: ProductsProps) {
  const {
    data: product,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery<ProductResponse>({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct(productId),
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
    staleTime: 120000,
  });

  if (isLoading) {
    return <ProductSkeleton />;
  }

  if (isError) {
    return <ErrorState refetch={refetch} isRefetching={isRefetching} />;
  }

  if (!product) return notFound();

  const imageUrls = product.images.map(
    (img) => `https://${env.NEXT_PUBLIC_DISTRIBUTION_DOMAIN_NAME}/${img.name}`,
  );

  return (
    <MaxWidthWrapper>
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
        <div className="lg:max-w-lg lg:self-end">
          <div className="mt-4">
            <h1 className="font-bold text-3xl tracking-tight sm:text-4xl">
              {product.name}
            </h1>
          </div>

          <section className="mt-4">
            <div className="flex items-center">
              <p className="font-medium">{formatPrice(product.price)}</p>

              <div className="ml-4 border-gray-300 border-l pl-4 text-muted-foreground">
                {product.category}
              </div>
            </div>

            <div className="mt-4 space-y-6">
              <p className="text-base text-muted-foreground">
                {product.description}
              </p>
            </div>
          </section>
        </div>

        <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
          <div className="aspect-square rounded-lg">
            <ImageSlider urls={imageUrls} category={product.category} />
          </div>
        </div>

        <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
          <div>
            <div className="mt-10">
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}

export function ProductSkeleton() {
  return (
    <MaxWidthWrapper>
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
        <div className="lg:max-w-lg lg:self-end">
          {/* Title */}
          <div className="mt-4 space-y-3">
            <Skeleton className="h-10 w-80 rounded-xl" />
          </div>

          <section className="mt-6">
            {/* Price + Category */}
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-14 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>

            {/* Description */}
            <div className="mt-6 space-y-3">
              <Skeleton className="h-4 w-full rounded-full" />
              <Skeleton className="h-4 w-[90%] rounded-full" />
              <Skeleton className="h-4 w-[70%] rounded-full" />
            </div>
          </section>
        </div>

        {/* Product Image */}
        <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
          <Skeleton className="aspect-square w-full rounded-2xl" />

          {/* Slider Dots */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <Skeleton className="h-2 w-2 rounded-full" />
            <Skeleton className="h-2 w-2 rounded-full" />
          </div>
        </div>

        {/* Button */}
        <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
          <Skeleton className="h-9 w-full rounded-4xl" />
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
