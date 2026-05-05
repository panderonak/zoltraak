"use client";

import { formatPrice } from "@/lib/price";
import { Button, buttonVariants } from "@zoltraak/ui/components/button";
import { Separator } from "@zoltraak/ui/components/separator";
import { ScrollArea } from "@zoltraak/ui/components/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@zoltraak/ui/components/sheet";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { useEffect, useState } from "react";
import CartItem from "@/components/cart-item";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FEE } from "@/config";

export function Cart() {
  const { items } = useCart((state) => state);
  // const itemCount = items.length;

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cartTotal = items.reduce(
    (total, { product, quantity }) => total + Number(product.price) * quantity,
    0,
  );

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant={"ghost"}>
            <ShoppingCart aria-hidden="true" className="size-5 shrink-0" />
            <span className="ml-2 font-medium">
              {isMounted ? itemCount : 0}
            </span>
          </Button>
        }
      />

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Cart ({itemCount})</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        {/* <div className="grid flex-1 auto-rows-min gap-6 px-4"> */}
        {itemCount > 0 ? (
          <>
            <ScrollArea className="min-h-1/2 px-6 py-2">
              {items.map((item, index) => (
                <CartItem item={item} key={`${item.product.id}-${index}`} />
              ))}
            </ScrollArea>

            <SheetFooter>
              <Separator className="mb-3" />
              <div className="space-y-3 text-sm">
                <div className="flex">
                  <span className="flex-1">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex">
                  <span className="flex-1">Transaction Fee</span>
                  <span>{formatPrice(FEE)}</span>
                </div>
                <div className="flex">
                  <span className="flex-1">Total</span>
                  <span>{formatPrice(cartTotal + FEE)}</span>
                </div>
              </div>
              <div className="flex flex-col gap-y-3">
                <SheetTrigger>
                  <Link
                    href="/cart"
                    className={cn(
                      buttonVariants({
                        className: "w-full",
                      }),
                    )}
                  >
                    Continue to Checkout
                  </Link>
                </SheetTrigger>

                <SheetClose render={<Button variant="outline">Close</Button>} />
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-1">
            <div
              aria-hidden="true"
              className="relative mb-4 h-60 w-60 text-muted-foreground"
            >
              <Image
                src="/assets/online-shopping.svg"
                fill
                alt="empty shopping cart"
              />
            </div>
            <div className="font-semibold text-xl">Your cart is empty</div>
            <SheetTrigger>
              <Link
                href="/products"
                className={buttonVariants({
                  variant: "link",
                  size: "sm",
                  className: "text-muted-foreground text-sm",
                })}
              >
                Add items to your cart to checkout
              </Link>
            </SheetTrigger>
          </div>
        )}
        {/* </div> */}
      </SheetContent>
    </Sheet>
  );
}
