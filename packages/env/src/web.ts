import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		BACKEND_URL: z.url(),
	},
	client: {
		NEXT_PUBLIC_URL: z.url(),
		NEXT_PUBLIC_DISTRIBUTION_DOMAIN_NAME: z.string().min(1),
		NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().min(1),
	},
	runtimeEnv: {
		NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
		BACKEND_URL: process.env.BACKEND_URL,
		NEXT_PUBLIC_DISTRIBUTION_DOMAIN_NAME:
			process.env.NEXT_PUBLIC_DISTRIBUTION_DOMAIN_NAME,
		NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
	},
	emptyStringAsUndefined: true,
});
