import { createTRPCRouter, protectedProcedure } from "../trpc";

export const intelligenceRouter = createTRPCRouter({
  summary: protectedProcedure.query(({ ctx: { db, auth } }) => {
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

    return {
      completedTasks: 0,
      completedSprints: [],
      focusTime: 0,
      completionRate: 0,
    };
  }),
});
