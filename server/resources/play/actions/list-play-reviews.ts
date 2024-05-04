import { drizzle } from "@/server/services/drizzle";
import { publicProcedure } from "@/server/trpc";

export const listPlayPreviews = publicProcedure.query(() =>
  drizzle.query.playTable.findMany({
    columns: { ID: true, title: true, conversionStatus: true },
  })
);
