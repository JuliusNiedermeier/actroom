import { relations } from "drizzle-orm";
import { boolean, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { sourcePartTable, blockTable } from "../schema";

export const playConversionStatusEnum = pgEnum("play_conversion_status", [
  "pending",
  "processing",
  "complete",
  "failed",
]);

export const playSourceTypeEnum = pgEnum("play_source_type", ["pdf", "image"]);

export const playTable = pgTable("play", {
  ID: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  visited: boolean("visited").notNull().default(false),
  conversionStatus: playConversionStatusEnum("conversion_status")
    .notNull()
    .default("pending"),
  sourceType: playSourceTypeEnum("source_type").notNull(),
});

export const playTableRelations = relations(playTable, ({ many }) => ({
  sourceParts: many(sourcePartTable),
  blocks: many(blockTable),
}));

export const playTableInsertSchema = createInsertSchema(playTable);
export const playTableUpdateSchema = createInsertSchema(playTable)
  .omit({ ID: true })
  .partial();
export const playTableSelectSchema = createSelectSchema(playTable);

export type PlayTableInsert = z.infer<typeof playTableInsertSchema>;
export type PlayTableUpdate = z.infer<typeof playTableUpdateSchema>;
export type PlayTableSelect = z.infer<typeof playTableSelectSchema>;
