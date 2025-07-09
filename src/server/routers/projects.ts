import path from "path";
import { put } from "@vercel/blob";
import { and, desc, eq } from "drizzle-orm";

import {
  projectInputSchema,
  projectSelectSchema,
  projectUpdateSchema,
} from "@/core/task-management";
import { projects } from "@/database/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const projectsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(projectInputSchema)
    .mutation(async ({ ctx: { db, auth }, input }) => {
      const { image: possiblyRawImage, ...project } = input;

      const image = await (async () => {
        if (!possiblyRawImage) return null;
        if (typeof possiblyRawImage === "string") return possiblyRawImage;

        const { contentType, base64 } = possiblyRawImage;

        const byteCharacters = atob(base64);
        const byteArrays = [];

        for (let i = 0; i < byteCharacters.length; i++) {
          byteArrays.push(byteCharacters.charCodeAt(i));
        }

        const byteArray = new Uint8Array(byteArrays);
        const imageBlob = new Blob([byteArray], { type: contentType });

        const fileName = `${Date.now()}.${contentType.split("/")[1]}`;
        const storagePath = path.join(auth.userId, "projects", fileName);

        const result = await put(storagePath, imageBlob, {
          access: "public",
        });

        return result.url;
      })();

      const [result] = await db
        .insert(projects)
        .values({
          ...project,
          image,
          userId: auth.userId,
        })
        .returning();

      if (!result) throw new Error("Failed to create project");

      return result;
    }),

  update: protectedProcedure
    .input(
      projectSelectSchema.pick({ id: true }).extend({
        updates: projectUpdateSchema,
      }),
    )
    .mutation(async ({ ctx: { db, auth }, input }) => {
      const [result] = await db
        .update(projects)
        .set(input.updates)
        .where(and(eq(projects.id, input.id), eq(projects.userId, auth.userId)))
        .returning();
      return result;
    }),
  delete: protectedProcedure
    .input(projectSelectSchema.pick({ id: true }))
    .mutation(async ({ ctx: { db, auth }, input }) => {
      const [result] = await db
        .delete(projects)
        .where(and(eq(projects.id, input.id), eq(projects.userId, auth.userId)))
        .returning();
      return result;
    }),
  list: protectedProcedure.query(async ({ ctx: { db, auth } }) => {
    const result = await db.query.projects.findMany({
      where: eq(projects.userId, auth.userId),
      orderBy: desc(projects.updatedAt),
    });
    return result;
  }),
  summary: protectedProcedure
    .input(projectSelectSchema.shape.id.nullable())
    .query(async ({ ctx: { db, auth }, input: projectId }) => {
      if (!projectId) return undefined;

      const projectTasks = await db.query.tasks.findMany({
        where: (t, { eq, and }) =>
          and(eq(t.projectId, projectId), eq(t.userId, auth.userId)),
        with: {
          subtasks: {
            columns: {
              id: true,
              status: true,
            },
          },
        },
        columns: {
          id: true,
          status: true,
        },
      });

      const todosCount = projectTasks.reduce((acc, task) => {
        if (task.subtasks.length > 0)
          return (
            acc +
            task.subtasks.filter((subtask) => subtask.status === "todo").length
          );
        if (task.status === "todo") return acc + 1;
        return acc;
      }, 0);

      const completedTasks = projectTasks.flatMap((task) => {
        if (task.subtasks.length > 0)
          return task.subtasks
            .filter((subtask) => subtask.status === "completed")
            .map((subtask) => subtask.id);
        if (task.status === "completed") return [task.id];
        return [];
      });

      const completedTaksRuns = await db.query.taskRuns.findMany({
        where: (tr, { inArray }) => inArray(tr.taskId, completedTasks),
        columns: {
          duration: true,
        },
      });

      const totalFocusTime = completedTaksRuns.reduce(
        (acc, run) => acc + (run.duration ?? 0),
        0,
      );

      return {
        todosCount,
        completedCount: completedTasks.length,
        totalFocusMinutes: totalFocusTime / 60,
      };
    }),
});
