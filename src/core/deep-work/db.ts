import type { z } from "zod";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

import { focusSessionBreaks, focusSessions, taskRuns } from "@/database/schema";

// MARK:  Focus Session

export const focusSessionInsert = createInsertSchema(focusSessions);
export type FocusSessionInsert = z.infer<typeof focusSessionInsert>;

export const focusSessionSelect = createSelectSchema(focusSessions);
export type FocusSessionSelect = z.infer<typeof focusSessionSelect>;

export const focusSessionUpdate = createUpdateSchema(focusSessions);
export type FocusSessionUpdate = z.infer<typeof focusSessionUpdate>;

// MARK:  Task Run

export const taskRunInsert = createInsertSchema(taskRuns);
export type TaskRunInsert = z.infer<typeof taskRunInsert>;

export const taskRunSelect = createSelectSchema(taskRuns);
export type TaskRunSelect = typeof taskRuns.$inferSelect;

export const taskRunUpdate = createUpdateSchema(taskRuns);
export type TaskRunUpdate = z.infer<typeof taskRunUpdate>;

// MARK:  Focus Session Break

export const focusSessionBreakInsert = createInsertSchema(focusSessionBreaks);
export type FocusSessionBreakInsert = z.infer<typeof focusSessionBreakInsert>;

export const focusSessionBreakSelect = createSelectSchema(focusSessionBreaks);
export type FocusSessionBreakSelect = z.infer<typeof focusSessionBreakSelect>;

export const focusSessionBreakUpdate = createUpdateSchema(focusSessionBreaks);
export type FocusSessionBreakUpdate = z.infer<typeof focusSessionBreakUpdate>;

// MARK: Sprint

// export const sprintInsert = createInsertSchema(sprints);
// export type SprintInsert = z.infer<typeof sprintInsert>;

// export const sprintSelect = createSelectSchema(sprints);
// export type SprintSelect = z.infer<typeof sprintSelect>;

// export const sprintUpdate = createUpdateSchema(sprints);
// export type SprintUpdate = z.infer<typeof sprintUpdate>;
