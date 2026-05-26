export function formatPrice(
	price: number | string,
	options: {
		currency?: "INR";
		notation?: Intl.NumberFormatOptions["notation"];
	} = {},
) {
	const { currency = "INR", notation = "standard" } = options;

	const numericPrice =
		typeof price === "string" ? Number.parseFloat(price) : price;

	return new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency,
		notation,
		maximumFractionDigits: 2,
	}).format(numericPrice);
}
