import { z } from "zod";
import { loadEnvConfig } from "@next/env";
import { cwd } from "process";

loadEnvConfig(cwd());

const envSchema = z.object({
  NEON_CONNECTION_STRING: z.string(),
  GEMINI_API_KEY: z.string(),

  GCP_PROJECT_ID: z.string(),
  GCP_PRIVATE_KEY_ID: z.string(),
  GCP_PRIVATE_KEY: z.string(),
  GCP_CLIENT_EMAIL: z.string(),
  GCP_CLIENT_ID: z.string(),
  GCP_CLIENT_X509_CERT_URL: z.string(),

  GCP_BUCKET_NAME: z.string(),
  VERTEX_AI_LOCATION: z.string(),
});

export const env = envSchema.parse(process.env);
