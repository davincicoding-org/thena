import { z } from "zod";

export const subTaskSchema = z.object({
  label: z.string().describe("Human-readable name of the task."),
  completedAt: z
    .string()
    .date()
    .optional()
    .describe("The ISO 8601 timestamp of when the subtask was completed."),
});
export type SubTask = z.infer<typeof subTaskSchema>;

export const taskSchema = z.object({
  label: z.string().describe("Human-readable name of the task."),
  subtasks: z
    .array(subTaskSchema)
    .optional()
    .describe("The subtasks of the task."),
});
export type Task = z.infer<typeof taskSchema>;

/* Utility functions */

export const taskManagerResponseSchema = z.object({
  reply: z.string(),
  tasks: z.array(taskSchema).nullable(),
  usage: z.object({
    promptTokens: z.number(),
    completionTokens: z.number(),
    totalTokens: z.number(),
  }),
});
export type TaskManagerResponse = z.infer<typeof taskManagerResponseSchema>;

export const taskManagerRequestSchema = z.object({
  messages: z.array(z.any()),
  tasks: z.array(taskSchema).nullable(),
});
export type TaskManagerRequest = z.infer<typeof taskManagerRequestSchema>;
