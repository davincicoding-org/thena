import { z } from "zod";

export const subTaskSchema = z.object({
  label: z.string().describe("Human-readable name of the task."),
});

export const taskSchema = z.object({
  label: z.string().describe("Human-readable name of the task."),
  subtasks: z
    .array(subTaskSchema)
    .optional()
    .describe("The subtasks of the task."),
});
export type Task = z.infer<typeof taskSchema>;

export const taskGroupSchema = z
  .object({
    label: z.string().describe("Human-readable name of the task group."),
    tasks: z
      .array(taskSchema.describe("Subtask"))
      .describe("The subtasks of the task group."),
  })
  .describe("A task group");
export type TaskGroup = z.infer<typeof taskGroupSchema>;

export const tasksSchema = z.array(
  z.union([taskSchema.describe("Standalone Task"), taskGroupSchema]),
);
export type Tasks = z.infer<typeof tasksSchema>;

/* Utility functions */

export const isTaskGroup = (item: TaskGroup | Task): item is TaskGroup =>
  taskGroupSchema.safeParse(item).success;

export const buildTaskReference = (index: number, subIndex?: number) => {
  const base = String.fromCharCode(97 + index).toUpperCase();
  if (subIndex !== undefined) return `${base}${subIndex + 1}`;
  return base;
};

export const taskManagerResponseSchema = z.object({
  reply: z.string(),
  tasks: tasksSchema.nullable(),
  usage: z.object({
    promptTokens: z.number(),
    completionTokens: z.number(),
    totalTokens: z.number(),
  }),
});
export type TaskManagerResponse = z.infer<typeof taskManagerResponseSchema>;

export const taskManagerRequestSchema = z.object({
  messages: z.array(z.any()),
  tasks: tasksSchema.nullable(),
});
export type TaskManagerRequest = z.infer<typeof taskManagerRequestSchema>;
