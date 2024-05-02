import { publicProcedure, router } from "./trpc";
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from "unique-names-generator";
import { PlayTable, PlayTableInsertSchema } from "./resources/schema";
import { drizzle } from "./services/drizzle";

export const appRouter = router({
  health: publicProcedure.query(({ ctx, input }) => {
    return { status: "healthy" };
  }),

  createPlay: publicProcedure
    .input(PlayTableInsertSchema.pick({ sourceType: true }))
    .mutation(async ({ input }) => {
      const generatedTitle = uniqueNamesGenerator({
        dictionaries: [adjectives, colors, animals],
        style: "capital",
        separator: " ",
      });

      const [playRecord] = await drizzle
        .insert(PlayTable)
        .values({
          title: generatedTitle,
          sourceType: input.sourceType,
        })
        .returning();

      return playRecord;
    }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
