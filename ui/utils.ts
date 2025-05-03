import type { ClassValue } from "clsx";
import type { Dispatch, SetStateAction } from "react";
import { clsx } from "clsx";
import { nanoid } from "nanoid";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type StateSetter<S> = Dispatch<SetStateAction<S>>;

export type ExternalState<S> = [S, StateSetter<S>];

export const createUniqueId = (
  excluded: Record<string, unknown> | { id: string }[],
  length?: number,
): string => {
  const id = nanoid(length);
  const isColliding = Array.isArray(excluded)
    ? excluded.some((item) => item.id === id)
    : excluded[id];

  if (isColliding) return createUniqueId(excluded);
  return id;
};

export type SyncMutationAction<Params, Result = void> = (
  params: Params,
  callback?: (result: Result) => void,
) => void;

export type AsyncMutationAction<Params, Result> = (
  params: Params,
) => Promise<Result>;

export type MutationAction<Params, Result = void> = SyncMutationAction<
  Params,
  Result
> & {
  asPromise: AsyncMutationAction<Params, Result>;
};

export function createMutationAction<Params, Result>(
  action: SyncMutationAction<Params, Result>,
  resultHandler?: (result: Result) => void,
): MutationAction<Params, Result> {
  const syncAction = (params: Params, callback?: (result: Result) => void) => {
    action(params, (result) => {
      resultHandler?.(result);
      callback?.(result);
    });
  };

  // @ts-expect-error - poorly typed
  return {
    ...syncAction,
    asPromise: (params) =>
      new Promise((resolve) =>
        action(params, (result) => {
          resultHandler?.(result);
          resolve(result);
        }),
      ),
  };
}
