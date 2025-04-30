import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

import type { FlatTask } from "@/core/task-management";

import type { Duration, WithRunMetrics } from "./types";

dayjs.extend(duration);

export const resolveDuration = (duration: Duration) => dayjs.duration(duration);

export const isTaskRunnable = (task: WithRunMetrics<FlatTask>) => {
  if (task.completedAt) return false;
  if (task.skipped) return false;
  return true;
};
