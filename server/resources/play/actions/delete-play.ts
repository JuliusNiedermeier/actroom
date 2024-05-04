import { publicProcedure } from "@/server/trpc";
import { z } from "zod";
import { playTable } from "@/server/resources/schema";
import { drizzle } from "@/server/services/drizzle";
import { eq } from "drizzle-orm";

export const deletePlay = publicProcedure
  .input(z.object({ ID: z.string() }))
  .mutation(({ input }) =>
    drizzle.delete(playTable).where(eq(playTable.ID, input.ID))
  );
