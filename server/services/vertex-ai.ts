import { env } from "@/utils/env-server";
import { gcpServiceAccount } from "@/utils/gcp-service-account";
import {
  HarmBlockThreshold,
  HarmCategory,
  SafetySetting,
  VertexAI,
} from "@google-cloud/vertexai";

const vertex = new VertexAI({
  project: gcpServiceAccount.project_id,
  location: env.VERTEX_AI_LOCATION,
  googleAuthOptions: { credentials: gcpServiceAccount },
});

// const geminiModelVersion = "gemini-1.5-pro-latest"
const geminiModelVersion = "gemini-1.5-pro-preview-0409";

export const gemini1P5 = vertex.getGenerativeModel({
  model: geminiModelVersion,
});

export const safetySettings: SafetySetting[] = [
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_UNSPECIFIED,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
];
