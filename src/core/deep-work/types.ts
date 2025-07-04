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

// export interface ActiveFocusSession {
//   id: FocusSessionSelect["id"];
//   currentSprintId?: RunnableSprint["id"];
//   currentTaskRunId?: TaskRunSelect["id"];
//   status: "idle" | "running" | "paused" | "break" | "finished";
// }

export interface TaskRun {
  runId: TaskRunSelect["id"];
  // status: TaskRunSelect["status"];
  // timestamps: TaskRunSelect["timestamps"];
  task: FlatTask;
}

export interface RunnableSprint extends Omit<SprintPlan, "tasks"> {
  tasks: TaskRun[];
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

export const focusSessionInterruptionSchema = z.object({
  taskRunId: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z.number().optional(),
  ),
  sessionId: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z.number().optional(),
  ),
  breakId: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z.number().optional(),
  ),
  userId: z.string(),
  timestamp: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z.number(),
  ),
});
export type FocusSessionInterruption = z.infer<
  typeof focusSessionInterruptionSchema
>;
