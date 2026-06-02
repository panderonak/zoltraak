import type { NextFunction, Request, Response } from "express";

async function requireAuth(req: Request, res: Response, next: NextFunction) {
	if (!req.user?.id) {
		return res.status(401).json({
			message: "Unauthorized",
		});
	}

	next();
}

export { requireAuth };
