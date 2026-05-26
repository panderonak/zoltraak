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

async function fetchAdminProducts(page: number) {
  const res = await api.get(`/products/admin?page=${page}&limit=10`);
  return res.data;
}

async function fetchInventories(page: number) {
  return await api.get(`/inventories?page=${page}&limit=10`);
}

async function createWarehouse(values: Pick<Warehouse, "name" | "pincode">) {

  return await api.post("/warehouses", values);
}

async function fetchWarehouses(page: number) {

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
  return await api.get(`/delivery-persons?page=${page}&limit=10`);
}

async function createDeliveryPerson(
  values: Pick<DeliveryPerson, "name" | "phone" | "warehouseId">,
) {
  const res = await api.post("/delivery-persons", values);
  return res;
}

async function createInventory(
  values: Pick<Inventories, "sku" | "warehouseId" | "productId" | "quantity">,
) {
  const res = await api.post("/inventories", values);
  return res;
}

async function fetchOrders(page: number) {
  return await api.get(`/orders/history?page=${page}&limit=10`);
}

async function fetchProducts(params: ProductQuery) {
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

async function fetchProduct(id: string) {
  const res = await api.get(`/products/${id}`);
  return res.data;
}

async function createOrder(payload: CreateOrderPayload) {
  const res = await api.post<CreateOrderResponse>("/orders", payload);
  return res.data;
}

async function verifyPayment(payload: VerifyPaymentPayload) {
  const res = await api.post("/orders/payments/verify", payload);
  return res.data;
}

function updateDeliveryPerson(
  id: string,
  data: Partial<{ status: "available" | "busy" | "offline" }>,
) {
  return api.patch(`/delivery-persons/${id}`, data);
}

function deleteDeliveryPerson(id: string) {
  return api.delete(`/delivery-persons/${id}`);
}

function completeDelivery(deliveryPersonId: string, orderId: string) {
  return api.post("/delivery-persons/complete-delivery", {
    deliveryPersonId,
    orderId,
  });
}

function deleteInventory(id: string) {
  return api.delete(`/inventories/${id}`);
}

function fetchDeliveryPersonOrders(id: string, page: number) {
  return api.get(`/delivery-persons/${id}/orders?page=${page}`);
}

function updateInventory(id: string, data: Partial<{ quantity: number }>) {
  return api.patch(`/inventories/${id}`, data);
}

function becomeSeller(): Promise<{ success: boolean }> {
  return api.post("/users/become-seller");
}

export {
  becomeSeller,
  completeDelivery,
  createDeliveryPerson,
  createInventory,
  createOrder,
  createWarehouse,
  deleteDeliveryPerson,
  deleteInventory,
  fetchAdminProducts,
  fetchDeliveryPersonOrders,
  fetchDeliveryPersons,
  fetchInventories,
  fetchOrders,
  fetchProduct,
  fetchProducts,
  fetchWarehouses,
  searchProducts,
  searchWarehouses,
  updateDeliveryPerson,
  updateInventory,
  verifyPayment,
};
