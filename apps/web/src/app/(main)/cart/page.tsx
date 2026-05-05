// "use client";
// import { FEE, PRODUCT_CATEGORIES } from "@/config";
// import { useCart } from "@/hooks/use-cart";
// import { formatPrice } from "@/lib/price";
// import { cn } from "@/lib/utils";
// import { env } from "@zoltraak/env/web";
// import { Button } from "@zoltraak/ui/components/button";
// import { Check, Loader2, X } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// const Page = () => {
//   const {
//     items,
//     actions: { removeItem },
//   } = useCart((state) => state);

//   const router = useRouter();

//   // const { mutate: createCheckoutSession, isLoading } =
//   //   trpc.payment.createSession.useMutation({
//   //     onSuccess: ({ url }) => {
//   //       if (url) router.push(url);
//   //     },
//   //   });

//   const handleCheckout = async () => {
//     const res = await fetch("/api/orders", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         items: items.map((item) => ({
//           productId: item.product.id,
//           quantity: item.quantity,
//         })),
//         pincode: "123456",
//         address: "Test Address",
//       }),
//     });

//     const data = await res.json();

//     const options = {
//       key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//       amount: data.amount,
//       currency: data.currency,
//       order_id: data.razorpayOrderId,

//       handler: async function (response: any) {
//         await fetch("/api/orders/payments/verify", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(response),
//         });

//         alert("Payment successful");
//       },
//     };

//     const rzp = new (window as any).Razorpay(options);
//     rzp.open();
//   };

//   const productIds = items.map(({ product }) => product.id);

//   const [isMounted, setIsMounted] = useState<boolean>(false);
//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   const cartTotal = items.reduce(
//     (total, { product }) => total + Number(product.price),
//     0,
//   );

//   return (
//     <div className="">
//       <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
//         <h1 className="font-bold text-3xl text-gray-900 tracking-tight sm:text-4xl">
//           Shopping Cart
//         </h1>

//         <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
//           <div
//             className={cn("lg:col-span-7", {
//               "rounded-lg border-2 border-dashed border-zinc-200 p-12":
//                 isMounted && items.length === 0,
//             })}
//           >
//             <h2 className="sr-only">Items in your shopping cart</h2>

//             {isMounted && items.length === 0 ? (
//               <div className="flex h-full flex-col items-center justify-center space-y-1">
//                 <div
//                   aria-hidden="true"
//                   className="relative mb-4 h-40 w-40 text-muted-foreground"
//                 >
//                   <Image
//                     src="/hippo-empty-cart.png"
//                     fill
//                     loading="eager"
//                     alt="empty shopping cart hippo"
//                   />
//                 </div>
//                 <h3 className="font-semibold text-2xl">Your cart is empty</h3>
//                 <p className="text-muted-foreground text-center">
//                   Whoops! Nothing to show here yet.
//                 </p>
//               </div>
//             ) : null}

//             <ul
//               className={cn({
//                 "divide-y divide-gray-200 border-gray-200 border-t border-b":
//                   isMounted && items.length > 0,
//               })}
//             >
//               {isMounted &&
//                 items.map(({ product }) => {
//                   // const label = PRODUCT_CATEGORIES.find(
//                   //   (c) => c.value === product.category,
//                   // )?.label;

//                   const image = product.images[0];

//                   return (
//                     <li key={product.id} className="flex py-6 sm:py-10">
//                       <div className="flex-shrink-0">
//                         <div className="relative h-24 w-24">
//                           {typeof image !== "string" && image ? (
//                             <Image
//                               fill
//                               src={`https://${env.NEXT_PUBLIC_DISTRIBUTION_DOMAIN_NAME}/${image.name}`}
//                               alt={product.name}
//                               className="h-full w-full rounded-md object-cover object-center sm:h-48 sm:w-48"
//                             />
//                           ) : null}
//                         </div>
//                       </div>

//                       <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
//                         <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
//                           <div>
//                             <div className="flex justify-between">
//                               <h3 className="text-sm">
//                                 <Link
//                                   // href={`/product/${product.id}`}
//                                   href={"/"}
//                                   className="font-medium text-gray-700 hover:text-gray-800"
//                                 >
//                                   {product.name}
//                                 </Link>
//                               </h3>
//                             </div>

//                             <div className="mt-1 flex text-sm">
//                               <p className="text-muted-foreground">
//                                 Category: {product.category}
//                               </p>
//                             </div>

//                             <p className="mt-1 text-sm font-medium text-gray-900">
//                               {formatPrice(product.price)}
//                             </p>
//                           </div>

//                           <div className="mt-4 sm:mt-0 sm:pr-9 w-20">
//                             <div className="absolute right-0 top-0">
//                               <Button
//                                 aria-label="remove product"
//                                 onClick={() => removeItem(product.id)}
//                                 variant="destructive"
//                                 size={"icon-sm"}
//                               >
//                                 <X className="size-4" aria-hidden="true" />
//                               </Button>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </li>
//                   );
//                 })}
//             </ul>
//           </div>

//           <section className="mt-16 rounded-lg bg-muted/50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
//             <h2 className="text-lg font-medium">Order summary</h2>

