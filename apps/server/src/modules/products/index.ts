import { Router } from "express";
import { requireAdmin } from "@/middlewares/admin";
import { requireAuth } from "@/middlewares/auth";
import {
	createProduct,
	getAllAdminProducts,
	getPresignedUrls,
	getProduct,
	getProducts,
	searchProducts,
} from "@/modules/products/service";

const router: Router = Router();

router.post("/presigned-urls", requireAuth, requireAdmin, getPresignedUrls);

router.post("/admin", requireAuth, requireAdmin, createProduct);

router.get("/admin", requireAuth, requireAdmin, getAllAdminProducts);

router.get("/search", requireAuth, requireAdmin, searchProducts);

router.get("/", requireAuth, getProducts);

router.get("/:id", requireAuth, getProduct);

export { router as products };
