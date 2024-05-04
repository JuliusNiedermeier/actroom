import { Storage } from "@google-cloud/storage";
import { gcpServiceAccount } from "@/utils/gcp-service-account";
import { env } from "@/utils/env-server";

export const storage = new Storage({ credentials: gcpServiceAccount });
export const bucket = storage.bucket(env.GCP_BUCKET_NAME);
