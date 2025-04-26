import { z } from "zod";

import { Subtask, Task, taskSchema } from "@/core/task-management";

export const sprintPlanSchema = z.object({
  id: z.string(),
  duration: z.number(),
  tasks: z.array(taskSchema),
});
export type SprintPlan = z.infer<typeof sprintPlanSchema>;

export type WithRun<T> = T & {
  completedAt?: number;
  skipped?: boolean;
  pulledIn?: boolean;
};

/** Represents a single execution of a task within a session. */
export interface TaskRun extends WithRun<Task> {
  subtasks?: WithRun<Subtask>[];
}

export type SprintStatus = "idle" | "running" | "paused" | "completed";
