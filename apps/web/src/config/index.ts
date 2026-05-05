import { categoryEnum } from "@zoltraak/db/schema";

export const MAX_FILES = 4;
export const ACCEPTED_TYPES = ["jpg", "jpeg", "png"];
export const MAX_SIZE = 5 * 1024 * 1024;
export const PRODUCT_CATEGORIES = categoryEnum.enumValues;
export const FEE = 50;

// export const PRODUCT_CATEGORIES = categoryEnum.enumValues.map((c) => ({
//   label: c,
//   value: c,
// }));
