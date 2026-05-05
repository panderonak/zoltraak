import type { auth } from "@zoltraak/auth";

type Session = typeof auth.$Infer.Session;

declare global {
  namespace Express {
    interface Request {
      session?: Session;
      user: Session["user"];
      isAdmin?: boolean;
    }
  }
}
