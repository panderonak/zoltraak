import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createEnv } from "@t3-oss/env-core";
import { config } from "dotenv";
import { z } from "zod";

/**
 * Load an env file only if it exists.
 * Does NOT override already loaded variables.
 */
function loadEnvIfExists(path: string) {
	if (existsSync(path)) {
		config({ path, override: false });
	}
}

/**
 * Resolve important paths
 */
const cwdEnvPath = resolve(process.cwd(), ".env");

const currentDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(currentDir, "../../..");
const serverEnvPath = resolve(repoRoot, "apps/server/.env");

/**
 * Load env files (priority: top → bottom)
 */
loadEnvIfExists(cwdEnvPath);
loadEnvIfExists(serverEnvPath);

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().min(1),
		BETTER_AUTH_SECRET: z.string().min(32),
		BETTER_AUTH_URL: z.url(),
		CORS_ORIGIN: z.url(),
		NODE_ENV: z
			.enum(["development", "production", "test"])
			.default("development"),
		GOOGLE_CLIENT_ID: z.string().min(1),
		GOOGLE_CLIENT_SECRET: z.string().min(1),
		S3_BUCKET_NAME: z.string().min(1),
		AWS_ACCESS_KEY_ID: z.string().min(1),
		AWS_SECRET_ACCESS_KEY: z.string().min(1),
		RAZORPAY_KEY_ID: z.string().min(1),
		RAZORPAY_KEY_SECRET: z.string().min(1),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
