/* ──────────────────────────  relations.ts  ───────────────────────── */

import { relations } from "drizzle-orm";

import { projects, sprints, taskRuns, tasks } from "./schema";

/* ═════════ USERS ═════════ */
// export const usersRelations = relations(users, ({ many }) => ({
//   projects: many(projects),
//   sprints: many(sprints),
//   tasks: many(tasks),
// }));

/* ═════════ PROJECTS ═════════ */
export const projectsRelations = relations(projects, ({ one, many }) => ({
  // owner: one(users, {
  //   fields: [projects.uid],
  //   references: [users.uid],
  // }),
  tasks: many(tasks),
}));

/* ═════════ SPRINTS ═════════ */
export const sprintsRelations = relations(sprints, ({ one, many }) => ({
  // owner: one(users, {
  //   fields: [sprints.userId],
  //   references: [users.userId],
  // }),
  taskRuns: many(taskRuns),
  // events: many(sprintTaskEvents),
}));

/* ═════════ TASKS ═════════ */

/* ═════════ SPRINT‑TASK LINKS ═════════ */
export const taskRunsRelations = relations(taskRuns, ({ one }) => ({
  sprint: one(sprints, {
    fields: [taskRuns.sprintId],
    references: [sprints.id],
  }),
  task: one(tasks, {
    fields: [taskRuns.taskId],
    references: [tasks.id],
  }),
}));
