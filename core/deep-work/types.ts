import { z } from "zod";

import type { TaskReference } from "@/core/task-management";
import { flatTaskSchema, taskReferenceSchema } from "@/core/task-management";

export const sprintPlanSchema = z.object({
  id: z.string(),
  duration: z.number(),
  tasks: z.array(taskReferenceSchema),
});
export type SprintPlan = z.infer<typeof sprintPlanSchema>;

export const populatedSprintPlanSchema = sprintPlanSchema.extend({
  tasks: z.array(flatTaskSchema),
});
export type PopulatedSprintPlan = z.infer<typeof populatedSprintPlanSchema>;

export type WithRun<T> = T & {
  completedAt?: number;
  skipped?: boolean;
  pulledIn?: boolean;
};

/** Represents a single execution of a task within a session. */
export type TaskRun = WithRun<TaskReference>;

export type RuntITem$$$ = TaskRun & {
  group: string | undefined;
  label: string;
};

export type SprintStatus = "idle" | "running" | "paused" | "over" | "completed";

export interface FocusSessionBreak {
  duration: number;
  timeElapsed: number;
  sprintsLeft: number;
}

export type FocusSessionStatus = "sprint" | "break" | "finished";
