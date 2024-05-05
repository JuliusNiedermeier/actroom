import { env } from "@/utils/env-server";
import { gcpServiceAccount } from "@/utils/gcp-service-account";
import { VertexAI } from "@google-cloud/vertexai";

const vertex = new VertexAI({
  project: gcpServiceAccount.project_id,
  location: env.VERTEX_AI_LOCATION,
  googleAuthOptions: { credentials: gcpServiceAccount },
});

export const gemini1P5 = vertex.preview.getGenerativeModel({
  model: "gemini-1.5-pro-latest",
});
