import { z } from "zod";

import type { FlatTask } from "@/core/task-management";
import { taskReferenceSchema } from "@/core/task-management";

export const durationSchema = z.object({
  seconds: z.number().optional(),
  hours: z.number().optional(),
  minutes: z.number().optional(),
});

export type Duration = z.infer<typeof durationSchema>;

export const sprintPlanSchema = z.object({
  id: z.string(),
  duration: durationSchema,
  tasks: z.array(taskReferenceSchema),
});
export type SprintPlan = z.infer<typeof sprintPlanSchema>;

/**
 * Type helper that adds run metrics to any type, inferred from the schema
 */
export type WithRunMetrics<T> = T & {
  completedAt?: number;
  skipped?: boolean;
  pulledIn?: boolean;
};

export interface RunnableSprint extends SprintPlan {
  tasks: WithRunMetrics<FlatTask>[];
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
