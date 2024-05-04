import { publicProcedure } from "@/server/trpc";
import { z } from "zod";
import { playTable } from "@/server/resources/schema";
import { drizzle } from "@/server/services/drizzle";
import { eq } from "drizzle-orm";
import { bucket } from "@/server/services/gcp";

export const deletePlay = publicProcedure
  .input(z.object({ ID: z.string() }))
  .mutation(async ({ input }) => {
    await drizzle.delete(playTable).where(eq(playTable.ID, input.ID));
    await bucket.deleteFiles({ prefix: `source-parts/${input.ID}:` });
  });
