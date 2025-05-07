import { z } from "zod";

import type { ProjectSelect } from "./db";
import { taskInsertSchema, taskSelectSchema } from "./db";

export const taskInputSchema = taskInsertSchema.omit({
  userId: true,
});
export type TaskInput = z.infer<typeof taskInputSchema>;

export const taskTreeSchema = taskSelectSchema
  .omit({
    parentTaskId: true,
  })
  .extend({
    subtasks: z
      .array(
        taskSelectSchema.omit({
          parentTaskId: true,
        }),
      )
      .min(1),
  });
export type TaskTree = z.infer<typeof taskTreeSchema>;

export const standaloneTaskSchema = taskSelectSchema.omit({
  parentTaskId: true,
});
export type StandaloneTask = z.infer<typeof standaloneTaskSchema>;

export const subtaskSchema = taskSelectSchema
  .omit({
    parentTaskId: true,
  })
  .extend({
    parent: standaloneTaskSchema,
  });
export type Subtask = z.infer<typeof subtaskSchema>;

export const flatTaskSchema = z.union([standaloneTaskSchema, subtaskSchema]);
export type FlatTask = z.infer<typeof flatTaskSchema>;

export const anyTaskSchema = z.union([
  standaloneTaskSchema,
  subtaskSchema,
  taskTreeSchema,
]);
export type AnyTask = z.infer<typeof anyTaskSchema>;

export const isTaskTree = (task: AnyTask): task is TaskTree => {
  if (!("subtasks" in task)) return false;
  if (!task.subtasks) return false;
  return task.subtasks.length > 0;
};

const tasksSortOptionsSchema = z.object({
  sortBy: z.enum(["title", "createdAt", "updatedAt"]),
  direction: z.enum(["asc", "desc"]),
});
export type TasksSortOptions = z.infer<typeof tasksSortOptionsSchema>;

export const TASKS_SORT_OPTIONS = {
  sortBy: tasksSortOptionsSchema.shape.sortBy.options,
  direction: tasksSortOptionsSchema.shape.direction.options,
};

export interface TaskFilters {
  projectIds?: ProjectSelect["uid"][];
  // tags?: string[];
  search?: string;
}

// MARK: Unused

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

export const tagSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  color: colorsEnum.optional(),
});
export type Tag = z.infer<typeof tagSchema>;

export const tagInputSchema = tagSchema.omit({ id: true });
export type TagInput = z.infer<typeof tagInputSchema>;
