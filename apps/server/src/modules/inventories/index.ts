import { Router } from "express";
import { requireAdmin } from "@/middlewares/admin";
import { requireAuth } from "@/middlewares/auth";
import {
  createInventory,
  deleteInventory,
  getAllInventories,
} from "@/modules/inventories/service";

const router: Router = Router();

router.get("/", requireAuth, requireAdmin, getAllInventories);
router.post("/", requireAuth, requireAdmin, createInventory);
router.delete("/:id", requireAuth, requireAdmin, deleteInventory);

export { router as inventories };
