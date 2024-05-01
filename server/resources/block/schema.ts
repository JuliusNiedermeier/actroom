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

export const BlockTable = pgTable("block", {
  ID: serial("id"),
  playID: uuid("play_id")
    .notNull()
    .references(() => PlayTable.ID, { onDelete: "cascade" }),
  position: integer("position").notNull(),
  type: blockTypeEnum("type").notNull(),
  content: text("content").notNull(),
  role: text("role"),
});

export const blockTableRelations = relations(BlockTable, ({ one }) => ({
  play: one(PlayTable, {
    fields: [BlockTable.playID],
    references: [PlayTable.ID],
  }),
}));

export type BlockSelect = InferSelectModel<typeof BlockTable>;
