import { Dispatch, SetStateAction } from "react";
import { z } from "zod";

import { ExtendedCustomColors } from "@/mantine";

export const colorsEnum = z.enum([
  "primary",
  "dark",
  "gray",
  "red",
  "pink",
  "grape",
  "violet",
  "indigo",
  "blue",
  "cyan",
  "teal",
  "green",
  "lime",
  "yellow",
  "orange",
]);

export type Color = z.infer<typeof colorsEnum>;

interface BaseTask {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  estimate?: number;
  complexity?: number;
}

/**
 * Minimal subtask
 */
export interface Subtask extends BaseTask {}

export interface Task extends BaseTask {
  projectId?: string;
  subtasks?: Subtask[];
}

/**
 * Task inside the backlog
 */
export interface BacklogTask extends Task {
  addedAt: string; // ISO date string
}

const backlogSortOptionsSchema = z.object({
  sortBy: z.enum(["title", "addedAt"]),
  direction: z.enum(["asc", "desc"]),
});
export type BacklogSortOptions = z.infer<typeof backlogSortOptionsSchema>;

export const BACKLOG_SORT_OPTIONS = {
  sortBy: backlogSortOptionsSchema.shape.sortBy.options,
  direction: backlogSortOptionsSchema.shape.direction.options,
};

export interface BacklogFilters {
  projectIds?: string[];
  tags?: string[];
  search?: string;
}

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().optional(),
  color: colorsEnum.optional(),
  description: z.string().optional(),
});
export type Project = z.infer<typeof projectSchema>;

export interface Tag {
  id: string;
  name: string;
  description?: string;
  color?: ExtendedCustomColors;
}

export type StateHook<S> = (
  initialState: S,
) => [S, Dispatch<SetStateAction<S>>];
