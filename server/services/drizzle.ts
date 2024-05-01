import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleClient } from "drizzle-orm/neon-http";
import * as schema from "@/server/resources/schema";
import { env } from "@/utils/env-server";

const sql = neon(env.NEON_CONNECTION_STRING);
export const drizzle = drizzleClient(sql, { schema });
