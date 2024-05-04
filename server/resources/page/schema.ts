import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { playTable } from "../schema";
import { relations } from "drizzle-orm";

export const pageTable = pgTable("page", {
  ID: uuid("id").primaryKey().defaultRandom(),
  playID: uuid("play_id")
    .notNull()
    .references(() => playTable.ID, { onDelete: "cascade" }),
  number: integer("number").notNull(),
  file: text("file").notNull(),
});

export const pageTableRelations = relations(pageTable, ({ one }) => ({
  play: one(playTable, {
    fields: [pageTable.playID],
    references: [playTable.ID],
  }),
}));
