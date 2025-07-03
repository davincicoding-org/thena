import { and, eq } from "drizzle-orm";

import type { TaskTree } from "@/core/task-management";
import {
  taskFormSchema,
  taskSelectionSchema,
  taskSelectSchema,
  taskUpdateSchema,
} from "@/core/task-management";
import { tasks } from "@/database/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const tasksRouter = createTRPCRouter({
  create: protectedProcedure
    .input(taskFormSchema)
    .mutation(async ({ ctx: { db, auth }, input }) => {
      const [result] = await db
        .insert(tasks)
        .values({
          ...input,
          userId: auth.userId,
        })
        .returning();

      if (!result) throw new Error("Failed to create task");

      return result;
    }),

  update: protectedProcedure
    .input(taskUpdateSchema.required({ id: true, parentId: true }))
    .mutation(async ({ ctx: { db, auth }, input: { id, ...updates } }) => {
      const [result] = await db
        .update(tasks)
        .set(updates)
        .where(and(eq(tasks.id, id), eq(tasks.userId, auth.userId)))
        .returning();
      if (!result) throw new Error("Failed to update task");
      return result;
    }),

  delete: protectedProcedure
    .input(taskSelectSchema)
    .mutation(async ({ ctx: { db, auth }, input }) => {
      const [result] = await db
        .delete(tasks)
        .where(and(eq(tasks.id, input.id), eq(tasks.userId, auth.userId)))
        .returning();
      return result;
    }),

  list: protectedProcedure
    .input(taskSelectSchema.pick({ status: true }))
    .query<TaskTree[]>(async ({ ctx: { db, auth }, input }) => {
      const result = await db.query.tasks.findMany({
        where: (tasks, { eq, and, isNull }) =>
          and(
            eq(tasks.userId, auth.userId),
            isNull(tasks.parentId),
            eq(tasks.status, input.status),
          ),
        orderBy: (tasks, { asc }) => [asc(tasks.sortOrder)],
        with: {
          subtasks: {
            orderBy: (tasks, { asc }) => [asc(tasks.sortOrder)],
          },
        },
      });
      return result;
    }),

  listFlat: protectedProcedure
    .input(taskSelectSchema.shape.id.array())
    .query(async ({ ctx: { db, auth }, input }) => {
      if (input.length === 0) return [];
      const result = await db.query.tasks.findMany({
        where: (tasks, { eq, and, inArray }) =>
          and(eq(tasks.userId, auth.userId), inArray(tasks.id, input)),
        with: {
          parent: true,
        },
      });
      return result;
    }),

  getSelection: protectedProcedure
    .input(taskSelectionSchema.array())
    .query(async ({ ctx: { db, auth }, input }) => {
      if (input.length === 0) return [];
      const result = await db.query.tasks.findMany({
        where: (tasks, { eq, and, isNull, inArray }) =>
          and(
            eq(tasks.userId, auth.userId),
            isNull(tasks.parentId),
            inArray(
              tasks.id,
              input.map((t) => t.id),
            ),
          ),
        with: {
          subtasks: {
            where: (tasks, { inArray }) =>
              inArray(
                tasks.id,
                input.flatMap((t) => t.subtasks ?? []),
              ),
          },
        },
      });
      return result;
    }),
});
