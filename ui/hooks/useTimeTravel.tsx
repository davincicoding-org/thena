import { useRef } from "react";

export interface TimeTravelEvent {
  event: "push" | "undo" | "redo";
  action: string;
}

export interface TimeTravelActionConfig<Params extends unknown[]> {
  name: string;
  apply: (...params: Params) => void;
  revert: (...params: Params) => void;
}

export type TimeTravelActionFactory<Params extends unknown[] = []> = (
  config: TimeTravelActionConfig<Params>,
) => (...params: Params) => void;

export interface TimeTravelHookOptions {
  onNavigated?: (event: TimeTravelEvent) => void;
}

export interface TimeTravelHookReturn {
  createAction: TimeTravelActionFactory;
  undo: () => void;
  redo: () => void;
  reset: () => void;
}

export function useTimeTravel({
  onNavigated,
}: TimeTravelHookOptions = {}): TimeTravelHookReturn {
  const pastStack = useRef<
    {
      action: string;
      apply: () => void;
      restore: () => void;
    }[]
  >([]);

  const futureStack = useRef<
    { action: string; apply: () => void; restore: () => void }[]
  >([]);

  const createAction: TimeTravelHookReturn["createAction"] = ({
    name,
    apply,
    revert,
  }) => {
    return (...params) => {
      pastStack.current.push({
        action: name,
        apply: () => apply(...params),
        restore: () => revert(...params),
      });
    };
  };

  const undo: TimeTravelHookReturn["undo"] = () => {
    const prevAction = pastStack.current.pop();
    if (!prevAction) return;

    prevAction.restore();

    futureStack.current.push(prevAction);
    onNavigated?.({
      event: "undo",
      action: prevAction.action,
    });
  };

  const redo: TimeTravelHookReturn["redo"] = () => {
    const nextAction = futureStack.current.pop();
    if (!nextAction) return;

    nextAction.apply();

    pastStack.current.push(nextAction);
    onNavigated?.({
      event: "redo",
      action: nextAction.action,
    });
  };

  const reset: TimeTravelHookReturn["reset"] = () => {
    pastStack.current = [];
    futureStack.current = [];
  };

  return { createAction, undo, redo, reset };
}
