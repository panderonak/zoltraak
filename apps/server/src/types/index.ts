export interface PaginatedResult<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export enum Product {
  PotatoChips = "Potato Chips",
  ChocolateBar = "Chocolate Bar",
  Candy = "Candy",
  Cookies = "Cookies",
  Crackers = "Crackers",
  GranolaBar = "Granola Bar",
  Nuts = "Nuts",
  BottledWater = "Bottled Water",
  SoftDrink = "Soft Drink",
}