"use client";

import { Button } from "@zoltraak/ui/components/button";
import { useEffect, useState } from "react";
import { useCart } from "@/hooks/use-cart";
import type { Product } from "@/types";

interface AddToCartButtonProps {
	product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
	const { addItem } = useCart((state) => state.actions);
	const [isSuccess, setIsSuccess] = useState<boolean>(false);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setIsSuccess(false);
		}, 2000);

		return () => clearTimeout(timeout);
	}, []);

	return (
		<Button
			onClick={() => {
				addItem(product);
				setIsSuccess(true);
			}}
			size="lg"
			className="w-full"
		>
			{isSuccess ? "Added!" : "Add to cart"}
		</Button>
	);
}
