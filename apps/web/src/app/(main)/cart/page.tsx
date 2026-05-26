"use client";

import { env } from "@zoltraak/env/web";
import { Badge } from "@zoltraak/ui/components/badge";
import { Button } from "@zoltraak/ui/components/button";
import { ArrowLeft, Loader2, ShoppingCartIcon, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DeliveryDetails } from "@/app/(main)/cart/_components/delivery-details";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { FEE } from "@/config";
import { useCart } from "@/hooks/use-cart";
import { createOrder, verifyPayment } from "@/http/api";
import { extractApiError } from "@/lib/extract-api-error";
import { formatPrice } from "@/lib/price";
import { openRazorpay } from "@/lib/razorpay";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * The two screens in the checkout flow.
 *
 * WHY A UNION TYPE INSTEAD OF A BOOLEAN?
 * A boolean (shouldContinue: true/false) makes the code harder to read because
 * you have to remember which value maps to which screen. A named union makes
 * the intent self-documenting: `step === "cart"` or `step === "address"`.
 * It also makes adding a future step (e.g. "confirmation") a one-word change
 * rather than a refactor of boolean logic.
 */
type Step = "cart" | "address";

/**
 * The validated form values collected from the user before checkout.
 * Exported so DeliveryDetails can type its onSuccess callback against the
 * same shape, keeping both components in sync without duplication.
 */
type DeliveryData = {
	pincode: string;
	address: string;
};

/**
 * A specialised Error subclass that carries two extra pieces of information:
 *   - `code`  — the backend error code (e.g. "WAREHOUSE_NOT_FOUND")
 *   - `field` — optionally, which DeliveryData field caused the error
 *
 * WHY A CUSTOM ERROR CLASS?
 * Some server errors belong on a specific form input (e.g. WAREHOUSE_NOT_FOUND
 * should highlight the pincode field with an inline message), while others
 * belong in a floating toast. A plain Error can't carry that routing intent.
 * CheckoutError gives DeliveryDetails enough information to decide: if `field`
 * is set, call form.setError(); otherwise, the error was already handled
 * upstream by handleCheckout (toasted or redirected).
 *
 * WHY EXTEND Error?
 * Extending Error means `instanceof CheckoutError` works correctly in catch
 * blocks, and the error appears correctly in stack traces with its custom name.
 */
