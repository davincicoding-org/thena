import type { FocusSessionSelect } from "@/core/deep-work/db";
import type { FlatTask, TaskId } from "@/core/task-management";

export type FocusSessionStatus = "idle" | "session" | "break" | "finished";

export interface FocusSessionConfig {
  // Duration in seconds
  plannedDuration: number;
}

export type TaskQueueItem = FlatTask & {
  skipped?: boolean;
};

export interface ActiveFocusSession {
  queue: TaskQueueItem[];
  currentTaskId: TaskId | undefined;
  timeElapsed: number;
  duration: number;
}

export interface FocusSessionSummary {
  id: FocusSessionSelect["id"];
  tasks: FlatTask[];
}
