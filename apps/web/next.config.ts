import "@zoltraak/env/web";
import { env } from "@zoltraak/env/web";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typedRoutes: true,
	reactCompiler: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: env.NEXT_PUBLIC_DISTRIBUTION_DOMAIN_NAME,
			},
		],
	},
	async rewrites() {
		return [
			{
				source: "/api/auth/:path*",
				destination: `${env.BACKEND_URL}/api/auth/:path*`,
			},
		];
	},
};

export default nextConfig;