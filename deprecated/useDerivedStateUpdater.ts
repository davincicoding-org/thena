import type { Dispatch, SetStateAction } from "react";

export function useDerivedStateUpdater<Original, Result>(
  setState: Dispatch<SetStateAction<Original>>,
  {
    get,
    set,
  }: {
    get: (value: Original) => Result;
    set: (prev: Original, value: Result) => Original;
  },
): Dispatch<SetStateAction<Result>> {
  return (action) => {
    setState((prev) => {
      const result =
        typeof action === "function"
          ? (action as (prev: Result) => Result)(get(prev))
          : action;

      return set(prev, result);
    });
  };
}
