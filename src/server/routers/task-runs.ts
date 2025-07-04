import { and, eq } from "drizzle-orm";

import { taskRunInsert, taskRunSelect } from "@/core/deep-work/db";
import { taskRuns } from "@/database/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const taskRunsRouter = createTRPCRouter({
  open: protectedProcedure
    .input(
      taskRunInsert.pick({
        taskId: true,
        focusSessionId: true,
        status: true,
      }),
    )
    .mutation(async ({ ctx: { db, auth }, input }) => {
      const [result] = await db
        .insert(taskRuns)
        .values({
          ...input,
          userId: auth.userId,
        })
        .returning();

      if (!result) throw new Error("Failed to create task run");

      return result;
    }),

  close: protectedProcedure
    .input(
      taskRunSelect.pick({
        id: true,
        status: true,
      }),
    )
    .mutation(async ({ ctx: { db, auth }, input }) => {
      const [result] = await db
        .update(taskRuns)
        .set({
          status: input.status,
          endedAt: new Date(),
        })
        .where(and(eq(taskRuns.id, input.id), eq(taskRuns.userId, auth.userId)))
        .returning();

      return result;
    }),
  // appendTimestamp: protectedProcedure
  //   .input(
  //     taskRunSelect.pick({ id: true }).extend({
  //       timestamp: z.date().optional(),
  //     }),
  //   )
  //   .mutation(async ({ ctx: { db, auth }, input }) => {
  //     const timestamp = input.timestamp ?? new Date();
  //     const [result] = await db
  //       .update(taskRuns)
  //       .set({
  //         timestamps: sql`array_append(${taskRuns.timestamps}, ${timestamp})`,
  //       })
  //       .where(
  //         and(eq(taskRuns.id, input.id), eq(taskRuns.userId, auth.userId)),
  //       )
  //       .returning();
  //     return result;
  //   }),
});