//             <div className="mt-6 space-y-4">
//               <div className="flex items-center justify-between">
//                 <p className="text-sm">Subtotal</p>
//                 <p className="text-sm font-medium">
//                   {isMounted ? (
//                     formatPrice(cartTotal)
//                   ) : (
//                     <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
//                   )}
//                 </p>
//               </div>

//               <div className="flex items-center justify-between border-t border-gray-200 pt-4">
//                 <div className="flex items-center text-sm text-muted-foreground">
//                   <span>Flat Transaction Fee</span>
//                 </div>
//                 <div className="text-sm font-medium text-gray-900">
//                   {isMounted ? (
//                     formatPrice(FEE)
//                   ) : (
//                     <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
//                   )}
//                 </div>
//               </div>

//               <div className="flex items-center justify-between border-t border-gray-200 pt-4">
//                 <div className="text-base font-medium text-gray-900">
//                   Order Total
//                 </div>
//                 <div className="text-base font-medium text-gray-900">
//                   {isMounted ? (
//                     formatPrice(cartTotal + FEE)
//                   ) : (
//                     <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div className="mt-6">
//               {/* <Button
//                 disabled={items.length === 0 || isLoading}
//                 onClick={() => createCheckoutSession({ productIds })}
//                 className="w-full"
//                 size="lg"
//               >
//                 {isLoading ? (
//                   <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
//                 ) : null}
//                 Checkout
//               </Button> */}
//               <Button
//                 className="w-full"
//                 size="lg"
//                 variant={"outline"}
//                 onClick={() => handleCheckout}
//               >
//                 Checkout
//               </Button>
//             </div>
//           </section>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Page;

"use client";

import { FEE } from "@/config";
import { useCart } from "@/hooks/use-cart";
import { createOrder, verifyPayment } from "@/http/api";
import { formatPrice } from "@/lib/price";
import { cn } from "@/lib/utils";
import { env } from "@zoltraak/env/web";
import { Button } from "@zoltraak/ui/components/button";
import { AxiosError } from "axios";
import { Check, Loader2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Page = () => {
  const {
    items,
    actions: { removeItem, clearCart },
  } = useCart((state) => state);

  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ✅ FIXED: includes quantity
  const cartTotal = items.reduce(
    (total, item) => total + Number(item.product.price) * item.quantity,
    0,
  );

  // ✅ COMPLETE CHECKOUT FLOW
  const handleCheckout = async () => {
    try {
      setIsLoading(true);

      const data = await createOrder({
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        pincode: "302001", // TODO: replace
        address: "Test Address", // TODO: replace
      });

      const options = {
        key: env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        order_id: data.razorpayOrderId,

        handler: async function (response: any) {
          await verifyPayment(response);

          clearCart(); // ✅ clear after success

          alert("Payment successful!");
        },

        modal: {
          ondismiss: () => {
            console.log("Payment cancelled");
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      const fallbackMessage = "Something went wrong";
      const message = err instanceof AxiosError
        ? (((err.response?.data as { message?: string } | undefined)?.message ??
            fallbackMessage) as string)
        : fallbackMessage;
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="font-bold text-3xl sm:text-4xl">Shopping Cart</h1>

        <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12">
          {/* CART ITEMS */}
          <div
            className={cn("lg:col-span-7", {
              "rounded-lg border-2 border-dashed p-12":
                isMounted && items.length === 0,
            })}
          >
            {isMounted && items.length === 0 ? (
              <div className="flex flex-col items-center">
                <Image
                  src="/hippo-empty-cart.png"
                  width={150}
                  height={150}
                  alt="empty cart"
                />
                <h3 className="text-2xl mt-4">Cart is empty</h3>
              </div>
            ) : null}

            <ul className="divide-y">
              {items.map((item) => {
                const image = item.product.images[0];

                return (
                  <li key={item.product.id} className="flex py-6">
                    <div className="relative h-24 w-24">
                      {image && (
                        <Image
                          fill
                          src={`https://${env.NEXT_PUBLIC_DISTRIBUTION_DOMAIN_NAME}/${image.name}`}
                          alt={item.product.name}
                          className="object-cover rounded-md"
                        />
                      )}
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <Link href="/">{item.product.name}</Link>

                        <Button
                          size="icon-sm"
                          variant="destructive"
                          onClick={() => removeItem(item.product.id)}
                        >
                          <X className="size-4" />
                        </Button>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {item.product.category}
                      </p>

                      <p className="font-medium">
                        {formatPrice(item.product.price)} × {item.quantity}
                      </p>

                      <p className="text-sm text-green-600 flex items-center gap-1">
                        <Check className="size-4" />
                        Instant delivery
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* SUMMARY */}
          <section className="mt-16 bg-muted/50 p-6 rounded-lg lg:col-span-5">
            <h2 className="text-lg font-medium">Order summary</h2>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p>
                  {isMounted ? (
                    formatPrice(cartTotal)
                  ) : (
                    <Loader2 className="animate-spin" />
                  )}
                </p>
              </div>

              <div className="flex justify-between border-t pt-4">
                <p>Fee</p>
                <p>{formatPrice(FEE)}</p>
              </div>

              <div className="flex justify-between border-t pt-4 font-bold">
                <p>Total</p>
                <p>{formatPrice(cartTotal + FEE)}</p>
              </div>
            </div>

            <Button
              className="w-full mt-6"
              onClick={handleCheckout}
              disabled={items.length === 0 || isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Checkout
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Page;
