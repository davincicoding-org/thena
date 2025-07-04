import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { focusSessionInterruptionSchema } from "@/core/deep-work";
import { db } from "@/database";
import { focusSessionBreaks, focusSessions, taskRuns } from "@/database/schema";

export async function POST(req: NextRequest) {
  try {
    const result = focusSessionInterruptionSchema.safeParse(await req.json());

    if (!result.success) {
      return NextResponse.json(
        { status: "error", error: result.error.message },
        { status: 400 },
      );
    }

    const { taskRunId, sessionId, breakId, userId, timestamp } = result.data;

    if (sessionId !== undefined) {
      await db
        .update(focusSessions)
        .set({
          status: "cancelled",
          endedAt: new Date(timestamp),
        })
        .where(
          and(
            eq(focusSessions.id, sessionId),
            eq(focusSessions.userId, userId),
          ),
        );
    }

    if (taskRunId !== undefined) {
      await db
        .update(taskRuns)
        .set({
          status: "cancelled",
          endedAt: new Date(timestamp),
        })
        .where(and(eq(taskRuns.id, taskRunId), eq(taskRuns.userId, userId)));
    }

    if (breakId !== undefined) {
      await db
        .update(focusSessionBreaks)
        .set({ status: "cancelled", endedAt: new Date(timestamp) })
        .where(
          and(
            eq(focusSessionBreaks.id, breakId),
            eq(focusSessionBreaks.userId, userId),
          ),
        );
    }
    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("Failed to parse beacon data:", err);
    return NextResponse.json({ status: "error" }, { status: 400 });
  }
}
