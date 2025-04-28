import { useEffect, useState } from "react";
import dayjs from "dayjs";
import duration, { DurationUnitsObjectType } from "dayjs/plugin/duration";

import {
  FocusSessionBreak,
  FocusSessionStatus,
  SprintPlan,
} from "@/core/deep-work";

dayjs.extend(duration);

export interface FocusSessionHookOptions {
  breakDuration: DurationUnitsObjectType;
  // Some event handlers
}

export interface FocusSessionHookReturn {
  status: FocusSessionStatus;
  currentSprint: SprintPlan | undefined;
  sessionBreak: FocusSessionBreak | undefined;
  initialize: (options: { sprints: SprintPlan[] }) => void;
  finishSprint: () => void;
  finishBreak: () => void;
  // summary: an aarray of each sprint's summary
}

export function useFocusSession(
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

  return {
    status,
    currentSprint: sprints[currentIndex],
    sessionBreak:
      status === "break"
        ? { ...sessionBreak, sprintsLeft: sprints.length - currentIndex }
        : undefined,
    initialize,
    finishSprint,
    finishBreak,
  };
}
