import { Dispatch, SetStateAction } from "react";
import { ClassValue, clsx } from "clsx";
import { nanoid } from "nanoid";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type StateSetter<S> = Dispatch<SetStateAction<S>>;

export type ExternalState<S> = [S, StateSetter<S>];

export const createUniqueId = (excluded: Record<string, unknown>): string => {
  const id = nanoid();
  if (excluded[id]) return createUniqueId(excluded);
  return id;
};
