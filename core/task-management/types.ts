import { Dispatch, SetStateAction } from "react";
import { z } from "zod";

export const baseTaskSchema = z.object({
  id: z.string(),
  title: z.string().trim().min(1),
  tags: z.array(z.string()).optional(),
  estimate: z.number().optional(),
  complexity: z.number().optional(),
});
export type BaseTask = z.infer<typeof baseTaskSchema>;

/**
 * Minimal subtask
 */

export const subtaskSchema = baseTaskSchema;
export type Subtask = z.infer<typeof subtaskSchema>;

/**
 * Task inside the backlog
 */

export const taskSchema = baseTaskSchema.extend({
  projectId: z.string().optional(),
  subtasks: z.array(subtaskSchema).optional(),
});
export type Task = z.infer<typeof taskSchema>;

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

export const colorsEnum = z.enum([
  "primary",
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

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().optional(),
  color: colorsEnum.optional(),
  description: z.string().optional(),
});
export type Project = z.infer<typeof projectSchema>;

export const tagSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  color: colorsEnum.optional(),
});
export type Tag = z.infer<typeof tagSchema>;
