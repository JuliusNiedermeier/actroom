DO $$ BEGIN
 CREATE TYPE "play_conversion_status" AS ENUM('pending', 'processing', 'complete', 'failed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "play_source_type" AS ENUM('pdf', 'image');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "play" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"visited" boolean DEFAULT false NOT NULL,
	"conversion_status" "play_conversion_status" DEFAULT 'pending' NOT NULL,
	"source_type" "play_source_type" NOT NULL
);