class CheckoutError extends Error {
	constructor(
		public readonly code: string,
		message: string,
		// keyof DeliveryData constrains this to "pincode" | "address" so TypeScript
		// will catch a typo like "pincod" at compile time rather than silently
		// failing to set the right field at runtime.
		public readonly field?: keyof DeliveryData,
	) {
		super(message);
		// Setting name gives more useful output in logs than the generic "Error".
		this.name = "CheckoutError";
	}
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const Page = () => {
	const {
		items,
		actions: { removeItem, clearCart },
	} = useCart((state) => state);

	const router = useRouter();

	const [isMounted, setIsMounted] = useState(false);
	const [isCheckingOut, setIsCheckingOut] = useState(false);
	const [step, setStep] = useState<Step>("cart");

	// WHY isMounted?
	// useCart persists the cart in localStorage via Zustand's persist middleware.
	// On the server there is no localStorage, so the initial render always has
	// an empty cart. If we rendered the cart total server-side we'd get a
	// hydration mismatch. isMounted delays rendering of any cart-derived values
	// until after the first client-side paint, when localStorage is available.
	useEffect(() => {
		setIsMounted(true);
	}, []);

	const cartTotal = items.reduce(
		(total, { product, quantity }) => total + Number(product.price) * quantity,
		0,
	);

	// ─── Checkout orchestrator ─────────────────────────────────────────────────

	/**
	 * The central coordinator for the entire checkout flow. It runs in three
	 * sequential phases: createOrder → Razorpay modal → verifyPayment.
	 *
	 * It receives DeliveryData from the DeliveryDetails form and is responsible
	 * for all side effects: toast notifications, step navigation, cart clearing,
	 * and throwing CheckoutErrors back to the form for field-level display.
	 */
	const handleCheckout = async ({ pincode, address }: DeliveryData) => {
		// A persistent loading toast is shown for the createOrder phase. It's
		// dismissed before the Razorpay modal opens so it doesn't stack on screen.
		const toastId = toast.loading("Preparing your order...");

		try {
			setIsCheckingOut(true);

			// ── Phase 1: Create the order on the backend ───────────────────────────
			//
			// This inner try/catch handles createOrder failures separately from the
			// outer try/finally. That separation matters because different error codes
			// require different recovery actions — some need field errors, some need
			// navigation, some just need a toast.

			let order: Awaited<ReturnType<typeof createOrder>>;

			try {
				order = await createOrder({
					items: items.map(({ product, quantity }) => ({
						productId: product.id,
						quantity,
					})),
					pincode,
					address,
				});
			} catch (err) {
				// Always dismiss the loading toast before branching. If we toasted
				// inside each case, a forgotten branch would leave it spinning forever.
				toast.dismiss(toastId);

				const { code, message } = extractApiError(err);

				switch (code) {
					// WAREHOUSE_NOT_FOUND means the pincode isn't served by any warehouse.
					// This is a field-level error: the user needs to correct their pincode.
					// We throw a CheckoutError with field="pincode" so DeliveryDetails
					// can call form.setError("pincode", ...) and display it inline.
					case "WAREHOUSE_NOT_FOUND":
						throw new CheckoutError(code, message, "pincode");

					// STOCK_LOW means the cart has more quantity than what's available.
					// The user needs to go back and reduce quantities, so we navigate
					// them back to the cart step rather than leaving them on the form.
					case "STOCK_LOW":
						toast.error("Stock issue", { description: message });
						setStep("cart");
						return;

					// Any other error (PAYMENT_INIT_FAILED, ORDER_FAILED, network errors)
					// is surfaced as a generic toast. The user stays on the address step
					// so they can try again without re-entering their details.
					default:
						toast.error("Could not place order", { description: message });
						return;
				}
			}

			// Dismiss before opening the modal. If the toast were visible while the
			// Razorpay modal is open, the UI would look broken (two status indicators
			// on screen at once).
			toast.dismiss(toastId);

			// ── Phase 2: Razorpay payment modal ───────────────────────────────────
			//
			// openRazorpay wraps the callback-based SDK in a Promise so we can await
			// it linearly. It resolves on both success (handler) and dismiss
			// (ondismiss), so this await always completes.

			await openRazorpay({
				order,
				onSuccess: async (paymentResponse) => {
					// Payment completed on Razorpay's side. Now verify the signature
					// server-side to confirm the payment is authentic before marking
					// the order as paid and clearing the cart.
					const verifyId = toast.loading("Verifying payment…");

					try {
						await verifyPayment(paymentResponse);

						// Only clear the cart after a confirmed server-side verification.
						// Clearing it earlier (e.g. after Razorpay's handler fires) would
						// lose cart data if the network call to verifyPayment failed.
						clearCart();

						toast.success("Order placed! 🎉", {
							id: verifyId,
							description: "Your order is confirmed and on its way.",
						});

						router.push("/products");
					} catch (err) {
						const { message } = extractApiError(err);
						toast.error("Payment verification failed", {
							id: verifyId,
							description: message,
						});
					}
				},

				onDismiss: () => {
					// The user closed the modal without completing payment. There's
					// nothing to clean up on the client — the server's releaseOrderResources
					// handles the orphaned "reserved" order automatically.
				},
			});
		} finally {
			// isCheckingOut is reset in finally so it always runs, even if an
			// unhandled error escapes the try block. This ensures the form never
			// stays permanently disabled.
			setIsCheckingOut(false);
		}
	};

	return (
		<MaxWidthWrapper>
			<div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
				{/* Header — shows a back button when on the address step so the user
            can return to the cart without losing their address form data
            (the form stays mounted, just hidden). Disabled during checkout
            so the user can't navigate away mid-payment. */}
				<div className="flex items-center gap-3">
					{step === "address" && (
						<Button
							variant="outline"
							size="icon"
							onClick={() => setStep("cart")}
							disabled={isCheckingOut}
							aria-label="Back to cart"
						>
							<ArrowLeft className="size-5" />
						</Button>
					)}
					<h1 className="font-bold text-3xl sm:text-4xl">
						{step === "cart" ? "Shopping Cart" : "Delivery Details"}
					</h1>
				</div>

				{/* ── Step: Cart ─────────────────────────────────────────────────── */}
				{step === "cart" && (
					<div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12">
						<div
							className={cn("lg:col-span-7", {
								// Only apply the empty-state border after mount, because before
								// mount isMounted is false and items is always [] (no localStorage).
								// Without this guard we'd flash the empty state on first render
								// even when the cart has items.
								"rounded-lg border-2 border-dashed p-12":
									isMounted && items.length === 0,
							})}
						>
							{isMounted && items.length === 0 ? (
								<div className="flex h-full flex-col items-center justify-center">
									<ShoppingCartIcon className="size-18 text-muted-foreground" />
									<h3 className="mt-4 font-medium text-xl">
										Your cart is empty.
									</h3>
								</div>
							) : (
								<ul className="divide-y">
									{items.map(({ product, quantity }) => {
										const image = product.images[0];
										return (
											<li key={product.id} className="flex py-6">
												<div className="relative h-24 w-24 shrink-0">
													{image && (
														<Image
															fill
															src={`https://${env.NEXT_PUBLIC_DISTRIBUTION_DOMAIN_NAME}/${image.name}`}
															alt={product.name}
															className="rounded-md object-cover"
														/>
													)}
												</div>

												<div className="ml-4 flex flex-1 flex-col">
													<div className="flex justify-between">
														<Link
															href={`/products/${product.id}`}
															className="hover:underline"
														>
															{product.name}
														</Link>

														<Button
															size="icon-xs"
															variant="outline"
															onClick={() => removeItem(product.id)}
															aria-label={`Remove ${product.name}`}
														>
															<X className="size-3.5" />
														</Button>
													</div>

													<Badge variant="outline">{product.category}</Badge>

													<p className="font-medium">
														{formatPrice(product.price)} × {quantity}
													</p>
												</div>
											</li>
										);
									})}
								</ul>
							)}
						</div>

						{/* Order summary sidebar */}
						<section className="mt-16 rounded-lg bg-muted/50 p-6 lg:col-span-5 lg:mt-0">
							<h2 className="font-medium text-lg">Order Summary</h2>
							<div className="mt-6 space-y-4">
								<div className="flex justify-between">
									<p>Subtotal</p>
									{/* Show a spinner instead of ₹0 before mount, so the user
                      doesn't see an incorrect total flash on first render. */}
									<p>
										{isMounted ? (
											formatPrice(cartTotal)
										) : (
											<Loader2 className="animate-spin" />
										)}
									</p>
								</div>

								<div className="flex justify-between border-t pt-4">
									<p>Delivery fee</p>
									<p>{formatPrice(FEE)}</p>
								</div>

								<div className="flex justify-between border-t pt-4 font-bold">
									<p>Total</p>
									<p>{formatPrice(cartTotal + FEE)}</p>
								</div>
							</div>

							{/* Disabled until mounted (to avoid acting on a stale empty cart)
                  and when the cart is empty (nothing to check out). */}
							<Button
								className="mt-6 w-full"
								onClick={() => setStep("address")}
								disabled={!isMounted || items.length === 0}
							>
								Continue to Delivery
							</Button>
						</section>
					</div>
				)}

				{/* ── Step: Address ──────────────────────────────────────────────── */}
				{step === "address" && (
					<div className="mt-12">
						{/* DeliveryDetails owns the form UI and validation.
                handleCheckout is passed as onSuccess — the form calls it
                with clean, validated data and handles any CheckoutError
                that comes back by setting the appropriate field error. */}
						<DeliveryDetails
							onSuccess={handleCheckout}
							isLoading={isCheckingOut}
						/>
					</div>
				)}
			</div>
		</MaxWidthWrapper>
	);
};

export { CheckoutError, type DeliveryData };
export default Page;
