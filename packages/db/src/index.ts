import * as schema from "@zoltraak/db/schema";
import { env } from "@zoltraak/env/server";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres(env.DATABASE_URL);
const db = drizzle({ client, schema });

export { db };
