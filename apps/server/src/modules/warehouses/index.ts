import { Router } from "express";
import { requireAdmin } from "@/middlewares/admin";
import { requireAuth } from "@/middlewares/auth";
import {
	createWarehouse,
	getAllWarehouses,
	searchWarehouses,
} from "@/modules/warehouses/service";

const router: Router = Router();

router.post("/", requireAuth, requireAdmin, createWarehouse);

router.get("/", requireAuth, getAllWarehouses);

router.get("/search", requireAuth, requireAdmin, searchWarehouses);

export { router as warehouses };
