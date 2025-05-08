import { useUser } from "@clerk/nextjs";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { and, asc, eq, sql } from "drizzle-orm";

import type {
  RunnableSprint,
  RunnableTask,
  SprintPlan,
} from "@/core/deep-work";
import type { FocusSessionSelect } from "@/core/deep-work/db";
import { resolveDuration } from "@/core/deep-work";
import { getClientDB } from "@/db/client";
import * as Schema from "@/db/schema";

export function useCreateSession() {
  const { user } = useUser();

  return useMutation<FocusSessionSelect["id"], Error, SprintPlan[]>({
    mutationKey: ["create-session"],
    mutationFn: async (sprintPlans) => {
      if (!user) throw new Error("User not found");
      const db = await getClientDB();
      const [session] = await db
        .insert(Schema.focusSessions)
        .values({
          userId: user.id,
        })
        .returning();

      if (!session) throw new Error("Failed to create session");

      await Promise.all(
        sprintPlans.map(
          async ({ tasks, duration, scheduledStart }, sprintOrdinal) => {
            const [insertedSprint] = await db
              .insert(Schema.sprints)
              .values({
                userId: user.id,
                sessionId: session.id,
                duration: resolveDuration(duration).asMinutes(),
                scheduledStart,
                // recoveryTimeMinutes,
                ordinal: sprintOrdinal,
              })
              .returning();

            if (!insertedSprint) throw new Error("Failed to create sprint");

            await db
              .insert(Schema.taskRuns)
              .values(
                tasks.map((task, taskOrdinal) => ({
                  userId: user.id,
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
    },
  });
}

// FIXME: This is incredibly hacky.
export const useFocusSession = (
  sessionId: FocusSessionSelect["id"] | undefined,
) => {
  const { user } = useUser();

  const query = useQuery<RunnableSprint[] | null>({
    queryKey: ["session", sessionId],
    queryFn: async () => {
      if (!user) return null;
      if (!sessionId) return null;
      const db = await getClientDB();

      const sprints = await db
        .select()
        .from(Schema.sprints)
        .where(
          and(
            eq(Schema.sprints.sessionId, sessionId),
            eq(Schema.sprints.userId, user.id),
          ),
        )
        .orderBy(asc(Schema.sprints.ordinal));

      if (!sprints) return null;

      return Promise.all(
        sprints.map(async (sprint) => {
          const tasksResult = await db
            .select()
            .from(Schema.taskRuns)
            .where(
              and(
                eq(Schema.taskRuns.sprintId, sprint.id),
                eq(Schema.taskRuns.userId, user.id),
              ),
            )
            .innerJoin(
              Schema.tasks,
              and(
                eq(Schema.taskRuns.taskId, Schema.tasks.id),
                eq(Schema.tasks.userId, user.id),
              ),
            );

          const tasks = await Promise.all(
            tasksResult.map<Promise<RunnableTask>>(
              async ({ tasks, task_runs }) => {
                if (!tasks.parentId)
                  return {
                    runId: task_runs.id,
                    status: task_runs.status,
                    ...tasks,
                  };

                const [parent] = await db
                  .select()
                  .from(Schema.tasks)
                  .where(
                    and(
                      eq(Schema.tasks.userId, user.id),
                      eq(Schema.tasks.id, tasks.parentId),
                    ),
                  );

                if (!parent) throw new Error("Failed to get parent task");

                return {
                  runId: task_runs.id,
                  status: task_runs.status,
                  ...tasks,
                  parent,
                };
              },
            ),
          );

          return {
            ...sprint,
            duration: {
              minutes: sprint.duration,
            },
            recoveryTime: sprint.recoveryTime
              ? {
                  minutes: sprint.recoveryTime,
                }
              : undefined,
            scheduledStart: sprint.scheduledStart ?? undefined,
            tasks,
          } satisfies RunnableSprint;
        }),
      );
    },
    placeholderData: keepPreviousData,
  });

  const markSprintAsStarted = async (sprintId: RunnableSprint["id"]) => {
    if (!user) throw new Error("User not found");
    const db = await getClientDB();
    await db
      .update(Schema.sprints)
      .set({ startedAt: sql`NOW()` })
      .where(
        and(
          eq(Schema.sprints.id, sprintId),
          eq(Schema.sprints.userId, user.id),
        ),
      );
  };

  const markSprintAsEnded = async (sprintId: RunnableSprint["id"]) => {
    if (!user) throw new Error("User not found");
    const db = await getClientDB();
    await db
      .update(Schema.sprints)
      .set({ endedAt: sql`NOW()` })
      .where(
        and(
          eq(Schema.sprints.id, sprintId),
          eq(Schema.sprints.userId, user.id),
        ),
      );
  };

  const updateTaskRunStatus = async ({
    runId,
    status,
  }: Pick<RunnableTask, "runId" | "status">) => {
    if (!user) throw new Error("User not found");
    const db = await getClientDB();
    await db
      .update(Schema.taskRuns)
      .set({ status })
      .where(
        and(eq(Schema.taskRuns.id, runId), eq(Schema.taskRuns.userId, user.id)),
      );
    void query.refetch();
  };

  return {
    runnableSprints: query,
    updateTaskRunStatus,
    markSprintAsStarted,
    markSprintAsEnded,
  };
};
