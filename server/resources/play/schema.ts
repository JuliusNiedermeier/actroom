import { relations } from "drizzle-orm";
import { boolean, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
// import { PageTable } from "../schema";
// import { BlockTable } from "../block/schema";

export const playConversionStatusEnum = pgEnum("play_conversion_status", [
  "pending",
  "processing",
  "complete",
  "failed",
]);

export const playSourceTypeEnum = pgEnum("play_source_type", ["pdf", "image"]);

export const PlayTable = pgTable("play", {
  ID: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  visited: boolean("visited").notNull().default(false),
  conversionStatus: playConversionStatusEnum("conversion_status")
    .notNull()
    .default("pending"),
  sourceType: playSourceTypeEnum("source_type").notNull(),
});

export const playTableRelations = relations(PlayTable, ({ many }) => ({
  // pages: many(PageTable),
  // blocks: many(BlockTable),
}));

export const PlayTableInsertSchema = createInsertSchema(PlayTable);
export const PlayTableUpdateSchema = createInsertSchema(PlayTable)
  .omit({
    ID: true,
  })
  .partial();
export const PlayTableSelectSchema = createSelectSchema(PlayTable);

export type PlayTableInsert = z.infer<typeof PlayTableInsertSchema>;
export type PlayTableUpdate = z.infer<typeof PlayTableUpdateSchema>;
export type PlayTableSelect = z.infer<typeof PlayTableSelectSchema>;
