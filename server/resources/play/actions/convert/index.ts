import { drizzle } from "@/server/services/drizzle";
import { publicProcedure } from "@/server/trpc";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { playTable } from "../../schema";
import { Part } from "@google/generative-ai";
import { sourcePartMimeTypeMap } from "@/server/resources/source-part/actions/create-soruce-part";
import { prompt } from "./prompt";
import { gemini1P5, safetySettings } from "@/server/services/gemini";

export const convertPlay = publicProcedure
  .input(z.object({ ID: z.string() }))
  .mutation(async ({ input }) => {
    drizzle
      .update(playTable)
      .set({ conversionStatus: "processing" })
      .where(eq(playTable.ID, input.ID));

    const play = await drizzle.query.playTable.findFirst({
      where: eq(playTable.ID, input.ID),
      with: { sourceParts: true },
    });

    if (!play) return;

    const fileMessageParts = play.sourceParts.map<Part>((part) => ({
      fileData: {
        fileUri: part.storageURI,
        mimeType: sourcePartMimeTypeMap[part.type],
      },
    }));

    const instructionMessagePart: Part = {
      text: prompt,
    };

    const { stream } = await gemini1P5.generateContentStream({
      contents: [
        { role: "user", parts: [...fileMessageParts, instructionMessagePart] },
      ],
      generationConfig: { maxOutputTokens: 8192 },
      safetySettings,
    });
  });
