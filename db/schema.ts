/*

Per User:
- get all open tasks (there is either no sprintTask of this task or its status is "deferred")
- get amount of open tasks
- get all completed tasks (there is a sprintTask of this task and its status is "completed")
- get amount of completed tasks
- get all projects
- get all open tasks assigned to a project
- get amount of open tasks assigned to a project
- get all completed tasks of a project
- get amount of completed tasks assigned to a project
 
 */

import type { AnyPgColumn } from "drizzle-orm/pg-core";
import { aliasedTable, relations, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/gel-core";
import {
  check,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/* ═════════ USERS (remote-only) ═════════ */
export const users = pgTable(
  "users",
  {
    uid: integer().primaryKey().generatedAlwaysAsIdentity(),
    email: text().notNull(),
    name: text(),
  },
  (t) => [uniqueIndex("uniq_users_email").on(t.email)],
);

/* ═════════ TASKS  ═════════ */

export const taskPriority = pgEnum("task_priority", [
  "critical",
  "urgent",
  "default",
  "deferred",
  "optional",
]);

export const taskComplexity = pgEnum("task_complexity", [
  "trivial",
  "simple",
  "default",
  "complex",
]);

export const tasks = pgTable(
  "tasks",
  {
    uid: integer().primaryKey().generatedByDefaultAsIdentity(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),

    // owner: integer()
    //   .references(() => users.uid, { onDelete: "cascade" })
    //   .notNull(),

    projectId: integer().references(() => projects.uid, {
      onDelete: "set null",
    }),

    parentTaskId: integer().references((): AnyPgColumn => tasks.uid, {
      onDelete: "cascade",
    }),

    title: text().notNull(),
    description: text(),

    priority: taskPriority(),
    complexity: taskComplexity(),
  },
  (t) => [
    check(
      "no_task_as_own_parent",
      sql`${t.uid} IS DISTINCT FROM ${t.parentTaskId}`,
    ),
    /* made DEFERRABLE via extraSql */
    uniqueIndex("leaf_or_root_only").on(t.uid),
    index("idx_tasks_parent").on(t.parentTaskId),
  ],
);

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  // owner: one(users, {
  //   fields: [tasks.userId],
  //   references: [users.userId],
  // }),

  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.uid],
  }),

  parent: one(tasks, {
    fields: [tasks.parentTaskId],
    references: [tasks.uid],
    relationName: "parent", // self‑join alias for clarity
  }),

  subtasks: many(tasks, {
    relationName: "parent", // mirror side of the self‑join
  }),

  sprintLinks: many(sprintTasks),
  events: many(sprintTaskEvents),
}));

/* ═════════ PROJECTS ═════════ */
export const projects = pgTable("projects", {
  uid: integer().primaryKey().generatedAlwaysAsIdentity(),
  // owner: integer()
  //   .references(() => users.uid, { onDelete: "cascade" })
  //   .notNull(),
  title: text().notNull(),
  description: text(),
  image: text(),
});

