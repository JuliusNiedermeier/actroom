import { drizzle } from "@/server/services/drizzle";
import { publicProcedure } from "@/server/trpc";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { PlayTableUpdate, playTable } from "../../schema";
import { Part } from "@google/generative-ai";
import { sourcePartMimeTypeMap } from "@/server/resources/source-part/actions/create-soruce-part";
import { prompt } from "./prompt";
import { generateBlocks } from "./generate-blocks";
import { gemini1P5, safetySettings } from "@/server/services/vertex-ai";

const setPlayConversionStatus = async (
  playID: string,
  status: PlayTableUpdate["conversionStatus"]
) => {
  drizzle
    .update(playTable)
    .set({ conversionStatus: status })
    .where(eq(playTable.ID, playID));
};

export const convertPlay = publicProcedure
  .input(z.object({ ID: z.string() }))
  .mutation(async ({ input }) => {
    setPlayConversionStatus(input.ID, "processing");

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

    const { stream } = await gemini1P5.generateContentStream({
      contents: [
        { role: "user", parts: [...fileMessageParts, { text: prompt }] },
      ],
      generationConfig: { maxOutputTokens: 8192 },
      safetySettings,
    });

    for await (const block of generateBlocks(stream)) {
      console.log(block);
    }

    setPlayConversionStatus(input.ID, "complete");
  });
