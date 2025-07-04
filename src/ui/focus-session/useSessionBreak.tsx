import { api } from "@/trpc/react";

export function useSessionBreak() {
  const {
    data: currentBreakId,
    mutate: startBreak,
    reset: resetCurrentBreak,
  } = api.focusSessionBreaks.start.useMutation();
  const { mutate: skipBreak } = api.focusSessionBreaks.skip.useMutation();
  const { mutate: stopBreak } = api.focusSessionBreaks.stop.useMutation();

  const start = (duration: number) => {
    startBreak({ plannedDuration: duration * 60 });
  };

  const stop = () => {
    if (!currentBreakId) return;
    stopBreak({ id: currentBreakId });
    resetCurrentBreak();
  };

  return { start, stop, skip: skipBreak };
}
