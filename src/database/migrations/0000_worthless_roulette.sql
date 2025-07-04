CREATE TYPE "public"."focus_session_break_status" AS ENUM('active', 'completed', 'skipped');--> statement-breakpoint
CREATE TYPE "public"."focus_session_status" AS ENUM('active', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."task_complexity" AS ENUM('trivial', 'simple', 'default', 'complex');--> statement-breakpoint
CREATE TYPE "public"."task_priority" AS ENUM('critical', 'urgent', 'default', 'deferred', 'optional');--> statement-breakpoint
CREATE TYPE "public"."task_run_status" AS ENUM('active', 'completed', 'skipped', 'resumed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."task_status" AS ENUM('todo', 'completed', 'deleted');--> statement-breakpoint
CREATE TABLE "focus_session_breaks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"status" "focus_session_break_status" DEFAULT 'active' NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ended_at" timestamp with time zone,
	"planned_duration" integer NOT NULL,
	"actual_duration" integer GENERATED ALWAYS AS (EXTRACT(EPOCH FROM ("focus_session_breaks"."ended_at" - "focus_session_breaks"."started_at"))) STORED
);
--> statement-breakpoint
CREATE TABLE "focus_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"status" "focus_session_status" DEFAULT 'active' NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ended_at" timestamp with time zone,
	"planned_duration" integer NOT NULL,
	"actual_duration" integer GENERATED ALWAYS AS (EXTRACT(EPOCH FROM ("focus_sessions"."ended_at" - "focus_sessions"."started_at"))) STORED
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"image" text
);
--> statement-breakpoint
CREATE TABLE "task_runs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"focus_session_id" integer NOT NULL,
	"task_id" integer NOT NULL,
	"status" "task_run_status" DEFAULT 'active' NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ended_at" timestamp with time zone,
	"duration" integer GENERATED ALWAYS AS (EXTRACT(EPOCH FROM ("task_runs"."ended_at" - "task_runs"."started_at"))) STORED
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"user_id" text NOT NULL,
	"custom_sort_order" double precision,
	"sort_order" double precision GENERATED ALWAYS AS (COALESCE("tasks"."custom_sort_order", "tasks"."id")) STORED NOT NULL,
	"parent_id" integer,
	"project_id" integer,
	"status" "task_status" DEFAULT 'todo' NOT NULL,
	"title" text NOT NULL,
	"priority" "task_priority",
	"complexity" "task_complexity",
	CONSTRAINT "no_task_as_own_parent" CHECK ("tasks"."id" IS DISTINCT FROM "tasks"."parent_id")
);
--> statement-breakpoint
ALTER TABLE "task_runs" ADD CONSTRAINT "task_runs_focus_session_id_focus_sessions_id_fk" FOREIGN KEY ("focus_session_id") REFERENCES "public"."focus_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_runs" ADD CONSTRAINT "task_runs_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_parent_id_tasks_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_focus_session_breaks_owner" ON "focus_session_breaks" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_focus_sessions_owner" ON "focus_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_projects_owner" ON "projects" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_task_run_focus_session_id" ON "task_runs" USING btree ("focus_session_id");--> statement-breakpoint
CREATE INDEX "idx_task_run_owner" ON "task_runs" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "leaf_or_root_only" ON "tasks" USING btree ("id");--> statement-breakpoint
CREATE INDEX "idx_tasks_parent" ON "tasks" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "idx_tasks_project" ON "tasks" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "idx_tasks_status" ON "tasks" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_tasks_owner" ON "tasks" USING btree ("user_id");