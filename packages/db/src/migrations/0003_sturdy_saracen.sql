ALTER TABLE "orders" DROP CONSTRAINT "orders_product_id_products_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "delivery_type";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "product_id";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "quantity";