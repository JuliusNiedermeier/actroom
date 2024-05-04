import { drizzle } from "@/server/services/drizzle";
import { publicProcedure } from "@/server/trpc";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { playTable } from "@/server/resources/schema";

export const getPlay = publicProcedure
  .input(z.object({ ID: z.string() }))
  .query(({ input }) =>
    drizzle.query.playTable.findFirst({
      where: eq(playTable.ID, input.ID),
      with: { sourceParts: true },
    })
  );
