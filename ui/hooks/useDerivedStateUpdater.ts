import { Dispatch, SetStateAction, useCallback } from "react";

export function useDerivedStateUpdater<Original, Result>({
  setState,
  transformer,
  updater,
}: {
  setState: Dispatch<SetStateAction<Original>>;
  transformer: (value: Original) => Result;
  updater: (prev: Original, value: Result) => Original;
}): Dispatch<SetStateAction<Result>> {
  return useCallback((action) => {
    setState((prev) => {
      const result =
        typeof action === "function"
          ? (action as (prev: Result) => Result)(transformer(prev))
          : action;

      return updater(prev, result);
    });
  }, []);
}
