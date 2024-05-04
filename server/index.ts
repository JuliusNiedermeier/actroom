import { publicProcedure, router } from "./trpc";
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from "unique-names-generator";
import {
  playTable,
  playTableInsertSchema,
  playTableUpdateSchema,
  sourcePartTable,
  sourcePartTableInsertSchema,
  sourcePartTableUpdateSchema,
} from "./resources/schema";
import { drizzle } from "./services/drizzle";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { bucket } from "./services/gcp";
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
        .insert(playTable)
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
      drizzle.query.playTable.findFirst({ where: eq(playTable.ID, input.ID) })
    ),

  listPlayPreviews: publicProcedure.query(() =>
    drizzle.query.playTable.findMany({
      columns: { ID: true, title: true, conversionStatus: true },
    })
  ),

  updatePlay: publicProcedure
    .input(z.object({ ID: z.string(), data: playTableUpdateSchema }))
    .mutation(async ({ input }) => {
      const [updatedPlay] = await drizzle
        .update(playTable)
        .set(input.data)
        .where(eq(playTable.ID, input.ID))
        .returning();
      return updatedPlay;
    }),

  deletePlay: publicProcedure
    .input(z.object({ ID: z.string() }))
    .mutation(({ input }) =>
      drizzle.delete(playTable).where(eq(playTable.ID, input.ID))
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

  updateSourcePart: publicProcedure
    .input(z.object({ ID: z.string(), data: sourcePartTableUpdateSchema }))
    .mutation(async ({ input }) => {
      const [updatedSourcePart] = await drizzle
        .update(sourcePartTable)
        .set(input.data)
        .where(eq(sourcePartTable.ID, input.ID))
        .returning();

      return updatedSourcePart;
    }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
