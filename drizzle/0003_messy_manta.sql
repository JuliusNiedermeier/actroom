DO $$ BEGIN
 CREATE TYPE "block_type" AS ENUM('page-number', 'play-title', 'play-author', 'act-title', 'scene-title', 'dialogue', 'stage-direction');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "block" (
	"id" serial NOT NULL,
	"play_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"type" "block_type" NOT NULL,
	"content" text NOT NULL,
	"role" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "block" ADD CONSTRAINT "block_play_id_play_id_fk" FOREIGN KEY ("play_id") REFERENCES "play"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
