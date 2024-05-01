import { relations } from "drizzle-orm";
import { boolean, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { PageTable } from "../schema";
import { BlockTable } from "../block/schema";

export const playStatusEnum = pgEnum("play_status", [
  "awaiting_conversion",
  "converting",
  "converted",
]);

export const PlayTable = pgTable("play", {
  ID: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  converted: boolean("converted").notNull().default(false),
  status: playStatusEnum("status").notNull().default("awaiting_conversion"),
  data: text("data"),
});

export const playTableRelations = relations(PlayTable, ({ many }) => ({
  pages: many(PageTable),
  blocks: many(BlockTable),
}));
