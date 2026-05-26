import type { NextFunction, Request, Response } from "express";

async function requireAdmin(req: Request, res: Response, next: NextFunction) {
	if (req.user?.role !== "admin") {
		return res.status(403).json({
			message: "Forbidden",
		});
	}

	next();
}

export { requireAdmin };
