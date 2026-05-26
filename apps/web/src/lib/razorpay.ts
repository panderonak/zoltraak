import { env } from "@zoltraak/env/web";
import type { VerifyPaymentPayload } from "@/types";

type RazorpayOptions = {
	order: { razorpayOrderId: string; amount: number; currency: string };
	/**
	 * Called with the typed Razorpay payment response when the user completes
	 * payment. The three fields here are exactly what the backend's verifyPayment
	 * endpoint expects — keeping the types aligned prevents a mismatch at the
	 * call site.
	 */
	onSuccess: (response: VerifyPaymentPayload) => Promise<void>;
	onDismiss: () => void;
};

/**
 * Opens the Razorpay payment modal and returns a Promise that resolves when
 * the modal closes — either via a successful payment or a user dismissal.
 *
 * WHY A PROMISE WRAPPER?
 * The Razorpay SDK is callback-based: it fires `handler` on success and
 * `modal.ondismiss` on close. Wrapping it in a Promise lets handleCheckout
 * in page.tsx use a linear `await` instead of nesting callbacks inside
 * callbacks. The flow reads top-to-bottom, which makes error handling and
 * sequencing (dismiss loading toast → open modal → verify payment) much easier
 * to follow and maintain.
 *
 * WHY BOTH PATHS CALL resolve()?
 * A Promise that never settles would leave handleCheckout suspended forever.
 * Both the success handler and ondismiss must call resolve() so the Promise
 * always completes regardless of which path the user takes. We use resolve()
 * in both cases (not reject()) because a dismissed modal is not an error —
 * it's an expected user action.
 *
 * THE TYPE CAST
 * Razorpay's SDK types its handler response as a loose Record<string, string>.
 * We cast it to VerifyPaymentPayload here — at the Razorpay boundary — because
 * this is the one place that owns the knowledge of what Razorpay actually
 * returns. Casting here keeps every caller fully typed without needing their
 * own casts or workarounds.
 */
function openRazorpay({ order, onSuccess, onDismiss }: RazorpayOptions) {
	return new Promise<void>((resolve) => {
		const rzp = new (window as any).Razorpay({
			key: env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
			amount: order.amount,
			currency: order.currency,
			order_id: order.razorpayOrderId,

			handler: async (response: Record<string, string>) => {
				// Cast the raw Razorpay response to the typed payload here so the
				// rest of the codebase works with a known, validated shape.
				await onSuccess(response as VerifyPaymentPayload);
				resolve();
			},

			modal: {
				ondismiss: () => {
					onDismiss();
					resolve();
				},
			},
		});

		rzp.open();
	});
}

export { openRazorpay };
