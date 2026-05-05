import type { categoryEnum, Order } from "@zoltraak/db/schema";

type FileWithProgress = {
  id: string;
  file: File;
  preview: string;
  progress: number;
  uploaded: boolean;
};

type Category = (typeof categoryEnum.enumValues)[number];

type AdminProductsResponse = {
  items: {
    id: string;
    sellerId: string;
    name: string;
    description: string;
    price: string;
    category: Category;
    createdAt: string;
    updatedAt: string;
    images: {
      id: string;
      name: string;
      product_id: string;
      createdAt: string;
      updatedAt: string;
    }[];
  }[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

type WarehouseResponse = {
  items: {
    id: string;
    name: string;
    pincode: string;
    tsv: string;
    createdAt: string;
    updatedAt: string;
  }[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

type DeliveryPersonResponse = {
  items: {
    id: string;
    name: string;
    phone: string;
    warehouse: {
      name: string;
    };
  }[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

type OrdersResponse = {
  items: {
    id: string;
    price: number;
    status: Order["status"];
    createdAt: string;
    user: {
      name: string;
    };
    orderItems: {
      quantity: number;
      product: {
        name: string;
      };
    }[];
  }[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

type WarehousesSearch = {
  id: string;
  name: string;
  pincode: string;
  similarity: number;
}[];

type ProductsSearch = {
  id: string;
  name: string;
  similarity: number;
}[];

type ProductQuery = {
  page: number;
  limit?: number;
  category?: string;
  sort?: "newest" | "price_asc" | "price_desc";
};

type ProductsResponse = {
  items: {
    id: string;
    sellerId: string;
    name: string;
    description: string;
    price: string;
    category: string;
    createdAt: string;
    updatedAt: string;
    images: {
      id: string;
      name: string;
      product_id: string;
      createdAt: string;
      updatedAt: string;
    }[];
  }[];
  page: number;
  limit: number;
  totalPages: number;
};

export type Product = ProductsResponse["items"][number];

export type Sort = "newest" | "price_asc" | "price_desc";

// TYPES
type CreateOrderPayload = {
  items: {
    productId: string;
    quantity: number;
  }[];
  pincode: string;
  address: string;
};

type CreateOrderResponse = {
  orderId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
};

type VerifyPaymentPayload = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

export type {
  AdminProductsResponse,
  CreateOrderPayload,
  CreateOrderResponse,
  DeliveryPersonResponse,
  FileWithProgress,
  OrdersResponse,
  ProductQuery,
  ProductsResponse,
  ProductsSearch,
  VerifyPaymentPayload,
  WarehouseResponse,
  WarehousesSearch,
};
