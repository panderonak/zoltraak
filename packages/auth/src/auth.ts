import { db } from "@zoltraak/db";
import * as schema from "@zoltraak/db/schema/auth";
import { env } from "@zoltraak/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: schema,
	}),
	user: {
		additionalFields: {
			role: {
				type: "string",
				required: true,
				defaultValue: "user",
				input: false,
			},
		},
	},
	trustedOrigins: [env.CORS_ORIGIN],
	socialProviders: {
		google: {
			prompt: "select_account",
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		},
	},
	secret: env.BETTER_AUTH_SECRET,
	baseURL: env.BETTER_AUTH_URL,
	advanced: {
		defaultCookieAttributes: {
			// sameSite: "none",
			// secure: true,
			// httpOnly: true,
			sameSite: "lax",
			secure: false,
			httpOnly: true,
		},
	},
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 60,
		},
	},

	plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
export { auth };
