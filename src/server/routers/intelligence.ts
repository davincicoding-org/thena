import { createTRPCRouter, protectedProcedure } from "../trpc";

export const intelligenceRouter = createTRPCRouter({
  summary: protectedProcedure.query(async ({ ctx: { db, auth } }) => {
    const completedTaskRuns = await db.query.taskRuns.findMany({
      where: (taskRuns, { eq, and }) =>
        and(eq(taskRuns.userId, auth.userId), eq(taskRuns.status, "completed")),
    });

    const completedSessions = await db.query.focusSessions.findMany({
      where: (focusSessions, { eq, and }) =>
        and(
          eq(focusSessions.userId, auth.userId),
          eq(focusSessions.status, "completed"),
        ),
    });
    return {
      completedTasks: completedTaskRuns.length,
      completedSessions: completedSessions,
      focusMinutes:
        completedTaskRuns.reduce(
          (acc, { duration = 0 }) => acc + (duration ?? 0),
          0,
        ) / 60,
    };
  }),
});
