import type { SQL } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import {
  check,
  index,
  pgEnum,
  pgTable,
  uniqueIndex,
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

export const taskStatusEnum = pgEnum("task_status", [
  "todo",
  "completed",
  "deleted",
]);

export const tasks = pgTable(
  "tasks",
  (d) => ({
    id: d.serial().primaryKey(),
    createdAt: d
      .timestamp({ withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: d
      .timestamp({ withTimezone: true, mode: "date" })
      .$onUpdate(() => new Date()),
    userId: d.text().notNull(),
    customSortOrder: d.doublePrecision(),
    sortOrder: d
      .doublePrecision()
      .generatedAlwaysAs(
        (): SQL => sql`COALESCE(${tasks.customSortOrder}, ${tasks.id})`,
      )
      .notNull(),

    parentId: d.integer().references((): AnyPgColumn => tasks.id, {
      onDelete: "cascade",
    }),
    projectId: d.integer().references(() => projects.id, {
      onDelete: "set null",
    }),

    status: taskStatusEnum().default("todo").notNull(),
    title: d.text().notNull(),
    priority: taskPriority(),
    complexity: taskComplexity(),
  }),
  (t) => [
    check("no_task_as_own_parent", sql`${t.id} IS DISTINCT FROM ${t.parentId}`),
    /* made DEFERRABLE via extraSql */
    uniqueIndex("leaf_or_root_only").on(t.id),
    index("idx_tasks_parent").on(t.parentId),
    index("idx_tasks_project").on(t.projectId),
    index("idx_tasks_status").on(t.status),
    index("idx_tasks_owner").on(t.userId),
  ],
);

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  parent: one(tasks, {
    fields: [tasks.parentId],
    references: [tasks.id],
    relationName: "subtasks",
  }),

  subtasks: many(tasks, { relationName: "subtasks" }),

  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
    relationName: "project_tasks",
  }),

  runs: many(taskRuns),
  // events: many(taskRunEvents),
}));

/* ═════════ PROJECTS ═════════ */
export const projects = pgTable(
  "projects",
  (d) => ({
    id: d.serial().primaryKey(),
    userId: d.text().notNull(),
    title: d.text().notNull(),
    description: d.text(),
    image: d.text(),
  }),
  (t) => [index("idx_projects_owner").on(t.userId)],
);

export const projectsRelations = relations(projects, ({ many }) => ({
  tasks: many(tasks, { relationName: "project_tasks" }),
}));

/* ═════════ FOCUS SESSIONS ═════════ */
// export const focusSessions = pgTable(
//   "focus_sessions",
//   {
//     id: uuid().defaultRandom().notNull().primaryKey(),
//     userId: text().notNull(),
//     createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
//   },
//   (t) => [index("idx_focus_sessions_owner").on(t.userId)],
// );

// export const focusSessionsRelations = relations(focusSessions, ({ many }) => ({
//   sprints: many(sprints),
// }));

/* ═════════ SPRINTS ═════════ */
export const sprints = pgTable(
  "sprints",
  (d) => ({
    id: d.serial().primaryKey(),
    userId: d.text().notNull(),
    // sessionId: uuid().references(() => focusSessions.id, {
    //   onDelete: "cascade",
    // }),

    /** Duration in minutes */
    duration: d.integer().notNull(),
    /** Break after sprint in minutes */
    recoveryTime: d.integer(),
    // scheduledStart: timestamp({ withTimezone: true }),
    // ordinal: integer().notNull(),

    // createdAt: timestamp({ withTimezone: true }).defaultNow(),
    startedAt: d.timestamp({ withTimezone: true }),
    endedAt: d.timestamp({ withTimezone: true }),

    focusTime: d.integer(),
    completedTasks: d.integer(),
    skippedTasks: d.integer(),
  }),
  (t) => [
    check("positive_duration", sql`${t.duration} > 0`),
    index("idx_sprints_owner").on(t.userId),
    index("idx_sprints_ended_at").on(t.endedAt),
    // index("idx_sprints_session").on(t.sessionId),
  ],
);

export const sprintsRelations = relations(sprints, ({ one, many }) => ({
  // focusSession: one(focusSessions, {
  //   fields: [sprints.sessionId, sprints.userId],
  //   references: [focusSessions.id, focusSessions.userId],
  // }),
  taskRuns: many(taskRuns),
}));

/* ═════════ TASK RUNS ═════════ */
export const taskRunStatusEnum = pgEnum("task_run_status", [
  "pending", // planned but not yet done
  "skipped", // unfinished, skipped
  "completed", // finished in this sprint
]);

export const taskRuns = pgTable(
  "task_runs",
  (d) => ({
    id: d.serial().primaryKey(),
    sprintId: d
      .integer()
      .notNull()
      .references(() => sprints.id, {
        onDelete: "cascade",
      }),
    userId: d.text().notNull(),
    taskId: d
      .integer()
      .notNull()
      .references(() => tasks.id, {
        onDelete: "cascade",
      }),

    status: taskRunStatusEnum().default("pending").notNull(),
    // addedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    ordinal: d.integer().notNull(),

    timestamps: d.timestamp({ withTimezone: true }).array().default([]),
    duration: d.integer(),
  }),
  (t) => [
    index("idx_task_run_sprint_id").on(t.sprintId),
    index("idx_task_run_owner").on(t.userId),
    uniqueIndex("ux_task_run_order").on(t.sprintId, t.ordinal),
  ],
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

// export const clientMigrations = pgTable(
//   "client_migrations",
//   {
//     tag: text().primaryKey(),
//     appliedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
//   },
//   (t) => [index("idx_client_migrations_applied_at").on(t.appliedAt)],
// );

// TODO this is not applied yet. Apply it or remove

// TODO: Fix extraSql - currently commented out due to column name mismatches
// export const extraSql = sql`
// /* 1. make leaf_or_root_only deferrable + stop sub-subtasks */
//   ALTER TABLE tasks
//     ALTER CONSTRAINT leaf_or_root_only
//     DEFERRABLE INITIALLY DEFERRED;

//   CREATE OR REPLACE FUNCTION enforce_one_level()
//   RETURNS trigger LANGUAGE plpgsql AS $$
//   BEGIN
//     IF NEW.parent_task_id IS NOT NULL THEN
//       PERFORM 1 FROM tasks WHERE parent_task_id = NEW.task_id LIMIT 1;
//       IF FOUND THEN
//         RAISE EXCEPTION 'Subtasks cannot have subtasks (%).', NEW.task_id;
//       END IF;
//     END IF;
//     RETURN NEW;
//   END $$;

//   CREATE CONSTRAINT TRIGGER chk_one_level
//   AFTER INSERT OR UPDATE ON tasks
//   DEFERRABLE INITIALLY DEFERRED
//   FOR EACH ROW EXECUTE FUNCTION enforce_one_level();

//   /* 2. leaf-only sprint rule */

//   CREATE OR REPLACE FUNCTION only_leaf_tasks_in_sprint()
//   RETURNS trigger LANGUAGE plpgsql AS $$
//   BEGIN
//     PERFORM 1 FROM tasks WHERE parent_task_id = NEW.task_id LIMIT 1;
//     IF FOUND THEN
//       RAISE EXCEPTION 'Task % has subtasks; add its subtasks instead.', NEW.task_id;
//     END IF;

//     RETURN NEW;
//   END $$;

//   CREATE TRIGGER trg_leaf_only
//   BEFORE INSERT ON sprint_tasks
//   FOR EACH ROW EXECUTE FUNCTION only_leaf_tasks_in_sprint();
// `;
