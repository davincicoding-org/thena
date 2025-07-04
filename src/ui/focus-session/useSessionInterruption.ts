import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useWindowEvent } from "@mantine/hooks";

import type { FocusSessionInterruption } from "@/core/deep-work";
import type {
  FocusSessionBreakSelect,
  FocusSessionSelect,
  TaskRunSelect,
} from "@/core/deep-work/db";

export function useSessionInterruption({
  sessionId,
  taskRunId,
  breakId,
}: {
  sessionId?: FocusSessionSelect["id"];
  taskRunId?: TaskRunSelect["id"];
  breakId?: FocusSessionBreakSelect["id"];
}) {
  const { userId } = useAuth();

  useEffect(() => {
    return () => triggerBeacon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useWindowEvent("beforeunload", (e) => {
    const shouldWarn = !!sessionId || !!taskRunId || !!breakId;
    if (!shouldWarn) return;

    e.preventDefault();
    e.returnValue = "";
  });
  useWindowEvent("pagehide", (e) => {
    if (e.persisted) return;
    triggerBeacon();
  });

  const triggerBeacon = () => {
    if (!userId) return;
    const shouldSendBeacon = !!sessionId || !!taskRunId || !!breakId;
    if (!shouldSendBeacon) return;

    const url = "/api/focus-session-interruption";
    const data: FocusSessionInterruption = {
      taskRunId,
      sessionId,
      breakId,
      userId,
      timestamp: Date.now(),
    };
    navigator.sendBeacon(
      url,
      new Blob([JSON.stringify(data)], { type: "application/json" }),
    );
  };
}
