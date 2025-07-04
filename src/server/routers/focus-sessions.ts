import { and, eq } from "drizzle-orm";

import {
  focusSessionInsert,
  focusSessionSelect,
  taskRunInsert,
  taskRunSelect,
  taskRunUpdate,
} from "@/core/deep-work/db";
import { taskSelectSchema } from "@/core/task-management";
import { focusSessions, taskRuns, tasks } from "@/database/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const focusSessionsRouter = createTRPCRouter({
  open: protectedProcedure
    .input(
      focusSessionInsert.pick({
        plannedDuration: true,
      }),
    )
    .mutation(async ({ ctx: { db, auth }, input }) => {
      const [session] = await db
        .insert(focusSessions)
        .values({
          userId: auth.userId,
          ...input,
        })
        .returning();

      if (!session) throw new Error("Failed to create session");

      return session.id;
    }),

  close: protectedProcedure
    .input(focusSessionSelect.pick({ id: true, status: true }).required())
    .mutation(async ({ ctx: { db, auth }, input }) => {
      return await db
        .update(focusSessions)
        .set({ status: input.status, endedAt: new Date() })
        .where(
          and(
            eq(focusSessions.id, input.id),
            eq(focusSessions.userId, auth.userId),
          ),
        );
    }),
});
