import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { playSourceTypeEnum, playTable } from "../play/schema";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const sourcePartTable = pgTable("source_part", {
  ID: uuid("id").primaryKey().defaultRandom(),
  playID: uuid("play_id")
    .notNull()
    .references(() => playTable.ID),
  type: playSourceTypeEnum("type"),
  storageURI: text("storage_uri").notNull(),
});

export const sourcePartRelations = relations(sourcePartTable, ({ one }) => ({
  play: one(playTable, {
    fields: [sourcePartTable.playID],
    references: [playTable.ID],
  }),
}));

export const sourcePartTableInsertSchema = createInsertSchema(sourcePartTable);
export const sourcePartTableUpdateSchema = createInsertSchema(sourcePartTable)
  .omit({ ID: true })
  .partial();
export const sourcePartTableSelectSchema = createSelectSchema(sourcePartTable);

export type SourcePartTableInsert = z.infer<typeof sourcePartTableInsertSchema>;
export type SourcePartTableUpdate = z.infer<typeof sourcePartTableUpdateSchema>;
export type SourcePartTableSelect = z.infer<typeof sourcePartTableSelectSchema>;