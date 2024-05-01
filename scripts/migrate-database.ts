import { migrate } from "drizzle-orm/neon-http/migrator";
import { drizzle } from "@/server/services/drizzle";

migrate(drizzle, { migrationsFolder: "./drizzle" }).then(() =>
  console.log("🚀 Migrations applied successfully")
);
