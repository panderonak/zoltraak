import { Router } from "express";
import { requireAdmin } from "@/middlewares/admin";
import { requireAuth } from "@/middlewares/auth";
import {
	createInventory,
	getAllInventories,
} from "@/modules/inventories/service";

const router: Router = Router();

router.post("/", requireAuth, requireAdmin, createInventory);

router.get("/", requireAuth, getAllInventories);

export { router as inventories };
