import { and, eq } from "drizzle-orm";

import {
  focusSessionBreakInsert,
  focusSessionBreakSelect,
} from "@/core/deep-work/db";
import { focusSessionBreaks } from "@/database/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const focusSessionBreaksRouter = createTRPCRouter({
  start: protectedProcedure
    .input(
      focusSessionBreakInsert.pick({
        plannedDuration: true,
      }),
    )
    .mutation(async ({ ctx: { db, auth }, input }) => {
      const [session] = await db
        .insert(focusSessionBreaks)
        .values({
          userId: auth.userId,
          ...input,
        })
        .returning();

      if (!session) throw new Error("Failed to create session");

      return session.id;
    }),

  skip: protectedProcedure.mutation(async ({ ctx: { db, auth } }) => {
    return await db.insert(focusSessionBreaks).values({
      userId: auth.userId,
      status: "skipped",
      plannedDuration: 0,
    });
  }),

  stop: protectedProcedure
    .input(focusSessionBreakSelect.pick({ id: true }))
    .mutation(async ({ ctx: { db, auth }, input }) => {
      return await db
        .update(focusSessionBreaks)
        .set({ status: "completed", endedAt: new Date() })
        .where(
          and(
            eq(focusSessionBreaks.id, input.id),
            eq(focusSessionBreaks.userId, auth.userId),
          ),
        );
    }),
});
