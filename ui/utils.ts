import { Dispatch, SetStateAction } from "react";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type StateSetter<S> = Dispatch<SetStateAction<S>>;

export type ExternalState<S> = [S, StateSetter<S>];
