import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { PlayTable } from "../schema";
import { relations } from "drizzle-orm";

export const PageTable = pgTable("page", {
  ID: uuid("id").primaryKey().defaultRandom(),
  playID: uuid("play_id")
    .notNull()
    .references(() => PlayTable.ID, { onDelete: "cascade" }),
  number: integer("number").notNull(),
  file: text("file").notNull(),
});

export const pageTableRelations = relations(PageTable, ({ one }) => ({
  play: one(PlayTable, {
    fields: [PageTable.playID],
    references: [PlayTable.ID],
  }),
}));
