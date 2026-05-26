"use client";

import { env } from "@zoltraak/env/web";
import { Skeleton } from "@zoltraak/ui/components/skeleton";
import Link from "next/link";
import { useEffect, useState } from "react";
import ImageSlider from "@/app/(main)/products/_components/image-slider";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { formatPrice } from "@/lib/price";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

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

	const imageUrls = product.images.map(
		(img) => `https://${env.NEXT_PUBLIC_DISTRIBUTION_DOMAIN_NAME}/${img.name}`,
	);

	if (isVisible && product) {
		return (
			<div className="flex flex-col gap-y-1">
				<Link
					className={cn("group/main invisible h-full w-full cursor-pointer", {
						"fade-in-5 visible animate-in": isVisible,
					})}
					href={`/products/${product.id}`}
				>
					<div className="flex w-full flex-col">
						<ImageSlider urls={imageUrls} category={product.category} />
						<h3 className="mt-4 font-semibold text-md">{product.name}</h3>
						<p className="mt-1 mb-3 font-bold text-sm">
							{formatPrice(product.price)}
						</p>
					</div>
				</Link>
				<AddToCartButton product={product} />
			</div>
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