/* ═════════ FOCUS SESSIONS ═════════ */
export const focusSessions = pgTable("focus_sessions", {
  uid: integer().primaryKey().generatedAlwaysAsIdentity(),
  // owner: integer()
  //   .references(() => users.uid, { onDelete: "cascade" })
  //   .notNull(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

/* ═════════ SPRINTS ═════════ */
export const sprints = pgTable(
  "sprints",
  {
    uid: integer().primaryKey().generatedAlwaysAsIdentity(),
    // owner: integer()
    //   .references(() => users.uid, { onDelete: "cascade" })
    //   .notNull(),

    sessionId: integer().references(() => focusSessions.uid, {
      onDelete: "cascade",
    }),

    durationMinutes: integer().notNull(),
    recoveryTimeMinutes: integer(),
    scheduledStart: timestamp({ withTimezone: true }),
    ordinal: integer().notNull(),

    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    startedAt: timestamp({ withTimezone: true }),
    endedAt: timestamp({ withTimezone: true }),
  },
  (t) => [check("positive_duration", sql`${t.durationMinutes} > 0`)],
);

/* ═════════ SPRINT TASKS ═════════ */
export const sprintTaskStatusEnum = pgEnum("sprint_task_status", [
  "assigned", // planned but not yet done
  "completed", // finished in this sprint
  "deferred", // unfinished, will be carried forward
  "abandoned", // unfinished, permanently dropped
]);

export const sprintTasks = pgTable(
  "sprint_tasks",
  {
    sprintId: integer()
      .references(() => sprints.uid, {
        onDelete: "cascade",
      })
      .notNull(),
    taskId: integer()
      .references(() => tasks.uid, {
        // Fixed reference to tasks.uid instead of sprints.uid
        onDelete: "cascade",
      })
      .notNull(),
    status: sprintTaskStatusEnum().default("assigned").notNull(),
    // addedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    ordinal: integer().notNull(),
  },
  (t) => [
    uniqueIndex("ux_sprint_task_order").on(t.sprintId, t.ordinal),
    // Proper composite primary key definition
    primaryKey({ columns: [t.sprintId, t.taskId] }),
  ],
);

/* ═════════ SPRINT‑TASK EVENTS (remote-only) ═════════ */
export const sprintTaskEventEnum = pgEnum("sprint_task_event", [
  "complete", // user marked task as done
  "uncomplete", // user unmarked task as done
  "skip", // user marked task as skipped
  "unskip", // user unmarked task as skipped
  "promote", // user move task up in the sprint queue
  "pull", // user pulled task from another sprint
]);

export const sprintTaskEvents = pgTable(
  "sprint_task_events",
  {
    uid: integer().primaryKey().generatedAlwaysAsIdentity(),
    sprintId: integer()
      .references(() => sprints.uid, { onDelete: "cascade" })
      .notNull(),
    taskId: integer()
      .references(() => tasks.uid, { onDelete: "cascade" })
      .notNull(),
    timestamp: timestamp({ withTimezone: true }).defaultNow().notNull(),
    event: sprintTaskEventEnum().notNull(),
  },
  (t) => [index("idx_sprint_task_events").on(t.sprintId, t.timestamp)],
);

/* ═════════ CLIENT MIGRATIONS (client-only) ═════════ */

export const clientMigrations = pgTable(
  "client_migrations",
  {
    tag: text().primaryKey(),
    appliedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("idx_client_migrations_applied_at").on(t.appliedAt)],
);

// TODO this is not applied yet. Apply it or remove

export const extraSql = sql`
/* 1. make leaf_or_root_only deferrable + stop sub-subtasks */
  ALTER TABLE tasks
    ALTER CONSTRAINT leaf_or_root_only
    DEFERRABLE INITIALLY DEFERRED;

  CREATE OR REPLACE FUNCTION enforce_one_level()
  RETURNS trigger LANGUAGE plpgsql AS $$
  BEGIN
    IF NEW.parent_task_id IS NOT NULL THEN
      PERFORM 1 FROM tasks WHERE parent_task_id = NEW.task_id LIMIT 1;
      IF FOUND THEN
        RAISE EXCEPTION 'Subtasks cannot have subtasks (%).', NEW.task_id;
      END IF;
    END IF;
    RETURN NEW;
  END $$;

  CREATE CONSTRAINT TRIGGER chk_one_level
  AFTER INSERT OR UPDATE ON tasks
  DEFERRABLE INITIALLY DEFERRED
  FOR EACH ROW EXECUTE FUNCTION enforce_one_level();

  /* 2. leaf-only sprint rule */

  CREATE OR REPLACE FUNCTION only_leaf_tasks_in_sprint()
  RETURNS trigger LANGUAGE plpgsql AS $$
  BEGIN
    PERFORM 1 FROM tasks WHERE parent_task_id = NEW.task_id LIMIT 1;
    IF FOUND THEN
      RAISE EXCEPTION 'Task % has subtasks; add its subtasks instead.', NEW.task_id;
    END IF;

    RETURN NEW;
  END $$;

  CREATE TRIGGER trg_leaf_only
  BEFORE INSERT ON sprint_tasks
  FOR EACH ROW EXECUTE FUNCTION only_leaf_tasks_in_sprint();
`;
