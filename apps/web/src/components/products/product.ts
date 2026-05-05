export interface ProductImage {
  id: string;
  name: string;
  product_id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  price: string; // comes as string from API e.g. "40.00"
  category: string;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
}

export interface ProductsResponse {
  items: Product[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export type SortOption = 'newest' | 'price-low' | 'price-high';
