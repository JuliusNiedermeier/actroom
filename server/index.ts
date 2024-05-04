import { publicProcedure, router } from "./trpc";
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from "unique-names-generator";
import { PlayTable, playTableInsertSchema } from "./resources/schema";
import { drizzle } from "./services/drizzle";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { playTableUpdateSchema } from "./resources/play/schema";
import { bucket } from "./services/gcp";
import {
  sourcePartTable,
  sourcePartTableInsertSchema,
} from "./resources/source-part/schema";
import { randomUUID } from "node:crypto";

const sourcePartMimeTypeMap: Record<
  typeof sourcePartTableInsertSchema.shape.type._type,
  string
> = {
  pdf: "application/pdf",
  image: "image/jpeg",
};

export const appRouter = router({
  health: publicProcedure.query(({ ctx, input }) => {
    return { status: "healthy" };
  }),

  createPlay: publicProcedure
    .input(playTableInsertSchema.pick({ sourceType: true }))
    .mutation(async ({ input }) => {
      const generatedTitle = uniqueNamesGenerator({
        dictionaries: [adjectives, colors, animals],
        style: "capital",
        separator: " ",
      });

      const [playRecord] = await drizzle
        .insert(PlayTable)
        .values({
          title: generatedTitle,
          sourceType: input.sourceType,
        })
        .returning();

      return playRecord;
    }),

  getPlay: publicProcedure
    .input(z.object({ ID: z.string() }))
    .query(({ input }) =>
      drizzle.query.PlayTable.findFirst({ where: eq(PlayTable.ID, input.ID) })
    ),

  listPlayPreviews: publicProcedure.query(() =>
    drizzle.query.PlayTable.findMany({
      columns: { ID: true, title: true, conversionStatus: true },
    })
  ),

  updatePlay: publicProcedure
    .input(z.object({ ID: z.string(), data: playTableUpdateSchema }))
    .mutation(async ({ input }) => {
      const [updatedPlay] = await drizzle
        .update(PlayTable)
        .set(input.data)
        .where(eq(PlayTable.ID, input.ID))
        .returning();
      return updatedPlay;
    }),

  deletePlay: publicProcedure
    .input(z.object({ ID: z.string() }))
    .mutation(({ input }) =>
      drizzle.delete(PlayTable).where(eq(PlayTable.ID, input.ID))
    ),

  createSourcePart: publicProcedure
    .input(
      z.object({
        playID: z.string(),
        type: sourcePartTableInsertSchema.shape.type,
      })
    )
    .mutation(async ({ input }) => {
      const sourcePartID = randomUUID();

      const file = bucket.file(`source-parts/${sourcePartID}`);

      const [sourcePart] = await drizzle
        .insert(sourcePartTable)
        .values({
          playID: input.playID,
          type: input.type,
          storageURI: file.cloudStorageURI.href,
        })
        .returning();

      const sessionExpiryDate = new Date();
      sessionExpiryDate.setDate(sessionExpiryDate.getMinutes() + 10);

      const [uploadURL] = await file.getSignedUrl({
        action: "write",
        expires: sessionExpiryDate,
        contentType: sourcePartMimeTypeMap[input.type],
      });

      return { sourcePart, uploadURL };
    }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
