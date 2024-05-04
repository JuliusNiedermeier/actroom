import { publicProcedure } from "@/server/trpc";
import { playTable, playTableInsertSchema } from "@/server/resources/schema";
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from "unique-names-generator";
import { drizzle } from "@/server/services/drizzle";

export const createPlay = publicProcedure
  .input(playTableInsertSchema.pick({ sourceType: true }))
  .mutation(async ({ input }) => {
    const generatedTitle = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      style: "capital",
      separator: " ",
    });

    const [playRecord] = await drizzle
      .insert(playTable)
      .values({
        title: generatedTitle,
        sourceType: input.sourceType,
      })
      .returning();

    return playRecord;
  });
