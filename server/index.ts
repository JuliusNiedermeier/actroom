import { publicProcedure, router } from "./trpc";
import { z } from "zod";
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from "unique-names-generator";
import { randomUUID } from "node:crypto";

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
        ID: randomUUID(),
        sourceType: input.sourceType,
        title: uniqueNamesGenerator({
          dictionaries: [adjectives, colors, animals],
          style: "capital",
          separator: " ",
        }),
      };
    }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
