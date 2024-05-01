CREATE TABLE IF NOT EXISTS "play" (
	"id" uuid DEFAULT gen_random_uuid(),
	"name" text NOT NULL
);
