ALTER TABLE "members" ALTER COLUMN "role" SET DEFAULT 'member';--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "role";