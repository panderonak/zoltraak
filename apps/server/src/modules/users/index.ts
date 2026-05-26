import { Router } from "express";
import { requireAuth } from "@/middlewares/auth";
import { becomeSeller } from "@/modules/users/service";

const router: Router = Router();

router.post("/become-seller", requireAuth, becomeSeller);

export { router as users };
