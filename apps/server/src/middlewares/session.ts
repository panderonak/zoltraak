import { auth } from "@zoltraak/auth";
import { fromNodeHeaders } from "better-auth/node";
import type { NextFunction, Request, Response } from "express";

async function attachSession(req: Request, _res: Response, next: NextFunction) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (session) {
    req.session = session;
    req.user = session.user;
    req.isAdmin = session.user.role === "admin";
  }

  next();
}

export { attachSession };
