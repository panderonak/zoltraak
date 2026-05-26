import { Router } from "express";
import { requireAdmin } from "@/middlewares/admin";
import { requireAuth } from "@/middlewares/auth";
import {
	createOrder,
	getAllOrders,
	updateOrderStatus,
	verifyPayment,
} from "@/modules/orders/service";

const router: Router = Router();

router.get("/history", requireAuth, getAllOrders);

router.post("/status", requireAuth, requireAdmin, updateOrderStatus);

router.post("/", requireAuth, createOrder);

router.post("/payments/verify", verifyPayment);

export { router as orders };
