import "server-only";

import type { Session } from "@zoltraak/auth";
import { env } from "@zoltraak/env/web";
import { headers } from "next/headers";

export async function getServerSession(): Promise<Session | null> {
	const cookie = (await headers()).get("cookie");

	if (!cookie) {
		return null;
	}

	const response = await fetch(`${env.BACKEND_URL}/api/auth/get-session`, {
		headers: { cookie },
		cache: "no-store",
	});

	if (!response.ok) {
		return null;
	}

	return response.json();
}
