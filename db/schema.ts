import type { AnyPgColumn } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

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
    id: uuid().defaultRandom().notNull().primaryKey(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
    userId: text().notNull(),

    parentId: uuid().references((): AnyPgColumn => tasks.id, {
      onDelete: "cascade",
    }),
    projectId: uuid().references(() => projects.id, {
      onDelete: "set null",
    }),

    title: text().notNull(),
    description: text(),
    priority: taskPriority(),
    complexity: taskComplexity(),
  },
  (t) => [
    check("no_task_as_own_parent", sql`${t.id} IS DISTINCT FROM ${t.parentId}`),
    /* made DEFERRABLE via extraSql */
    uniqueIndex("leaf_or_root_only").on(t.id),
    index("idx_tasks_parent").on(t.parentId),
  ],
);

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  parent: one(tasks, {
    fields: [tasks.parentId, tasks.userId],
    references: [tasks.id, tasks.userId],
    relationName: "parent",
  }),

  subtasks: many(tasks, {
    relationName: "subtasks",
  }),

  project: one(projects, {
    fields: [tasks.projectId, tasks.userId],
    references: [projects.id, projects.userId],
  }),

  runs: many(taskRuns),
  // events: many(taskRunEvents),
}));

/* ═════════ PROJECTS ═════════ */
export const projects = pgTable("projects", {
  id: uuid().defaultRandom().notNull().primaryKey(),
  userId: text().notNull(),
  title: text().notNull(),
  description: text(),
  image: text(),
});

export const projectsRelations = relations(projects, ({ many }) => ({
  tasks: many(tasks),
}));

/* ═════════ FOCUS SESSIONS ═════════ */
export const focusSessions = pgTable("focus_sessions", {
  id: uuid().defaultRandom().notNull().primaryKey(),
  userId: text().notNull(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const focusSessionsRelations = relations(focusSessions, ({ many }) => ({
  sprints: many(sprints),
}));

/* ═════════ SPRINTS ═════════ */
export const sprints = pgTable(
  "sprints",
  {
    id: uuid().defaultRandom().notNull().primaryKey(),
    userId: text().notNull(),
    sessionId: uuid().references(() => focusSessions.id, {
      onDelete: "cascade",
    }),

    /** Duration in minutes */
    duration: integer().notNull(),
    /** Break after sprint in minutes */
    recoveryTime: integer(),
    scheduledStart: timestamp({ withTimezone: true }),
    ordinal: integer().notNull(),

    createdAt: timestamp({ withTimezone: true }).defaultNow(),
    startedAt: timestamp({ withTimezone: true }),
    endedAt: timestamp({ withTimezone: true }),
  },
  (t) => [check("positive_duration", sql`${t.duration} > 0`)],
);

export const sprintsRelations = relations(sprints, ({ one }) => ({
  focusSession: one(focusSessions, {
    fields: [sprints.sessionId, sprints.userId],
    references: [focusSessions.id, focusSessions.userId],
  }),
}));

/* ═════════ TASK RUNS ═════════ */
export const taskRunStatusEnum = pgEnum("task_run_status", [
  "planned", // planned but not yet done
  "skipped", // unfinished, skipped
  "completed", // finished in this sprint
  "deferred", // unfinished, will be carried forward
  "abandoned", // unfinished, permanently dropped
]);

export const taskRuns = pgTable(
  "task_runs",
  {
    id: uuid().defaultRandom().notNull().primaryKey(),
    sprintId: uuid().notNull(),
    userId: text().notNull(),
    taskId: uuid()
      .notNull()
      .references(() => tasks.id, {
        onDelete: "cascade",
      }),

    status: taskRunStatusEnum().default("planned").notNull(),
    // addedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    ordinal: integer().notNull(),
  },
  (t) => [uniqueIndex("ux_task_run_order").on(t.sprintId, t.ordinal)],
);

export const taskRunsRelations = relations(taskRuns, ({ one }) => ({
  sprint: one(sprints, {
    fields: [taskRuns.sprintId, taskRuns.userId],
    references: [sprints.id, sprints.userId],
  }),
  task: one(tasks, {
    fields: [taskRuns.taskId, taskRuns.userId],
    references: [tasks.id, tasks.userId],
  }),
}));
// /* ═════════ SPRINT‑TASK EVENTS (remote-only) ═════════ */
// export const taskRunEventEnum = pgEnum("task_run_event", [
//   "completed", // user marked task as done
//   "uncompleted", // user unmarked task as done
//   "skipped", // user marked task as skipped
//   "unskipped", // user unmarked task as skipped
//   "promoted", // user move task up in the sprint queue
//   "pulled", // user pulled task from another sprint
// ]);

// export const taskRunEvents = pgTable(
//   "task_run_events",
//   {
//     id: uuid().defaultRandom().notNull(),
//     userId: text().notNull(),
//     sprintId: uuid()
//       .references(() => sprints.id, { onDelete: "cascade" })
//       .notNull(),
//     taskId: uuid()
//       .references(() => tasks.id, { onDelete: "cascade" })
//       .notNull(),

//     timestamp: timestamp({ withTimezone: true }).defaultNow().notNull(),
//     event: taskRunEventEnum().notNull(),
//   },
//   (t) => [
//     primaryKey({ columns: [t.id, t.userId] }),
//     index("idx_task_run_events").on(t.sprintId, t.timestamp),
//   ],
// );

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
