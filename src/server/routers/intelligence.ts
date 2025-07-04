import { and, count, eq } from "drizzle-orm";

import { taskRuns } from "@/database/schema";

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

    // const completedSprints = await db.query.sprints.findMany({
    //   where: (sprints, { eq, and, isNotNull }) =>
    //     and(eq(sprints.userId, auth.userId), isNotNull(sprints.endedAt)),
    // });

    // const sprintSummaries = completedSprints.map((sprint) => {
    //   const completed = sprint.completedTasks ?? 0;
    //   const skipped = sprint.skippedTasks ?? 0;
    //   const total = completed + skipped;

    //   return {
    //     id: sprint.id,
    //     duration: sprint.duration ?? 0,
    //     completedTasks: completed,
    //     skippedTasks: skipped,
    //     completionRate: total > 0 ? completed / total : 0,
    //   };
    // });

    // const completedTasks = sprintSummaries.reduce((acc, sprint) => {
    //   return acc + sprint.completedTasks;
    // }, 0);

    // const skippedTasks = sprintSummaries.reduce((acc, sprint) => {
    //   return acc + sprint.skippedTasks;
    // }, 0);

    // const totalTasks = completedTasks + skippedTasks;

    // const completionRate = totalTasks > 0 ? completedTasks / totalTasks : 0;

    // return {
    //   completedTasks,
    //   completedSprints: sprintSummaries,
    //   focusTime: completedSprints.reduce((acc, sprint) => {
    //     return acc + (sprint.focusTime ?? 0);
    //   }, 0),
    //   completionRate,
    // };
  }),
});
