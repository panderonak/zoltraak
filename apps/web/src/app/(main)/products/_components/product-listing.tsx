"use client";

import { env } from "@zoltraak/env/web";
import { Skeleton } from "@zoltraak/ui/components/skeleton";
import Link from "next/link";
import { useEffect, useState } from "react";
import ImageSlider from "@/app/(main)/products/_components/image-slider";
import { formatPrice } from "@/lib/price";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";
import { AddToCartButton } from "@/components/add-to-cart-button";

interface Props {
  product: Product | null;
  index: number;
}

const ProductListing = ({ product, index }: Props) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setIsVisible(true);
    }, index * 75);

    return () => clearTimeout(t);
  }, [index]);

  if (!product || !isVisible) {
    return <ProductPlaceholder />;
  }

  // const label = PRODUCT_CATEGORIES.find(
  //   ({ value }) => value === product.category,
  // )?.label;

  // const label = PRODUCT_CATEGORIES.find((value) => value === product.category);

  const imageUrls = product.images.map(
    (img) => `https://${env.NEXT_PUBLIC_DISTRIBUTION_DOMAIN_NAME}/${img.name}`,
  );

  if (isVisible && product) {
    return (
      <Link
        className={cn("group/main invisible h-full w-full cursor-pointer", {
          "fade-in-5 visible animate-in": isVisible,
        })}
        // href={`/product/${product.id}`}
        href={"/products"}
      >
        <div className="flex w-full flex-col">
          <ImageSlider urls={imageUrls} category={product.category} />
          <h3 className="mt-4 font-semibold text-md">{product.name}</h3>
          <p className="mt-1 font-bold text-sm">{formatPrice(product.price)}</p>
        </div>
        <AddToCartButton product={product} />
      </Link>
    );
  }
};

const ProductPlaceholder = () => {
  return (
    <div className="flex w-full flex-col">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-100">
        <Skeleton className="h-full w-full" />
      </div>
      <Skeleton className="mt-4 h-4 w-2/3 rounded-lg" />
      {/* <Skeleton className="mt-2 h-4 w-16 rounded-lg" /> */}
      <Skeleton className="mt-2 h-4 w-12 rounded-lg" />
    </div>
  );
};

export default ProductListing;
