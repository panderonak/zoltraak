"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@zoltraak/ui/components/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@zoltraak/ui/components/card";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@zoltraak/ui/components/field";
import { Input } from "@zoltraak/ui/components/input";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	InputGroupTextarea,
} from "@zoltraak/ui/components/input-group";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { CheckoutError, type DeliveryData } from "@/app/(main)/cart/page";

// ─── Schema ───────────────────────────────────────────────────────────────────

// Defined outside the component so the object reference is stable across
// renders. If it were inside, Zod would create a new schema object every
// render, which can cause unnecessary re-validation.
const formSchema = z.object({
	pincode: z
		.string()
		.length(6, "Pincode must be exactly 6 digits.")
		.regex(/^\d+$/, "Pincode must contain only numbers."),
	address: z
		.string()
		.min(10, "Address is too short.")
		.max(100, "Address must be at most 100 characters."),
});

// ─── Props ────────────────────────────────────────────────────────────────────

type DeliveryDetailsProps = {
	/**
	 * Called with validated form values when the user submits.
	 *
	 * This is intentionally typed as returning Promise<void> rather than a
	 * more specific type — DeliveryDetails doesn't need to know what happens
	 * after submission (Razorpay, order creation, etc.). It only needs to know
	 * whether to expect a CheckoutError back.
	 *
	 * If onSuccess throws a CheckoutError with a `field`, that field error is
	 * shown inline on the relevant input. All other errors are assumed to have
	 * been handled upstream (toasted or redirected) and are silently ignored here.
	 */
	onSuccess: (data: DeliveryData) => Promise<void>;
	/**
	 * When true, all inputs and buttons are disabled and the submit button
	 * shows a loading spinner. Controlled by the parent so the form stays
	 * locked for the entire checkout duration (order creation + payment modal
	 * + verification), not just the form submission itself.
	 */
	isLoading?: boolean;
};

function DeliveryDetails({
	onSuccess,
	isLoading = false,
}: DeliveryDetailsProps) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: { pincode: "", address: "" },
	});

	/**
	 * form.handleSubmit wraps our async function with two guarantees:
	 *   1. It only calls the inner function if Zod validation passes — so by the
	 *      time onSuccess is called, the data is already clean and typed.
	 *   2. It prevents the default form submission (no page reload).
	 *
	 * The inner try/catch handles CheckoutErrors thrown back from onSuccess.
	 * These represent server-side validation failures that map to a specific
	 * field (e.g. WAREHOUSE_NOT_FOUND → pincode). All other thrown values have
	 * already been handled by the parent (toasted or redirected), so we
	 * intentionally let them pass through without action.
	 */
	const handleSubmit = form.handleSubmit(async (data) => {
		try {
			await onSuccess(data);
		} catch (err) {
			if (err instanceof CheckoutError && err.field) {
				// Set the server error directly on the form field so it renders
				// inline below the input — exactly where the user needs to fix it.
				// This is more informative than a toast for field-specific errors
				// because it makes clear which input is responsible.
				form.setError(err.field, { message: err.message });
			}
			// Non-CheckoutError values (or CheckoutErrors without a field) are
			// intentionally swallowed here. The parent already handled them.
		}
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>Delivery Address</CardTitle>
			</CardHeader>

			<CardContent>
				{/*
          The form has an `id` so the submit button in CardFooter can target it
          via form="delivery-details-form". This avoids having to nest the button
          inside the form element, which would break the card layout.
        */}
				<form id="delivery-details-form" onSubmit={handleSubmit}>
					<FieldGroup>
						<Controller
							name="pincode"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="pincode">Pincode</FieldLabel>
									<Input
										{...field}
										id="pincode"
										placeholder="302001"
										autoComplete="postal-code"
										aria-invalid={fieldState.invalid}
										inputMode="numeric" // Shows a number keyboard on mobile
										maxLength={6}
										disabled={isLoading}
										onChange={(e) => {
											field.onChange(e);

											// WHY MANUALLY CLEAR ON CHANGE?
											// Errors set via form.setError() (like WAREHOUSE_NOT_FOUND
											// from the server) are not automatically cleared when the
											// field value changes — unlike Zod validation errors, which
											// re-run on every change. Without this, the server error
											// would persist on screen even after the user has already
											// typed a new pincode, which is confusing.
											if (fieldState.error?.message) {
												form.clearErrors("pincode");
											}
										}}
									/>
									<FieldDescription>
										Enter your 6-digit area pincode.
									</FieldDescription>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>

						<Controller
							name="address"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="address">Address</FieldLabel>
									<InputGroup>
										<InputGroupTextarea
											{...field}
											id="address"
											rows={5}
											className="min-h-24 resize-none"
											placeholder="House no, street, area, landmark…"
											aria-invalid={fieldState.invalid}
											disabled={isLoading}
										/>

										{/* Live character counter so the user knows how close they
                        are to the 100-character limit before hitting submit. */}
										<InputGroupAddon align="block-end">
											<InputGroupText className="tabular-nums">
												{field.value.length}/100
											</InputGroupText>
										</InputGroupAddon>
									</InputGroup>

									<FieldDescription>
										Include house number, street, landmark, and area.
									</FieldDescription>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
					</FieldGroup>
				</form>
			</CardContent>

			<CardFooter>
				<Field orientation="horizontal">
					{/* Reset clears all field values and errors back to defaultValues.
              Disabled during checkout so the user can't wipe their address
              mid-payment (the form stays mounted even while the modal is open). */}
					<Button
						type="button"
						variant="outline"
						onClick={() => form.reset()}
						disabled={isLoading}
						size="lg"
					>
						Reset
					</Button>

					<Button
						type="submit"
						form="delivery-details-form" // Targets the form by id (see above)
						disabled={isLoading}
						size="lg"
					>
						{isLoading ? (
							// Spinner + label change gives the user clear feedback that their
							// submission is in progress, without needing a separate status message.
							<>
								<Loader2 className="mr-0.5 size-4 animate-spin" />
								Placing Order
							</>
						) : (
							"Place Order"
						)}
					</Button>
				</Field>
			</CardFooter>
		</Card>
	);
}

export { DeliveryDetails };
