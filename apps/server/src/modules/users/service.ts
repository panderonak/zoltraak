import { db } from "@zoltraak/db";
import { user } from "@zoltraak/db/schema";
import { eq } from "drizzle-orm";
import type { Request, Response } from "express";

async function becomeSeller(req: Request, res: Response) {
	try {
		if (req.user.role === "admin") {
			return res.status(400).json({
				code: "ALREADY_A_SELLER",
				message: "You are already a seller.",
			});
		}

		await db
			.update(user)
			.set({ role: "admin" })
			.where(eq(user.id, req.user.id));

		return res.status(200).json({ success: true });
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			code: "BECOME_SELLER_FAILED",
			message: "Failed to update your role. Please try again later.",
		});
	}
}

export { becomeSeller };
