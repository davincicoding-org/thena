import { z } from "zod";

import type { ProjectSelect } from "./db";
import { projectInsertSchema, taskSelectSchema } from "./db";

export const taskFormSchema = taskSelectSchema.pick({
  title: true,
  priority: true,
  complexity: true,
  projectId: true,
  parentId: true,
  customSortOrder: true,
});
export type TaskFormValues = z.infer<typeof taskFormSchema>;

export const taskSelectionSchema = taskSelectSchema.pick({ id: true }).extend({
  subtasks: taskSelectSchema.shape.id.array().optional(),
});
export type TaskSelection = z.infer<typeof taskSelectionSchema>;

export const projectInputSchema = projectInsertSchema
  .omit({
    userId: true,
  })
  .extend({
    image: z
      .union([
        projectInsertSchema.shape.image,
        z.object({
          contentType: z.string(),
          base64: z.string(),
        }),
      ])
      .optional(),
  });
export type ProjectInput = z.infer<typeof projectInputSchema>;

export const taskTreeSchema = taskSelectSchema
  .omit({
    parentId: true,
  })
  .extend({
    subtasks: z.array(
      taskSelectSchema.omit({
        parentId: true,
      }),
    ),
  });
export type TaskTree = z.infer<typeof taskTreeSchema>;

export const standaloneTaskSchema = taskSelectSchema
  .omit({
    parentId: true,
  })
  .extend({
    parent: z.null().optional(),
  });
export type StandaloneTask = z.infer<typeof standaloneTaskSchema>;

export const subtaskSchema = taskSelectSchema
  .omit({
    parentId: true,
  })
  .extend({
    parent: standaloneTaskSchema,
  });
export type Subtask = z.infer<typeof subtaskSchema>;

export const flatTaskSchema = z.union([standaloneTaskSchema, subtaskSchema]);
export type FlatTask = z.infer<typeof flatTaskSchema>;

export const anyTaskSchema = z.union([flatTaskSchema, taskTreeSchema]);
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
  projectIds?: ProjectSelect["id"][];
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
