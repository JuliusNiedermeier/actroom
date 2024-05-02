import { env } from "@/utils/env-server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const gemini = new GoogleGenerativeAI(env.GOOGLE_STUDIO_GEMINI_API_KEY!);

export const gemini1P5 = gemini.getGenerativeModel(
  { model: "gemini-1.5-pro-latest" },
  { apiVersion: "v1beta" }
);
