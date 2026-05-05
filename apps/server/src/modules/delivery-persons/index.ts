import { Router } from "express";
import { requireAdmin } from "@/middlewares/admin";
import { requireAuth } from "@/middlewares/auth";
import {
  createDeliveryPerson,
  getAllDeliveryPerson,
} from "@/modules/delivery-persons/service";

const router: Router = Router();

router.post("/", requireAuth, requireAdmin, createDeliveryPerson);

router.get("/", requireAuth, getAllDeliveryPerson);

export { router as deliveryPersons };
