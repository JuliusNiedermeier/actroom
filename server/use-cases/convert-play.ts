import { ZodError } from "zod";
import { readFile } from "fs/promises";
import { resolve } from "path";
import {
  AuthorsPlayFeature,
  PlayFeature,
  TitlePlayFeature,
  playFeatureSchema,
} from "../entities/play-feature";
import { StoryBlock } from "../entities/story-block";
import { SourcePart } from "../entities/source-part";

type GenerativeModelPromptTextPart = { type: "text"; text: string };

type GenerativeModelPromptInlineDataPart = {
  type: "inline-data";
  GCPFileURI: string;
  mimeType: string;
};

type GenerativeModelPromptPart =
  | GenerativeModelPromptTextPart
  | GenerativeModelPromptInlineDataPart;

type GenerativeModel = (options: {
  prompt: GenerativeModelPromptPart[];
}) => Promise<AsyncGenerator<string>>;

type CreateRawPlayFeatureStreamConfig = {
  model: GenerativeModel;
  sources: GenerativeModelPromptInlineDataPart[];
};

const createRawPlayFeatureStream = async (
  config: CreateRawPlayFeatureStreamConfig
) => {
  const playFeatureTypes = await readFile(
    resolve(__dirname, "../../generated/play-feature-types"),
    "utf-8"
  );

  const instruction = [
    "The provided file contains a screenplay.",
    "Please identify and extract the features listed below and convert them to a series of JSON objects seperated by a new line.",
    playFeatureTypes,
    "Your response will be parsed and should only provide valid JSON objects seperated by a new line without any additional text or formatting.",
    "Only process and output the contents of the first 10 pages.",
  ].join("\n\n");

  return config.model({
    prompt: [...config.sources, { type: "text", text: instruction }],
  });
};

const extractPlayFeaturesFromStream = async function* (
  chunks: AsyncGenerator<string>
) {
  let buffer = "";

  for await (const chunk of chunks) {
    buffer += chunk;

    const lastLineBreak = buffer.lastIndexOf("\n");
    if (lastLineBreak < 0) continue;

    const lines = buffer.slice(0, lastLineBreak).split("\n");
    buffer = buffer.slice(lastLineBreak + 1);

    for (let line of lines) {
      try {
        const parsedLine = JSON.parse(line) as Record<string, any>;
        yield playFeatureSchema.parse(parsedLine);
      } catch (error) {
        if (error instanceof ZodError) console.warn(error.message);
        else console.warn("Invalid JSON:", line);
        continue;
      }
    }
  }
};

type PlayFeatureHandlerMap = {
  [K in PlayFeature["type"]]: (
    playFeature: Extract<PlayFeature, { type: K }>
  ) => void;
};

// Type helper function that allows TypeScript to verify that the play feature is passed to the correct handler
const runPlayFeatureHandler = <K extends PlayFeature["type"]>(
  handler: PlayFeatureHandlerMap[K],
  playFeature: Extract<PlayFeature, { type: K }>
) => handler(playFeature);

type ConvertPlayUseCaseConfig = {
  playID: string;
  model: CreateRawPlayFeatureStreamConfig["model"];
  getSourceParts: (playID: string) => SourcePart[];
  updatePlay: (
    ID: string,
    data: Partial<Omit<TitlePlayFeature, "type">> &
      Partial<Omit<AuthorsPlayFeature, "type">>
  ) => void | Promise<void>;
  createStoryBlock: (
    playID: string,
    storyBlock: StoryBlock
  ) => void | Promise<void>;
};

export const convertPlay = async (config: ConvertPlayUseCaseConfig) => {
  const sourceParts = await config.getSourceParts(config.playID);

  const rawPlayFeatureStream = await createRawPlayFeatureStream({
    model: config.model,
    sources: sourceParts.map((part) => ({
      GCPFileURI: part.GCPStorageURI,
      mimeType: part.mimeType,
      type: "inline-data",
    })),
  });

  const playFeatureStream = extractPlayFeaturesFromStream(rawPlayFeatureStream);

  const playFeatureHandlerMap: PlayFeatureHandlerMap = {
    title: (playFeature) => config.updatePlay(config.playID, playFeature),
    authors: (playFeature) => config.updatePlay(config.playID, playFeature),
    act: (playFeature) => config.createStoryBlock(config.playID, playFeature),
    scene: (playFeature) => config.createStoryBlock(config.playID, playFeature),
    "stage-direction": (playFeature) =>
      config.createStoryBlock(config.playID, playFeature),
    "role-direction": (playFeature) =>
      config.createStoryBlock(config.playID, playFeature),
  };

  for await (let playFeature of playFeatureStream) {
    runPlayFeatureHandler(playFeatureHandlerMap[playFeature.type], playFeature);
  }
};
