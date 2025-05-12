import path from "path";
import { put } from "@vercel/blob";
import { and, eq } from "drizzle-orm";

import {
  projectInputSchema,
  projectSelectSchema,
  projectUpdateSchema,
} from "@/core/task-management";
import { projects } from "@/db/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const projectsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(projectInputSchema)
    .mutation(async ({ ctx: { db, auth }, input }) => {
      const { imageFile, ...project } = input;

      const image = await (async () => {
        if (!imageFile) return null;

        const fileName = `${Date.now()}.${imageFile.name.split(".").pop()}`;
        const storagePath = path.join(auth.userId, "projects", fileName);

        const result = await put(storagePath, imageFile, {
          access: "public",
        });
        return result.downloadUrl;
      })();

      const [result] = await db
        .insert(projects)
        .values({
          ...project,
          image,
          userId: auth.userId,
        })
        .returning();

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
    });
    return result;
  }),
});
