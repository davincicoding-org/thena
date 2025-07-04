import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { focusSessionInterruptionSchema } from "@/core/deep-work";
import { db } from "@/database";
import { focusSessions, taskRuns } from "@/database/schema";

export async function POST(req: NextRequest) {
  try {
    const result = focusSessionInterruptionSchema.safeParse(await req.json());

    if (!result.success) {
      return NextResponse.json(
        { status: "error", error: result.error.message },
        { status: 400 },
      );
    }

    console.log(result.data);

    const { taskRunId, focusSessionId, userId, timestamp } = result.data;

    if (focusSessionId !== null) {
      const focusSession = await db
        .update(focusSessions)
        .set({
          status: "cancelled",
          endedAt: new Date(timestamp),
        })
        .where(
          and(
            eq(focusSessions.id, focusSessionId),
            eq(focusSessions.userId, userId),
          ),
        );
      console.log(focusSession);
    }

    if (taskRunId !== null) {
      const taskRun = await db
        .update(taskRuns)
        .set({
          status: "cancelled",
          endedAt: new Date(timestamp),
        })
        .where(and(eq(taskRuns.id, taskRunId), eq(taskRuns.userId, userId)));
      console.log(taskRun);
    }

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("Failed to parse beacon data:", err);
    return NextResponse.json({ status: "error" }, { status: 400 });
  }
}
