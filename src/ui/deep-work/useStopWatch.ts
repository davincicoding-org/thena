import { useEffect, useState } from "react";
import { readLocalStorageValue, useWindowEvent } from "@mantine/hooks";

export function useStopWatch() {
  const STORAGE_KEY = "focus-session-time-elapsed";

  useWindowEvent("beforeunload", () => {
    handleInterruption();
  });
  useEffect(() => {
    if (typeof window === "undefined") return;
    return () => {
      handleInterruption();
    };
  }, []);

  const [timeElapsed, setTimeElapsed] = useState<number>(() => {
    const restoredTimeElapsed = readLocalStorageValue<number>({
      key: STORAGE_KEY,
      defaultValue: 0,
    });
    if (typeof window === "undefined") return 0;
    localStorage?.removeItem(STORAGE_KEY);
    return restoredTimeElapsed;
  });

  const [totalTime, setTotalTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const handleInterruption = () => {
    if (!isRunning) return;
    localStorage.setItem(STORAGE_KEY, timeElapsed.toString());
  };

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 100);
    }, 100);
    return () => clearInterval(interval);
  }, [isRunning]);

  const start = (duration: number) => {
    setTotalTime(duration);
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const resume = () => {
    setIsRunning(true);
  };

  const reset = () => {
    setTimeElapsed(0);
    setTotalTime(0);
    setIsRunning(false);
  };

  return {
    timeElapsed,
    totalTime,
    start,
    pause,
    resume,
    reset,
    setTimeElapsed,
  };
}
