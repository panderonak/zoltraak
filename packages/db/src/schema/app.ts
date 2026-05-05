import { user } from "@zoltraak/db/schema/auth";
import { relations } from "drizzle-orm";
import {
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const categoryEnum = pgEnum("category_enum", [
  "Fresh",
  "Dairy",
  "Snacks",
  "Beverages",
  "Staples",
  "Instant Food",
  "Personal Care",
  "Household",
]);

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  sellerId: text("seller_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: numeric("price", {
    precision: 8,
    scale: 2,
  }).notNull(),
  category: categoryEnum("category").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const productImages = pgTable("product_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("filename").notNull(),
  product_id: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const warehouses = pgTable(
  "warehouses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    pincode: text("pincode").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [uniqueIndex("pincode_ids").on(table.pincode)],
);

export const deliveryTypeEnum = pgEnum("order_type", ["instant", "standard"]);

export const orderStatusEnum = pgEnum("order_status", [
  "received",
  "reserved",
  "payment_pending",
  "paid",
  "failed",
]);

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  paymentId: text("payment_id").unique(),
  status: orderStatusEnum("status").notNull(),
  price: integer("price").notNull(),
  address: text("address").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id),
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const deliveryPersons = pgTable("delivery_persons", {
  id: uuid().primaryKey().defaultRandom(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  warehouseId: uuid("warehouse_id").references(() => warehouses.id, {
    onDelete: "cascade",
  }),
  orderId: uuid("order_id")
    .unique()
    .references(() => orders.id, {
      onDelete: "set null",
    }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const inventories = pgTable("inventories", {
  id: uuid("id").primaryKey().defaultRandom(),
  sku: varchar("sku", { length: 8 }).unique().notNull(),
  orderId: uuid("order_id").references(() => orders.id, {
    onDelete: "set null",
  }),
  warehouseId: uuid("warehouse_id").references(() => warehouses.id, {
    onDelete: "cascade",
  }),
  productId: uuid("product_id").references(() => products.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const userOrdersRelations = relations(user, ({ many }) => ({
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(user, {
    fields: [orders.userId],
    references: [user.id],
  }),
  deliveryPersons: one(deliveryPersons, {
    fields: [orders.id],
    references: [deliveryPersons.orderId],
  }),
  inventories: many(inventories),
  orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  images: many(productImages),
  inventories: many(inventories),
  seller: one(user),
  orderItems: many(orderItems),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.product_id],
    references: [products.id],
  }),
}));

export const deliveryPersonsRelations = relations(
  deliveryPersons,
  ({ one }) => ({
    order: one(orders, {
      fields: [deliveryPersons.orderId],
      references: [orders.id],
    }),
    warehouse: one(warehouses, {
      fields: [deliveryPersons.warehouseId],
      references: [warehouses.id],
    }),
  }),
);

export const inventoriesRelations = relations(inventories, ({ one }) => ({
  order: one(orders, {
    fields: [inventories.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [inventories.productId],
    references: [products.id],
  }),
  warehouse: one(warehouses, {
    fields: [inventories.warehouseId],
    references: [warehouses.id],
  }),
}));

export const warehousesRelations = relations(warehouses, ({ many }) => ({
  inventories: many(inventories),
  deliveryPersons: many(deliveryPersons),
}));

export type Product = typeof products.$inferSelect;
export type Inventories = typeof inventories.$inferSelect;
export type Warehouse = typeof warehouses.$inferSelect;
export type DeliveryPerson = typeof deliveryPersons.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
