/* ──────────────────────────  relations.ts  ───────────────────────── */

import { relations } from "drizzle-orm";

import {
  projects,
  sprints,
  sprintTaskEvents,
  sprintTasks,
  tasks,
} from "./schema";

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
  sprintTasks: many(sprintTasks),
  events: many(sprintTaskEvents),
}));

/* ═════════ TASKS ═════════ */

/* ═════════ SPRINT‑TASK LINKS ═════════ */
export const sprintTasksRelations = relations(sprintTasks, ({ one }) => ({
  sprint: one(sprints, {
    fields: [sprintTasks.sprintId],
    references: [sprints.uid],
  }),
  task: one(tasks, {
    fields: [sprintTasks.taskId],
    references: [tasks.uid],
  }),
}));

/* ═════════ SPRINT‑TASK EVENTS ═════════ */
export const sprintTaskEventsRelations = relations(
  sprintTaskEvents,
  ({ one }) => ({
    sprint: one(sprints, {
      fields: [sprintTaskEvents.sprintId],
      references: [sprints.uid],
    }),
    task: one(tasks, {
      fields: [sprintTaskEvents.taskId],
      references: [tasks.uid],
    }),
  }),
);
