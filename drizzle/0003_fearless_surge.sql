ALTER TABLE "page" ADD COLUMN "play_id" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "page" ADD CONSTRAINT "page_play_id_play_id_fk" FOREIGN KEY ("play_id") REFERENCES "play"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
