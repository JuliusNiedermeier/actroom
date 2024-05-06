import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { playTable } from "../schema";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const blockTypeEnum = pgEnum("block_type", [
  "page-number",
  "play-title",
  "play-author",
  "act-title",
  "scene-title",
  "dialogue",
  "stage-direction",
]);

export const blockTable = pgTable("block", {
  ID: serial("id"),
  playID: uuid("play_id")
    .notNull()
    .references(() => playTable.ID, { onDelete: "cascade" }),
  position: integer("position").notNull(),
  type: blockTypeEnum("type").notNull(),
  content: text("content").notNull(),
  role: text("role"),
});

export const blockTableRelations = relations(blockTable, ({ one }) => ({
  play: one(playTable, {
    fields: [blockTable.playID],
    references: [playTable.ID],
  }),
}));

export const blockTableInsertSchema = createInsertSchema(blockTable);
export const blockTableUpdateSchema = createInsertSchema(blockTable)
  .omit({ ID: true })
  .partial();
export const blockTableSelectSchema = createSelectSchema(blockTable);

export type BlockTableInsert = z.infer<typeof blockTableInsertSchema>;
export type BlockTableUpdate = z.infer<typeof blockTableUpdateSchema>;
export type BlockTableSelect = z.infer<typeof blockTableSelectSchema>;
