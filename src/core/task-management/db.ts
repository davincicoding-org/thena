import type { z } from "zod";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

import { projects, taskPriority, tasks } from "@/database/schema";

// MARK: Task

export const taskInsertSchema = createInsertSchema(tasks);
export type TaskInsert = z.infer<typeof taskInsertSchema>;

export const taskUpdateSchema = createUpdateSchema(tasks);
export type TaskUpdate = z.infer<typeof taskUpdateSchema>;

export const taskSelectSchema = createSelectSchema(tasks);
export type TaskSelect = z.infer<typeof taskSelectSchema>;

export const taskIdSchema = taskSelectSchema.shape.id;
export type TaskId = z.infer<typeof taskIdSchema>;

export const taskPriorityEnum = createSelectSchema(taskPriority);
export type TaskPriority = z.infer<typeof taskPriorityEnum>;

// MARK: Project

export const projectInsertSchema = createInsertSchema(projects);
export type ProjectInsert = z.infer<typeof projectInsertSchema>;

export const projectUpdateSchema = createUpdateSchema(projects);
export type ProjectUpdate = z.infer<typeof projectUpdateSchema>;

export const projectSelectSchema = createSelectSchema(projects);
export type ProjectSelect = z.infer<typeof projectSelectSchema>;
