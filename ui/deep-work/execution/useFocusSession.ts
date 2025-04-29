import type { DurationUnitsObjectType } from "dayjs/plugin/duration";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

import type {
  FocusSessionBreak,
  FocusSessionStatus,
  PopulatedSprintPlan,
  SprintPlan,
} from "@/core/deep-work";
import type { Task } from "@/core/task-management";
import { resolveTaskReferencesFlat } from "@/core/task-management";

dayjs.extend(duration);

export interface FocusSessionHookOptions {
  breakDuration: DurationUnitsObjectType;
  // Some event handlers
}

export interface FocusSessionHookReturn {
  status: FocusSessionStatus;
  currentSprint: PopulatedSprintPlan | undefined;
  sessionBreak: FocusSessionBreak | undefined;
  initialize: (options: { sprints: SprintPlan[] }) => void;
  finishSprint: () => void;
  finishBreak: () => void;
  // summary: an array of each sprint's summary
}

export function useFocusSession(
  tasks: Task[],
  options: FocusSessionHookOptions,
): FocusSessionHookReturn {
  const [sprints, setSprints] = useState<SprintPlan[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionBreak, setSessionBreak] = useState<
    Omit<FocusSessionBreak, "sprintsLeft">
  >({
    duration: dayjs.duration(options.breakDuration).asMilliseconds(),
    timeElapsed: 0,
  });
  const [status, setStatus] = useState<FocusSessionStatus>("sprint");

  useEffect(() => {
    if (status !== "break") return;
    const timer = setInterval(() => {
      setSessionBreak((prev) => ({
        ...prev,
        timeElapsed: prev.timeElapsed + 100,
      }));
    }, 100);
    return () => clearInterval(timer);
  }, [status]);

  const initialize: FocusSessionHookReturn["initialize"] = (options) => {
    setSprints(options.sprints);
  };

  const finishSprint: FocusSessionHookReturn["finishSprint"] = () => {
    if (currentIndex === sprints.length - 1) {
      return setStatus("finished");
    }
    setStatus("break");
    setCurrentIndex(currentIndex + 1);
  };

  const finishBreak: FocusSessionHookReturn["finishBreak"] = () => {
    setStatus("sprint");
    setSessionBreak((prev) => ({
      ...prev,
      timeElapsed: 0,
    }));
  };

  const currentSprint = useMemo((): FocusSessionHookReturn["currentSprint"] => {
    const currentPlan = sprints[currentIndex];
    if (!currentPlan) return undefined;
    return {
      ...currentPlan,
      tasks: resolveTaskReferencesFlat(currentPlan.tasks, tasks),
    };
  }, [sprints, currentIndex, tasks]);

  return {
    status,
    currentSprint,
    sessionBreak:
      status === "break"
        ? { ...sessionBreak, sprintsLeft: sprints.length - currentIndex }
        : undefined,
    initialize,
    finishSprint,
    finishBreak,
  };
}
