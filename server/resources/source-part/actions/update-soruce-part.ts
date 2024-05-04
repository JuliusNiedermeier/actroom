import { publicProcedure } from "@/server/trpc";
import {
  sourcePartTable,
  sourcePartTableUpdateSchema,
} from "@/server/resources/schema";
import { z } from "zod";
import { drizzle } from "@/server/services/drizzle";
import { eq } from "drizzle-orm";

export const updateSourcePart = publicProcedure
  .input(z.object({ ID: z.string(), data: sourcePartTableUpdateSchema }))
  .mutation(async ({ input }) => {
    const [updatedSourcePart] = await drizzle
      .update(sourcePartTable)
      .set(input.data)
      .where(eq(sourcePartTable.ID, input.ID))
      .returning();

    return updatedSourcePart;
  });
