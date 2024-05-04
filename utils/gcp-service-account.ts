import { StorageOptions } from "@google-cloud/storage";
import { env } from "@/utils/env-server";

type ServiceAccount = StorageOptions["credentials"] & {
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
};

export const gcpServiceAccount = {
  type: "service_account",
  project_id: env.GCP_PROJECT_ID,
  private_key_id: env.GCP_PRIVATE_KEY_ID,
  private_key: env.GCP_PRIVATE_KEY,
  client_email: env.GCP_CLIENT_EMAIL,
  client_id: env.GCP_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: env.GCP_CLIENT_X509_CERT_URL,
  universe_domain: "googleapis.com",
} satisfies ServiceAccount;
