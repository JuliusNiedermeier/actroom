import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { PlayTable } from "../schema";
import { relations, InferSelectModel } from "drizzle-orm";

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
    .references(() => PlayTable.ID, { onDelete: "cascade" }),
  position: integer("position").notNull(),
  type: blockTypeEnum("type").notNull(),
  content: text("content").notNull(),
  role: text("role"),
});

export const blockTableRelations = relations(blockTable, ({ one }) => ({
  play: one(PlayTable, {
    fields: [blockTable.playID],
    references: [PlayTable.ID],
  }),
}));

export type BlockSelect = InferSelectModel<typeof blockTable>;
