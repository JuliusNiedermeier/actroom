CREATE TABLE IF NOT EXISTS "source_part" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"play_id" uuid NOT NULL,
	"type" "play_source_type" NOT NULL,
	"storage_uri" text NOT NULL,
	"upload_complete" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "source_part" ADD CONSTRAINT "source_part_play_id_play_id_fk" FOREIGN KEY ("play_id") REFERENCES "play"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
