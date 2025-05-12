import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

import type { RunnableSprint, TaskRun } from "@/core/deep-work";
import { resolveDuration, sprintPlanSchema } from "@/core/deep-work";
import {
  focusSessionSelect,
  sprintSelect,
  taskRunSelect,
} from "@/core/deep-work/db";
import { taskSelectSchema } from "@/core/task-management";
import { focusSessions, sprints, taskRuns, tasks } from "@/db/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const focusSessionsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(sprintPlanSchema.array())
    .mutation(async ({ ctx: { db, auth }, input }) => {
      const [session] = await db
        .insert(focusSessions)
        .values({
          userId: auth.userId,
        })
        .returning();

      if (!session) throw new Error("Failed to create session");
      await Promise.all(
        input.map(
          async ({ tasks, duration, scheduledStart }, sprintOrdinal) => {
            const [insertedSprint] = await db
              .insert(sprints)
              .values({
                userId: auth.userId,
                sessionId: session.id,
                duration: resolveDuration(duration).asMinutes(),
                scheduledStart,
                // recoveryTimeMinutes,
                ordinal: sprintOrdinal,
              })
              .returning();

            if (!insertedSprint) throw new Error("Failed to create sprint");

            await db
              .insert(taskRuns)
              .values(
                tasks.map((task, taskOrdinal) => ({
                  userId: auth.userId,
                  sprintId: insertedSprint.id,
                  taskId: task,
                  ordinal: taskOrdinal,
                })),
              )
              .returning();
          },
        ),
      );

      return session.id;
    }),

  get: protectedProcedure
    .input(focusSessionSelect.shape.id.optional())
    .query(async ({ ctx: { db, auth }, input }) => {
      if (!input) return null;
      const session = await db.query.focusSessions.findFirst({
        where: (focusSessions, { eq, and }) =>
          and(
            eq(focusSessions.id, input),
            eq(focusSessions.userId, auth.userId),
          ),
        with: {
          sprints: {
            orderBy: (sprints, { asc }) => asc(sprints.ordinal),
            with: {
              taskRuns: {
                columns: {
                  id: true,
                  status: true,
                },
                orderBy: (taskRuns, { asc }) => asc(taskRuns.ordinal),
                with: {
                  task: {
                    with: {
                      parent: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!session) return null;

      return session.sprints.map<RunnableSprint>((sprint) => ({
        id: sprint.id,
        duration: {
          minutes: sprint.duration,
        },
        tasks: sprint.taskRuns.map<TaskRun>((taskRun) => ({
          runId: taskRun.id,
          status: taskRun.status,
          task: taskRun.task,
        })),
      }));
    }),

  sprint: {
    trackTime: protectedProcedure
      .input(
        sprintSelect.pick({ id: true }).extend({
          type: z.enum(["start", "end"]),
        }),
      )
      .mutation(async ({ ctx: { db, auth }, input }) => {
        const updateKey = { start: "startedAt", end: "endedAt" }[input.type];
        return await db
          .update(sprints)
          .set({ [updateKey]: sql`NOW()` })
          .where(
            and(eq(sprints.id, input.id), eq(sprints.userId, auth.userId)),
          );
      }),
  },
  taskRun: {
    updateStatus: protectedProcedure
      .input(taskRunSelect.pick({ id: true, status: true }))
      .mutation(async ({ ctx: { db, auth }, input }) => {
        const [taskRun] = await db
          .update(taskRuns)
          .set({ status: input.status })
          .where(
            and(eq(taskRuns.id, input.id), eq(taskRuns.userId, auth.userId)),
          )
          .returning();

        if (!taskRun) throw new Error("Task run not found");

        switch (input.status) {
          case "completed":
          case "pending":
            await db
              .update(tasks)
              .set({ status: input.status })
              .where(eq(tasks.id, taskRun.taskId));
        }
      }),
  },
  task: {
    updateStatus: protectedProcedure
      .input(taskSelectSchema.pick({ id: true, status: true }))
      .mutation(async ({ ctx: { db, auth }, input }) => {
        return await db
          .update(tasks)
          .set({ status: input.status })
          .where(and(eq(tasks.id, input.id), eq(tasks.userId, auth.userId)));
      }),
  },
});
