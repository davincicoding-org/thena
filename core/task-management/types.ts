import { z } from "zod";

export const taskPriorityEnum = z.enum([
  "critical",
  "urgent",
  "default",
  "deferred",
  "optional",
]);
export type TaskPriority = z.infer<typeof taskPriorityEnum>;

export const taskComplexityEnum = z.enum([
  "trivial",
  "simple",
  "default",
  "complex",
]);
export type TaskComplexity = z.infer<typeof taskComplexityEnum>;

export const baseTaskSchema = z.object({
  id: z.string(),
  title: z.string().trim().min(1),
  tags: z.array(z.string()).optional(),
  estimatedTime: z.number().optional().nullable(),
  complexity: taskComplexityEnum.optional().nullable(),
  priority: taskPriorityEnum.optional().nullable(),
});
export type BaseTask = z.infer<typeof baseTaskSchema>;

export const subtaskSchema = baseTaskSchema;
export type Subtask = z.infer<typeof subtaskSchema>;

export const taskSchema = baseTaskSchema.extend({
  projectId: z.string().optional().nullable(),
  subtasks: z.array(subtaskSchema).optional(),
});
export type Task = z.infer<typeof taskSchema>;

export const taskInputSchema = taskSchema.omit({
  id: true,
});
export type TaskInput = z.infer<typeof taskInputSchema>;

/**
 * Task reference
 */

export const taskReferenceSchema = z.object({
  taskId: z.string(),
  subtaskId: z.string().nullable(),
});
export type TaskReference = z.infer<typeof taskReferenceSchema>;

export const flatTaskSchema = baseTaskSchema
  .omit({ id: true })
  .extend({
    parentTitle: z.string().optional(),
    projectId: z.string().optional().nullable(),
  })
  .and(taskReferenceSchema);

export type FlatTask = z.infer<typeof flatTaskSchema>;

export interface FlatTaskGroup {
  taskId: TaskReference["taskId"];
  groupLabel: string;
  items: FlatTask[];
}

export const storedTaskSchema = taskSchema.extend({
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
});
export type StoredTask = z.infer<typeof storedTaskSchema>;

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
  name: z.string().min(1),
  image: z.string().optional(),
  color: colorsEnum.optional(),
  description: z.string().optional(),
});
export type Project = z.infer<typeof projectSchema>;

export const projectInputSchema = projectSchema.omit({ id: true }).extend({
  imageFile: z.instanceof(File).optional(),
});
export type ProjectInput = z.infer<typeof projectInputSchema>;

export const tagSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  color: colorsEnum.optional(),
});
export type Tag = z.infer<typeof tagSchema>;

export const tagInputSchema = tagSchema.omit({ id: true });
export type TagInput = z.infer<typeof tagInputSchema>;
