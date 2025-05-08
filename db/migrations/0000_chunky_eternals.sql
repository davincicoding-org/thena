CREATE TYPE "public"."task_complexity" AS ENUM('trivial', 'simple', 'default', 'complex');--> statement-breakpoint
CREATE TYPE "public"."task_priority" AS ENUM('critical', 'urgent', 'default', 'deferred', 'optional');--> statement-breakpoint
CREATE TYPE "public"."task_run_status" AS ENUM('planned', 'skipped', 'completed', 'deferred', 'abandoned');--> statement-breakpoint
CREATE TABLE "client_migrations" (
	"tag" text PRIMARY KEY NOT NULL,
	"applied_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "focus_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"image" text
);
--> statement-breakpoint
CREATE TABLE "sprints" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"session_id" uuid,
	"duration" integer NOT NULL,
	"recovery_time" integer,
	"scheduled_start" timestamp with time zone,
	"ordinal" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"started_at" timestamp with time zone,
	"ended_at" timestamp with time zone,
	CONSTRAINT "positive_duration" CHECK ("sprints"."duration" > 0)
);
--> statement-breakpoint
CREATE TABLE "task_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sprint_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"task_id" uuid NOT NULL,
	"status" "task_run_status" DEFAULT 'planned' NOT NULL,
	"ordinal" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"user_id" text NOT NULL,
	"parent_id" uuid,
	"project_id" uuid,
	"title" text NOT NULL,
	"description" text,
	"priority" "task_priority",
	"complexity" "task_complexity",
	CONSTRAINT "no_task_as_own_parent" CHECK ("tasks"."id" IS DISTINCT FROM "tasks"."parent_id")
);
--> statement-breakpoint
ALTER TABLE "sprints" ADD CONSTRAINT "sprints_session_id_focus_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."focus_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_runs" ADD CONSTRAINT "task_runs_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_parent_id_tasks_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_client_migrations_applied_at" ON "client_migrations" USING btree ("applied_at");--> statement-breakpoint
CREATE UNIQUE INDEX "ux_task_run_order" ON "task_runs" USING btree ("sprint_id","ordinal");--> statement-breakpoint
CREATE UNIQUE INDEX "leaf_or_root_only" ON "tasks" USING btree ("id");--> statement-breakpoint
CREATE INDEX "idx_tasks_parent" ON "tasks" USING btree ("parent_id");