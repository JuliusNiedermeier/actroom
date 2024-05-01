import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@/server";
import { getBaseUrl } from "@/utils/base-url";

export const trpc = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: `${getBaseUrl()}/api/trpc` })],
});
