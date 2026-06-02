const MAX_FILES = 4;
const ACCEPTED_TYPES = ["jpg", "jpeg", "png"];
const DELIVERY_FEE = 50;
const MAX_SIZE = 5 * 1024 * 1024;
const PRODUCT_CATEGORIES = [
	"Fresh",
	"Dairy",
	"Snacks",
	"Beverages",
	"Staples",
	"Instant Food",
	"Personal Care",
	"Household",
] as const;

export {
	ACCEPTED_TYPES,
	DELIVERY_FEE,
	MAX_FILES,
	MAX_SIZE,
	PRODUCT_CATEGORIES,
};
