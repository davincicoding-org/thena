import { Dispatch, SetStateAction } from "react";
import { ClassValue, clsx } from "clsx";
import { nanoid } from "nanoid";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type StateSetter<S> = Dispatch<SetStateAction<S>>;

export type ExternalState<S> = [S, StateSetter<S>];

export const createUniqueId = (
  excluded: Record<string, unknown> | Array<{ id: string }>,
): string => {
  const id = nanoid();
  const isColliding = Array.isArray(excluded)
    ? excluded.some((item) => item.id === id)
    : excluded[id];

  if (isColliding) return createUniqueId(excluded);
  return id;
};
