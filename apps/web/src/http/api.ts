import type {
  DeliveryPerson,
  Inventories,
  Warehouse,
} from "@zoltraak/db/schema";
import { api } from "@/lib/axios";
import type {
  CreateOrderPayload,
  CreateOrderResponse,
  ProductQuery,
  ProductsResponse,
  VerifyPaymentPayload,
  WarehousesSearch,
} from "@/types";
import { env } from "@zoltraak/env/web";

async function fetchAdminProducts(page: number) {
  console.log("Reloading...");
  const res = await api.get(`/products/admin?page=${page}&limit=10`);
  return res.data;
}

async function fetchInventories(page: number) {
  console.log("Reloading...");
  return await api.get(`/inventories?page=${page}&limit=10`);
}

async function createWarehouse(values: Pick<Warehouse, "name" | "pincode">) {
  console.log("Creating");
  return await api.post("/warehouses", values);
}

async function fetchWarehouses(page: number) {
  console.log("Reloading...");
  return await api.get(`/warehouses?page=${page}&limit=10`);
}

async function searchWarehouses(query: string): Promise<WarehousesSearch> {
  const res = await api.get(`/warehouses/search?search=${query}&limit=10`);
  return res.data;
}

async function searchProducts(query: string) {
  const res = await api.get(`/products/search?search=${query}&limit=10`);
  return res.data;
}

async function fetchDeliveryPersons(page: number) {
  console.log("Reloading...");
  return await api.get(`/delivery-persons?page=${page}&limit=10`);
}

async function createDeliveryPerson(
  values: Pick<DeliveryPerson, "name" | "phone" | "warehouseId">,
) {
  const res = await api.post("/delivery-persons", values);
  return res;
}

async function createInventory(
  values: Pick<Inventories, "sku" | "warehouseId" | "productId">,
) {
  const res = await api.post("/inventories", values);
  return res;
}

async function fetchOrders(page: number) {
  return await api.get(`/orders/history?page=${page}&limit=10`);
}

export async function fetchProducts(params: ProductQuery) {
  const getImageUrl = (name: string) =>
    `https://${env.NEXT_PUBLIC_DISTRIBUTION_DOMAIN_NAME}/${name}`;

  const res = await api.get<ProductsResponse>("/products", {
    params: {
      page: params.page,
      limit: params.limit ?? 20,
      category: params.category,
      sort: params.sort,
    },
  });

  return res.data;
}

async function createOrder(payload: CreateOrderPayload) {
  const res = await api.post<CreateOrderResponse>("/orders", payload);

  console.log(res.statusText);
  console.log(res.status);
  return res.data;
}

async function verifyPayment(payload: VerifyPaymentPayload) {
  const res = await api.post("/orders/payments/verify", payload);
  return res.data;
}

export {
  fetchAdminProducts,
  fetchInventories,
  createWarehouse,
  fetchWarehouses,
  searchWarehouses,
  fetchDeliveryPersons,
  fetchOrders,
  searchProducts,
  createDeliveryPerson,
  createInventory,
  createOrder,
  verifyPayment,
};
