DO $$ BEGIN
 CREATE TYPE "play_status" AS ENUM('awaiting_conversion', 'converting', 'converted');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "play" ADD COLUMN "status" "play_status" DEFAULT 'awaiting_conversion' NOT NULL;