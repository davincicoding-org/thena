import dayjs from "dayjs";
import { and, eq } from "drizzle-orm";

import { tasks } from "@/db/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const intelligenceRouter = createTRPCRouter({
  summary: protectedProcedure.query(async ({ ctx: { db, auth } }) => {
    const completedTasks = await db.$count(
      tasks,
      and(eq(tasks.userId, auth.userId), eq(tasks.status, "completed")),
    );

    const sprints = await db.query.sprints.findMany({
      where: (sprints, { eq }) => eq(sprints.userId, auth.userId),
    });

    // FIXME: This is wrong, since a session might be aborted
    const focusTimePerSprint = sprints.reduce<number[]>((acc, sprint) => {
      if (!sprint.endedAt || !sprint.startedAt) return acc;

      const startedAt = dayjs(sprint.startedAt);
      const endedAt = dayjs(sprint.endedAt);

      const duration = endedAt.diff(startedAt, "minutes");

      return [...acc, duration];
    }, []);

    return {
      completedTasks,
      completedSprints: focusTimePerSprint.length,
      focusMinutes: focusTimePerSprint.reduce((acc, sprintDuration) => {
        return acc + sprintDuration;
      }, 0),
    };
  }),
});
