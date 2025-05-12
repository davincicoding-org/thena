import { and, eq, sql } from "drizzle-orm";

import type { RunnableSprint, TaskRun } from "@/core/deep-work";
import { resolveDuration, sprintPlanSchema } from "@/core/deep-work";
import {
  focusSessionSelect,
  sprintSelect,
  sprintUpdate,
  taskRunSelect,
  taskRunUpdate,
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
      const sprintIds = await Promise.all(
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

            await db.insert(taskRuns).values(
              tasks.map((task, taskOrdinal) => ({
                userId: auth.userId,
                sprintId: insertedSprint.id,
                taskId: task,
                ordinal: taskOrdinal,
              })),
            );
            return insertedSprint.id;
          },
        ),
      );

      return { sessionId: session.id, sprintIds };
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
                  timestamps: true,
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
          timestamps: taskRun.timestamps,
          task: taskRun.task,
        })),
      }));
    }),

  sprint: {
    update: protectedProcedure
      .input(
        sprintSelect.pick({ id: true }).extend({
          updates: sprintUpdate,
        }),
      )
      .mutation(async ({ ctx: { db, auth }, input }) => {
        return await db
          .update(sprints)
          .set(input.updates)
          .where(
            and(eq(sprints.id, input.id), eq(sprints.userId, auth.userId)),
          );
      }),
  },
  taskRun: {
    update: protectedProcedure
      .input(
        taskRunSelect.pick({ id: true }).extend({
          updates: taskRunUpdate,
        }),
      )
      .mutation(async ({ ctx: { db, auth }, input }) => {
        const [result] = await db
          .update(taskRuns)
          .set(input.updates)
          .where(
            and(eq(taskRuns.id, input.id), eq(taskRuns.userId, auth.userId)),
          )
          .returning();

        return result;
      }),
    appendTimestamp: protectedProcedure
      .input(taskRunSelect.pick({ id: true }))
      .mutation(async ({ ctx: { db, auth }, input }) => {
        const [result] = await db
          .update(taskRuns)
          .set({ timestamps: sql`array_append(${taskRuns.timestamps}, now())` })
          .where(
            and(eq(taskRuns.id, input.id), eq(taskRuns.userId, auth.userId)),
          )
          .returning();

        return result;
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
