import { Dispatch, SetStateAction, useCallback, useRef, useState } from "react";

export interface TemporalStateHookOptions<T> {
  initialValue?: T;
  externalState?: [T, Dispatch<SetStateAction<T>>, ...unknown[]];
}

export type TemporalStateHookReturn<T> = [
  state: T,
  setState: Dispatch<SetStateAction<T>>,
  history: {
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    reset: () => void;
  },
];

export function useTemporalState<T>({
  initialValue,
  externalState: [state, setState] = useState<T>(initialValue as T),
}: TemporalStateHookOptions<T>): TemporalStateHookReturn<T> {
  const pastRef = useRef<T[]>([]);
  const futureRef = useRef<T[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const set = useCallback<TemporalStateHookReturn<T>[1]>(
    (action) => {
      pastRef.current.push(state);
      setState(action);
      futureRef.current = [];
      setCanUndo(true);
      setCanRedo(false);
    },
    [setState],
  );

  const undo = useCallback(() => {
    if (pastRef.current.length === 0) return;
    const prev = pastRef.current.pop()!;
    setState((current) => {
      futureRef.current.push(current);
      return prev;
    });
    setCanUndo(pastRef.current.length > 0);
    setCanRedo(true);
  }, [setState]);

  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return;

    const next = futureRef.current.pop()!;
    pastRef.current.push(state);
    setState(next);
    setCanUndo(true);
    setCanRedo(futureRef.current.length > 0);
  }, [setState, state]);

  const resetHistory = useCallback(() => {
    pastRef.current = [];
    futureRef.current = [];
    setCanUndo(false);
    setCanRedo(false);
  }, []);

  return [state, set, { undo, redo, canUndo, canRedo, reset: resetHistory }];
}
