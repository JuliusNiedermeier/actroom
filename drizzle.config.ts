import type { Config } from "drizzle-kit";
import { env } from "./utils/env-server";

export default {
  schema: "./server/resources/schema.ts",
  out: "./drizzle",
  driver: "pg",
  introspect: { casing: "preserve" },
  dbCredentials: {
    connectionString: env.NEON_CONNECTION_STRING,
  },
} satisfies Config;
