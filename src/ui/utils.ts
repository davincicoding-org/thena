import type { ClassValue } from "clsx";
import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const derive = <T>(fn: () => T): T => fn();

export function useSyncedState<S>(initialState: S) {
  const [state, setState] = useState<S>(initialState);

  useEffect(() => {
    setState(initialState);
  }, [initialState]);

  return [state, setState] as const;
}
