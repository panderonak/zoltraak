import { Router } from "express";
import { requireAdmin } from "@/middlewares/admin";
import { requireAuth } from "@/middlewares/auth";
import {
	completeDelivery,
	createDeliveryPerson,
	deleteDeliveryPerson,
	getAllDeliveryPerson,
	getDeliveryPersonOrders,
	updateDeliveryPerson,
} from "@/modules/delivery-persons/service";

const router: Router = Router();

router.get("/", requireAuth, getAllDeliveryPerson);
router.post("/", requireAuth, requireAdmin, createDeliveryPerson);
router.get("/:id/orders", requireAuth, getDeliveryPersonOrders);
router.patch("/:id", requireAuth, requireAdmin, updateDeliveryPerson);
router.post("/complete-delivery", requireAuth, completeDelivery);
router.delete("/:id", requireAuth, requireAdmin, deleteDeliveryPerson);

export { router as deliveryPersons };
