"use client";

import { env } from "@zoltraak/env/web";
import { Button } from "@zoltraak/ui/components/button";
import { ImageIcon, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import type { CartItem as CartItemProps } from "@/hooks/use-cart";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/price";
import type { Product } from "@/types";

const CartItem = ({ item }: { item: CartItemProps }) => {
	const { product, quantity } = item;

	const image = product.images[0];

	const { removeItem, increaseQuantity, decreaseQuantity } = useCart(
		(state) => state.actions,
	);

	// const label = PRODUCT_CATEGORIES.find(
	//   ({ value }) => value === product.category,
	// )?.label;

	return (
		<div className="space-y-3 py-2">
			<div className="flex items-start justify-between gap-4">
				<div className="flex items-center space-x-4">
					<div className="relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded">
						{typeof image !== "string" && image ? (
							<Image
								src={`https://${env.NEXT_PUBLIC_DISTRIBUTION_DOMAIN_NAME}/${image.name}`}
								alt={product.name}
								fill
								className="absolute object-cover"
							/>
						) : (
							<div className="flex h-full items-center justify-center bg-secondary">
								<ImageIcon
									aria-hidden="true"
									className="h-4 w-4 text-muted-foreground"
								/>
							</div>
						)}

						{/* <div className="text-xs text-muted-foreground"> */}
						<Button
							onClick={() => removeItem(product.id)}
							size={"icon-xs"}
							className="absolute top-0 right-0"
							variant={"secondary"}
						>
							<Trash2 className="size-3" />
							{/* Remove */}
						</Button>
						{/* </div> */}
					</div>

					<div className="flex flex-col gap-y-1 self-start">
						<span className="line-clamp-1 font-medium text-sm">
							{product.name}
						</span>

						<span className="line-clamp-1 text-muted-foreground text-xs capitalize">
							{product.category}
						</span>

						<span className="line-clamp-1 text-sm">
							{formatPrice(product.price)}
						</span>
					</div>
				</div>

				<div className="flex flex-col space-y-1 font-medium">
					{/* <span className="ml-auto line-clamp-1 text-sm">
            {formatPrice(product.price)}
          </span> */}
					<div className="flex items-center gap-x-2.5">
						<Button
							variant={"outline"}
							size={"icon-xs"}
							onClick={() => decreaseQuantity(product.id)}
						>
							<Minus className="size-3" />
						</Button>

						<span className="text-sm">{quantity}</span>

						<Button
							variant={"outline"}
							size={"icon-xs"}
							onClick={() => increaseQuantity(product.id)}
						>
							<Plus className="size-3" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CartItem;
