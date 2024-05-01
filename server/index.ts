import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  health: publicProcedure.query(({ ctx, input }) => {
    return { status: "healthy" };
  }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
