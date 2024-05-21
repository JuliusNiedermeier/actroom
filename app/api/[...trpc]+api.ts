import { createHandler } from "@/server";

const handler = createHandler("/api/trpc");

export { handler as GET, handler as POST };
