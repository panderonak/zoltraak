CREATE TYPE "public"."delivery_person_status" AS ENUM('available', 'busy', 'offline');--> statement-breakpoint
ALTER TABLE "delivery_persons" ADD COLUMN "status" "delivery_person_status" DEFAULT 'available' NOT NULL;--> statement-breakpoint
ALTER TABLE "inventories" ADD COLUMN "quantity" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
DROP TYPE "public"."order_type";