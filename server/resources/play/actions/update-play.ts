import { publicProcedure } from "@/server/trpc";
import { playTable, playTableUpdateSchema } from "@/server/resources/schema";
import { drizzle } from "@/server/services/drizzle";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const updatePlay = publicProcedure
  .input(z.object({ ID: z.string(), data: playTableUpdateSchema }))
  .mutation(async ({ input }) => {
    const [updatedPlay] = await drizzle
      .update(playTable)
      .set(input.data)
      .where(eq(playTable.ID, input.ID))
      .returning();
    return updatedPlay;
  });
