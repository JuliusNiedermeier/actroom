CREATE TABLE IF NOT EXISTS "page" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"number" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "play" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "play" ALTER COLUMN "id" SET NOT NULL;