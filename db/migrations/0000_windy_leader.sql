CREATE TYPE "public"."sprint_task_event" AS ENUM('complete', 'uncomplete', 'skip', 'unskip', 'promote', 'pull');--> statement-breakpoint
CREATE TYPE "public"."sprint_task_status" AS ENUM('assigned', 'completed', 'deferred', 'abandoned');--> statement-breakpoint
CREATE TYPE "public"."task_complexity" AS ENUM('trivial', 'simple', 'default', 'complex');--> statement-breakpoint
CREATE TYPE "public"."task_priority" AS ENUM('critical', 'urgent', 'default', 'deferred', 'optional');--> statement-breakpoint
CREATE TABLE "client_migrations" (
	"tag" text PRIMARY KEY NOT NULL,
	"applied_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "focus_sessions" (
	"uid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"uid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"image" text
);
--> statement-breakpoint
CREATE TABLE "sprint_task_events" (
	"uid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"sprint_id" uuid NOT NULL,
	"task_id" uuid NOT NULL,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	"event" "sprint_task_event" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sprint_tasks" (
	"sprint_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"task_id" uuid NOT NULL,
	"status" "sprint_task_status" DEFAULT 'assigned' NOT NULL,
	"ordinal" integer NOT NULL,
	CONSTRAINT "sprint_tasks_sprint_id_task_id_pk" PRIMARY KEY("sprint_id","task_id")
);
--> statement-breakpoint
CREATE TABLE "sprints" (
	"uid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"session_id" uuid,
	"duration_minutes" integer NOT NULL,
	"recovery_time_minutes" integer,
	"scheduled_start" timestamp with time zone,
	"ordinal" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"started_at" timestamp with time zone,
	"ended_at" timestamp with time zone,
	CONSTRAINT "positive_duration" CHECK ("sprints"."duration_minutes" > 0)
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"uid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"user_id" text NOT NULL,
	"project_id" uuid,
	"parent_task_id" uuid,
	"title" text NOT NULL,
	"description" text,
	"priority" "task_priority",
	"complexity" "task_complexity",
	CONSTRAINT "no_task_as_own_parent" CHECK ("tasks"."uid" IS DISTINCT FROM "tasks"."parent_task_id")
);
--> statement-breakpoint
ALTER TABLE "sprint_task_events" ADD CONSTRAINT "sprint_task_events_sprint_id_sprints_uid_fk" FOREIGN KEY ("sprint_id") REFERENCES "public"."sprints"("uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sprint_task_events" ADD CONSTRAINT "sprint_task_events_task_id_tasks_uid_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sprint_tasks" ADD CONSTRAINT "sprint_tasks_sprint_id_sprints_uid_fk" FOREIGN KEY ("sprint_id") REFERENCES "public"."sprints"("uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sprint_tasks" ADD CONSTRAINT "sprint_tasks_task_id_tasks_uid_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sprints" ADD CONSTRAINT "sprints_session_id_focus_sessions_uid_fk" FOREIGN KEY ("session_id") REFERENCES "public"."focus_sessions"("uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_project_id_projects_uid_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("uid") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_parent_task_id_tasks_uid_fk" FOREIGN KEY ("parent_task_id") REFERENCES "public"."tasks"("uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_client_migrations_applied_at" ON "client_migrations" USING btree ("applied_at");--> statement-breakpoint
CREATE INDEX "idx_sprint_task_events" ON "sprint_task_events" USING btree ("sprint_id","timestamp");--> statement-breakpoint
CREATE UNIQUE INDEX "ux_sprint_task_order" ON "sprint_tasks" USING btree ("sprint_id","ordinal");--> statement-breakpoint
CREATE UNIQUE INDEX "leaf_or_root_only" ON "tasks" USING btree ("uid");--> statement-breakpoint
CREATE INDEX "idx_tasks_parent" ON "tasks" USING btree ("parent_task_id");