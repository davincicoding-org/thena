import { useRef } from "react";

export interface TimeTravelEvent {
  event: "push" | "undo" | "redo";
  action: string;
}

export interface TimeTravelActionConfig<Params extends unknown[], Artifact> {
  name: string;
  apply: (...params: Params) => Promise<Artifact>;
  revert: (artifact: Artifact) => void;
}

export type TimeTravelActionFactory<Params extends unknown[], Artifact> = (
  config: TimeTravelActionConfig<Params, Artifact>,
) => (...params: Params) => Promise<void>;

export interface TimeTravelHookOptions {
  onNavigated?: (event: TimeTravelEvent) => void;
}

export interface TimeTravelHookReturn {
  undo: () => Promise<void>;
  redo: () => Promise<void>;
  reset: () => void;
}

export function useTimeTravel({ onNavigated }: TimeTravelHookOptions = {}) {
  const pastStack = useRef<
    {
      action: string;
      artifact: unknown;
      apply: () => Promise<unknown>;
      restore: (artifact: unknown) => Promise<void>;
    }[]
  >([]);

  const futureStack = useRef<
    {
      action: string;
      apply: () => Promise<unknown>;
      restore: () => Promise<void>;
    }[]
  >([]);

  const createAction = <Params extends unknown[], Artifact>({
    name,
    apply,
    revert,
  }: TimeTravelActionConfig<Params, Artifact>) => {
    return (...params: Params) => {
      void apply(...params).then((artifact) => {
        onNavigated?.({
          event: "push",
          action: name,
        });
        pastStack.current.push({
          action: name,
          artifact,
          apply: () => apply(...params),
          // @ts-expect-error - poorly typed
          restore: revert,
        });
      });
    };
  };

  const undo: TimeTravelHookReturn["undo"] = async () => {
    const prevAction = pastStack.current.pop();
    if (!prevAction) return;

    await prevAction.restore(prevAction.artifact);

    futureStack.current.push({
      action: prevAction.action,
      apply: () => prevAction.apply(),
      restore: () => prevAction.restore(prevAction.artifact),
    });
    onNavigated?.({
      event: "undo",
      action: prevAction.action,
    });
  };

  const redo: TimeTravelHookReturn["redo"] = async () => {
    const nextAction = futureStack.current.pop();
    if (!nextAction) return;

    const artifact = await nextAction.apply();

    pastStack.current.push({
      action: nextAction.action,
      artifact,
      apply: () => nextAction.apply(),
      restore: nextAction.restore,
    });
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
