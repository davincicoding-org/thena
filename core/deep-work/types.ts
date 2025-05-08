import { z } from "zod";

import type { TaskRunSelect } from "@/core/deep-work/db";
import type { FlatTask } from "@/core/task-management";
import { taskIdSchema } from "@/core/task-management";

export const durationSchema = z.object({
  seconds: z.number().optional(),
  hours: z.number().optional(),
  minutes: z.number().optional(),
});

export type Duration = z.infer<typeof durationSchema>;

export const sprintPlanSchema = z.object({
  id: z.string(),
  duration: durationSchema,
  scheduledStart: z.date().optional(),
  recoveryTime: durationSchema.optional(),
  tasks: z.array(taskIdSchema),
});
export type SprintPlan = z.infer<typeof sprintPlanSchema>;

/**
 * Type helper that adds run metrics to any type, inferred from the schema
 */
export type WithRunMetrics<T> = T & {
  completedAt?: number;
  skipped?: boolean;
  pulledIn?: boolean;
  promoted?: boolean;
};

export type RunnableTask = FlatTask & {
  runId: TaskRunSelect["id"];
  status: TaskRunSelect["status"];
};

export interface RunnableSprint extends Omit<SprintPlan, "tasks"> {
  tasks: RunnableTask[];
}

export interface SprintRunSlot {
  type: "sprint-run";
  sprint: RunnableSprint;
}

export interface SessionBreakSlot {
  type: "break";
  duration: Duration;
  nextSprint: RunnableSprint["id"];
}

export type FocusSessionStatus = "sprint" | "break" | "finished";
