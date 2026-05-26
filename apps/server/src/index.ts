import { auth } from "@zoltraak/auth";
import { env } from "@zoltraak/env/server";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express, { type Express } from "express";
import { attachSession } from "@/middlewares/session";
import { router } from "@/modules";

const app: Express = express();

const port = 3000;

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "OPTIONS", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// app.all("/api/auth{/*path}", toNodeHandler(auth));
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).send("OK");
});

app.use(attachSession);

app.use("/api", router);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export { app };
