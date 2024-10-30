import { z } from "zod";

export const sourcePartSchema = z.object({
  playID: z.string(),
  GCPStorageURI: z.string(),
  mimeType: z.string(),
});

export type SourcePart = z.infer<typeof sourcePartSchema>;
