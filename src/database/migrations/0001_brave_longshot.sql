ALTER TYPE "public"."focus_session_break_status" ADD VALUE 'cancelled' BEFORE 'skipped';--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "priority" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."task_priority";--> statement-breakpoint
CREATE TYPE "public"."task_priority" AS ENUM('URGENT', 'HIGH', 'LOW');--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "priority" SET DATA TYPE "public"."task_priority" USING "priority"::"public"."task_priority";--> statement-breakpoint
ALTER TABLE "tasks" DROP COLUMN "complexity";--> statement-breakpoint
DROP TYPE "public"."task_complexity";