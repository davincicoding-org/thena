import { useEffect, useState } from "react";

export function useStopWatch() {
  const [timeElapsed, setTimeElapsed] = useState<number>(0);

  const [totalTime, setTotalTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 0.1);
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
