import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useWindowEvent } from "@mantine/hooks";

import type { FocusSessionInterruption } from "@/core/deep-work";
import type { TaskId, TaskTree } from "@/core/task-management";
import { flattenTasks } from "@/core/task-management";
import { api } from "@/trpc/react";

import type {
  ActiveFocusSession,
  FocusSessionConfig,
  FocusSessionSummary,
  TaskQueueItem,
} from "./types";
import { useStopWatch } from "./useStopWatch";

export function useActiveFocusSession({
  todos,
  onTaskCompleted,
  onRanOutOfTasks,
}: {
  todos: TaskTree[];
  onTaskCompleted: (taskId: TaskId) => void;
  onRanOutOfTasks: () => void;
}) {
  const { userId } = useAuth();
  const {
    data: sessionId,
    mutateAsync: openSession,
    reset: resetSession,
  } = api.focusSessions.open.useMutation();

  const { mutate: closeSession } = api.focusSessions.close.useMutation();

  const {
    data: currentTaskRun,
    mutate: openTaskRun,
    reset: resetTaskRun,
  } = api.taskRuns.open.useMutation();

  const { mutateAsync: closeTaskRun } = api.taskRuns.close.useMutation();

  useWindowEvent("beforeunload", (e) => {
    const shouldWarn = !!sessionId || !!currentTaskRun;
    if (!shouldWarn) return;

    e.preventDefault();
    e.returnValue = "";
  });

  // TODO when quitting the browser,the beacon is not sent
  useWindowEvent("pagehide", (e) => {
    if (e.persisted) return;
    if (!sessionId && !currentTaskRun) return;
    if (!userId) return;

    const url = "/api/focus-session-interruption";
    const data: FocusSessionInterruption = {
      taskRunId: currentTaskRun?.id ?? null,
      focusSessionId: sessionId ?? null,
      userId,
      timestamp: Date.now(),
    };
    navigator.sendBeacon(
      url,
      new Blob([JSON.stringify(data)], { type: "application/json" }),
    );
  });

  const [queue, setQueue] = useState<TaskQueueItem[]>([]);
  const stopwatch = useStopWatch();

  const session: ActiveFocusSession | null = sessionId
    ? {
        timeElapsed: stopwatch.timeElapsed,
        queue,
        currentTaskId: currentTaskRun?.taskId,
        duration: stopwatch.totalTime,
      }
    : null;

  const create = async (config: FocusSessionConfig) => {
    const initialQueue = flattenTasks(todos);
    const [firstTask] = initialQueue;
    if (!firstTask) throw new Error("No tasks to create session for");

    const sessionId = await openSession(config);
    openTaskRun({
      taskId: firstTask.id,
      focusSessionId: sessionId,
    });

    setQueue(initialQueue);
    stopwatch.start(config.plannedDuration);
  };

  const activateNextTask = (previousTaskId: TaskId) => {
    const remainingQueue = queue.filter(({ id }) => id !== previousTaskId);
    const pristineTasks = remainingQueue.filter(
      ({ status, skipped }) => status === "todo" && !skipped,
    );
    if (pristineTasks.length === 0) return onRanOutOfTasks();
    const nextTask = pristineTasks.find(({ skipped }) => !skipped);
    if (!nextTask) return;

    if (!sessionId) throw new Error("No session id");

    openTaskRun({
      taskId: nextTask.id,
      focusSessionId: sessionId,
    });
  };

  const completeTask = (taskId: TaskId) => {
    if (!currentTaskRun) throw new Error("No task run to complete");
    const taskRunId = currentTaskRun.id;

    if (currentTaskRun.taskId !== taskId)
      throw new Error("Task run does not match");

    void closeTaskRun({
      id: taskRunId,
      status: "completed",
    });

    void onTaskCompleted(taskId);

    setQueue((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;
        return {
          ...task,
          status: "completed",
        };
      }),
    );
    resetTaskRun();

    void activateNextTask(taskId);
  };

  const skipTask = (taskId: TaskId) => {
    if (!currentTaskRun) throw new Error("No task run to skip");
    const taskRunId = currentTaskRun.id;
    if (currentTaskRun.taskId !== taskId)
      throw new Error("Task run does not match");

    void closeTaskRun({
      id: taskRunId,
      status: "skipped",
    });
    resetTaskRun();

    setQueue((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;
        return {
          ...task,
          skipped: true,
        };
      }),
    );
    void activateNextTask(taskId);
  };

  const unskipTask = (taskId: TaskId) => {
    if (!sessionId) throw new Error("No session id");

    if (currentTaskRun) {
      void closeTaskRun({
        id: currentTaskRun.id,
        status: "cancelled",
      });
      resetTaskRun();
    }
    setQueue((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;
        return {
          ...task,
          skipped: false,
        };
      }),
    );
    openTaskRun({
      taskId,
      focusSessionId: sessionId,
      status: "resumed",
    });
  };

  const finish = (): FocusSessionSummary => {
    if (!sessionId) throw new Error("No session id");
    void closeSession({ id: sessionId, status: "completed" });
    resetSession();
    if (currentTaskRun) {
      void closeTaskRun({
        id: currentTaskRun.id,
        status: "cancelled",
      });
      resetTaskRun();
    }
    stopwatch.reset();

    return {
      id: sessionId,
      tasks: queue.filter(({ status }) => status === "completed"),
    };
  };

  return {
    session,
    create,
    completeTask,
    skipTask,
    unskipTask,
    finish,
  };
}
