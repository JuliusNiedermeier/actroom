ALTER TABLE "source_part" DROP CONSTRAINT "source_part_play_id_play_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "source_part" ADD CONSTRAINT "source_part_play_id_play_id_fk" FOREIGN KEY ("play_id") REFERENCES "play"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
