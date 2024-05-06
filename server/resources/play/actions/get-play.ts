import { drizzle } from "@/server/services/drizzle";
import { publicProcedure } from "@/server/trpc";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { blockTable, playTable } from "@/server/resources/schema";

export const getPlay = publicProcedure
  .input(z.object({ ID: z.string() }))
  .query(({ input }) =>
    drizzle.query.playTable.findFirst({
      where: eq(playTable.ID, input.ID),
      with: {
        sourceParts: true,
        blocks: { orderBy: asc(blockTable.position) },
      },
    })
  );
