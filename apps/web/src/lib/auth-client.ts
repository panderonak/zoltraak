import type { auth } from "@zoltraak/auth"; 
import { env } from "@zoltraak/env/web";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const { signIn, signOut, useSession } = createAuthClient({
  baseURL: env.NEXT_PUBLIC_SERVER_URL,
  plugins: [inferAdditionalFields<typeof auth>()],
});
