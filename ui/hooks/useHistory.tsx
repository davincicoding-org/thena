import { useRef } from "react";

export type ActionSideEffect = {
  apply: () => void;
  revert?: () => void;
};

export interface HistoryHookOptions<State, Action> {
  currentState: State;
  dispatch: (action: Action) => void;
  onNavigated: (state: {
    event: "undo" | "redo";
    // The action that was undone or redone
    action: Action;
    state: State;
  }) => void;
}

export interface HistoryHookReturn<Action> {
  push: (action: Action, sideEffect?: ActionSideEffect) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
}

export function useHistory<State, Action>({
  currentState,
  dispatch,
  onNavigated,
}: HistoryHookOptions<State, Action>): HistoryHookReturn<Action> {
  const pastStack = useRef<
    {
      state: State;
      nextSideEffect?: ActionSideEffect;
      nextAction: Action;
      restore: ActionSideEffect["revert"];
    }[]
  >([]);

  const futureStack = useRef<
    { state: State; action: Action; sideEffect?: ActionSideEffect }[]
  >([]);

  const push: HistoryHookReturn<Action>["push"] = (
    action: Action,
    sideEffect: ActionSideEffect | undefined,
    clearFutureStack = true,
  ) => {
    if (clearFutureStack) futureStack.current = [];

    if (sideEffect) sideEffect.apply();

    pastStack.current.push({
      state: currentState,
      nextSideEffect: sideEffect,
      nextAction: action,
      restore: sideEffect?.revert,
    });
    dispatch(action);
  };

  const undo: HistoryHookReturn<Action>["undo"] = () => {
    const prev = pastStack.current.pop();
    if (!prev) return;

    const { restore, state: prevState, nextSideEffect } = prev;

    if (restore) restore();
    futureStack.current.push({
      state: currentState,
      action: prev.nextAction,
      sideEffect: nextSideEffect,
    });
    onNavigated({
      event: "undo",
      action: prev.nextAction,
      state: prevState,
    });
  };

  const redo: HistoryHookReturn<Action>["redo"] = () => {
    const next = futureStack.current.pop();
    if (!next) return;

    const { sideEffect, state: nextState, action } = next;

    if (sideEffect) sideEffect.apply();
    onNavigated({ event: "redo", action, state: nextState });
  };

  const reset: HistoryHookReturn<Action>["reset"] = () => {
    pastStack.current = [];
    futureStack.current = [];
  };

  return { push, undo, redo, reset };
}
