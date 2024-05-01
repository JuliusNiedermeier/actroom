import Constants from "expo-constants";

export function getBaseUrl() {
  if (Constants.expoConfig?.hostUri) {
    // When in development mode
    return `http://${Constants.expoConfig?.hostUri}`;
  }

  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;

  throw new Error("No base URL specified");
}
