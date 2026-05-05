"use client";

import { Card } from "@zoltraak/ui/components/card";
import { Button } from "@zoltraak/ui/components/button";
import { Badge } from "@zoltraak/ui/components/badge";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { getImageUrl } from "./products";
import type { Product } from "./product";
import { env } from "@zoltraak/env/web";
// import type { Product } from "@/lib/types/product";
// import { getImageUrl } from "@/lib/api/products";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);

  console.log("PRODUCTS =>", product);
  console.log("IMAGES =>", product.images);
  console.log("IMAGES ----- =>", product.images[0].name);
  console.log("DNS ----- =>", env.NEXT_PUBLIC_DISTRIBUTION_DOMAIN_NAME);

  const handleAddToCart = () => {
    setIsAdding(true);
    // TODO: wire up your cart mutation
    setTimeout(() => setIsAdding(false), 600);
  };

  const price = Number.parseFloat(product.price);
  const imageUrl = getImageUrl(product.images?.[0]?.name) && "";

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 flex flex-col h-full bg-card">
      {/* Image */}
      <div className="relative overflow-hidden bg-muted h-48">
        <Image
          src={`https://${env.NEXT_PUBLIC_DISTRIBUTION_DOMAIN_NAME}/${product.images[0].name}`}
          // src="/assets/hero-quick-commerce.jpg"
          alt={product.name}
          width={300}
          height={300}
          className="w-full h-full object-cover"
          priority={false}
        />
        <Badge variant="secondary" className="absolute top-2 left-2 text-xs">
          {product.category}
        </Badge>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-foreground text-sm md:text-base line-clamp-2 mb-1">
          {product.name}
        </h3>
        <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 mb-3">
          {product.description}
        </p>

        <div className="flex items-baseline gap-2 mb-4 mt-auto">
          <span className="text-lg font-bold text-foreground">
            ₹{price.toFixed(2)}
          </span>
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="w-full gap-2"
        >
          <ShoppingCart size={16} />
          <span className="text-sm">
            {isAdding ? "Adding..." : "Add to Cart"}
          </span>
        </Button>
      </div>
    </Card>
  );
}
