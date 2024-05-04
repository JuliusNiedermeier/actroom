import { publicProcedure } from "@/server/trpc";
import { z } from "zod";
import {
  sourcePartTable,
  sourcePartTableInsertSchema,
} from "@/server/resources/schema";
import { randomUUID } from "node:crypto";
import { bucket } from "@/server/services/gcp";
import { drizzle } from "@/server/services/drizzle";

export const sourcePartMimeTypeMap: Record<
  typeof sourcePartTableInsertSchema.shape.type._type,
  string
> = {
  pdf: "application/pdf",
  image: "image/jpeg",
};

export const createSourcePart = publicProcedure
  .input(
    z.object({
      playID: z.string(),
      type: sourcePartTableInsertSchema.shape.type,
    })
  )
  .mutation(async ({ input }) => {
    const sourcePartID = randomUUID();

    const file = bucket.file(`source-parts/${input.playID}:${sourcePartID}`);

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
  });
