import { publicProcedure, router } from "./trpc";
import { z } from "zod";
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from "unique-names-generator";

export const appRouter = router({
  health: publicProcedure.query(({ ctx, input }) => {
    return { status: "healthy" };
  }),
  createPlay: publicProcedure
    .input(
      z.object({ sourceType: z.union([z.literal("pdf"), z.literal("images")]) })
    )
    .mutation(({ input }) => {
      return {
        sourceType: input.sourceType,
        fallbackTitle: uniqueNamesGenerator({
          dictionaries: [adjectives, colors, animals],
        }),
      };
    }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
