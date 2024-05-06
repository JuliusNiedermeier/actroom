import { BlockSelect } from "@/server/resources/block/schema";
import { GenerateContentResponse } from "@google-cloud/vertexai";

const parseLine = (line: string) => {
  try {
    return JSON.parse(line) as Omit<
      BlockSelect,
      "ID" | "playID" | "pageID" | "position"
    >;
  } catch (error) {
    return null;
  }
};

export const generateBlocks = async function* (
  stream: AsyncGenerator<GenerateContentResponse>
) {
  let buffer = "";
  let blockIndex = 0;

  for await (const chunk of stream) {
    if (!chunk.candidates) continue;

    buffer += chunk.candidates[0].content.parts[0].text;

    const lastLineBreak = buffer.lastIndexOf("\n");
    if (lastLineBreak < 0) continue;

    const lines = buffer.slice(0, lastLineBreak).split("\n");
    buffer = buffer.slice(lastLineBreak + 1);

    for (let line of lines) {
      const block = parseLine(line);
      if (!block) continue;
      yield { index: blockIndex++, block };
    }
  }
};
