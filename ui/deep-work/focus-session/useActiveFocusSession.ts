/* eslint-disable max-lines */
import { useEffect } from "react";
import { usePrevious, useWindowEvent } from "@mantine/hooks";
import { chunk } from "lodash-es";
import SuperJSON from "superjson";

import type { RunnableSprint, TaskRun } from "@/core/deep-work";
import type { TaskSelect } from "@/core/task-management";
import { api } from "@/trpc/react";
import { useActiveFocusSessionStorage } from "@/ui/deep-work/focus-session/useActiveFocusSessionStorage";

export const useActiveFocusSession = () => {
  // MARK: State

  const {
    session: storedSession,
    setSession,
    clearSession,
  } = useActiveFocusSessionStorage();

  const sprints = api.focusSessions.get.useQuery(storedSession?.id, {
    enabled: !!storedSession?.id,
  });

  // MARK: Interruption Handling

  const INTERRUPTION_KEY = "active-focus-session-interruption";

  const handleInterruption = () => {
    if (!storedSession?.currentTaskRunId) return;

    localStorage.setItem(
      INTERRUPTION_KEY,
      SuperJSON.stringify({
        runId: storedSession.currentTaskRunId,
        timestamp: new Date(),
      }),
    );
  };

  useWindowEvent("beforeunload", () => {
    handleInterruption();
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const interruption = localStorage.getItem(INTERRUPTION_KEY);
    if (!interruption) return;
    const { runId, timestamp } = SuperJSON.parse<{
      runId: TaskRun["runId"];
      timestamp: Date;
    }>(interruption);
    appendTaskRunTimestamp({ id: runId, timestamp });
    localStorage.removeItem(INTERRUPTION_KEY);
  }, []);

  // Add timestamp for current task run on interruption restoration

  const previousStatus = usePrevious(storedSession?.status);
  useEffect(() => {
    if (previousStatus) return;
    if (storedSession?.status !== "running") return;
    if (!storedSession?.currentTaskRunId) return;
    appendTaskRunTimestamp({ id: storedSession.currentTaskRunId });
  }, [storedSession?.status]);

  // MARK: Mutations
  const utils = api.useUtils();

  const { mutate: updateSprint } =
    api.focusSessions.sprint.update.useMutation();

  const { mutate: updateTaskRunStatus } =
    api.focusSessions.taskRun.update.useMutation({
      onMutate(variables) {
        const prevData = utils.focusSessions.get.getData(storedSession?.id);
        void utils.focusSessions.get.setData(storedSession?.id, (data) => {
          if (!data) return;
          return data.map((sprint) => ({
            ...sprint,
            tasks: sprint.tasks.map((task) => {
              if (task.runId !== variables.id) return task;
              return { ...task, ...variables };
            }),
          }));
        });
        return { prevData };
      },
      onSettled: (updatedTaskRun, error, variables, context) => {
        void utils.focusSessions.get.setData(storedSession?.id, (data) => {
          if (!updatedTaskRun) return context?.prevData;
          if (!data) return;
          return data.map((sprint) => ({
            ...sprint,
            tasks: sprint.tasks.map((task) => {
              if (task.runId !== updatedTaskRun.id) return task;
              return { ...task, ...updatedTaskRun };
            }),
          }));
        });
      },
    });

  const { mutate: appendTaskRunTimestamp } =
    api.focusSessions.taskRun.appendTimestamp.useMutation({
      onSuccess: (updatedTaskRun) => {
        if (!updatedTaskRun) return;
        void utils.focusSessions.get.setData(storedSession?.id, (data) => {
          if (!data) return;
          return data.map((sprint) => ({
            ...sprint,
            tasks: sprint.tasks.map((task) => {
              if (task.runId !== updatedTaskRun.id) return task;
              return { ...task, ...updatedTaskRun };
            }),
          }));
        });
      },
    });

  const { mutate: updateTaskStatus } =
    api.focusSessions.task.updateStatus.useMutation();

  // MARK: Helpers

  const getNextTaskRun = (sprintId: RunnableSprint["id"]) => {
    const sprint = sprints.data?.find((sprint) => sprint.id === sprintId);
    if (!sprint) throw new Error("Sprint not found");
    const currentTaskRunIndex = sprint.tasks.findIndex(
      (task) => task.runId === storedSession?.currentTaskRunId,
    );
    if (currentTaskRunIndex === -1)
      throw new Error("Current task run not found");
    return sprint.tasks.find(
      (task, index) => index > currentTaskRunIndex && task.status === "pending",
    );
  };

  const getNextSprint = (currentSprintId: RunnableSprint["id"]) => {
    const currentSprintIndex =
      sprints.data?.findIndex((sprint) => sprint.id === currentSprintId) ?? -1;
    if (currentSprintIndex === -1) throw new Error("Current sprint not found");
    return sprints.data?.[currentSprintIndex + 1];
  };

  const doesTaskRunExist = (
    sprintId: RunnableSprint["id"],
    runId: TaskRun["runId"],
  ) => {
    const sprint = sprints.data?.find((sprint) => sprint.id === sprintId);
    if (!sprint) throw new Error("Sprint not found");
    return sprint.tasks.some((task) => task.runId === runId);
  };

  // MARK: Action Handlers

  const startSprint = (sprintId: RunnableSprint["id"]) => {
    updateSprint({
      id: sprintId,
      updates: {
        startedAt: new Date(),
      },
    });
    const firstTaskRun = sprints.data?.find((sprint) => sprint.id === sprintId)
      ?.tasks[0];
    if (!firstTaskRun) throw new Error("No task runs found");
    setSession(
      (prev) =>
        prev && {
          ...prev,
          currentTaskRunId: firstTaskRun.runId,
          status: "running",
        },
    );
    appendTaskRunTimestamp({ id: firstTaskRun.runId });
  };

  const completeTask = (args: {
    sprintId: RunnableSprint["id"];
    runId: TaskRun["runId"];
    taskId: TaskSelect["id"];
  }) => {
    updateTaskRunStatus({
      id: args.runId,
      updates: {
        status: "completed",
      },
    });
    appendTaskRunTimestamp({ id: args.runId });
    updateTaskStatus({
      id: args.taskId,
      status: "completed",
    });

    const nextTaskRun = getNextTaskRun(args.sprintId);

    setSession(
      (prev) =>
        prev && {
          ...prev,
          currentTaskRunId: nextTaskRun?.runId,
        },
    );
    if (!nextTaskRun) return; // MAYBE: auto finish sprint if last task run
    appendTaskRunTimestamp({ id: nextTaskRun.runId });
  };
  const skipTask = (args: {
    sprintId: RunnableSprint["id"];
    runId: TaskRun["runId"];
  }) => {
    updateTaskRunStatus({
      id: args.runId,
      updates: {
        status: "skipped",
      },
    });
    appendTaskRunTimestamp({ id: args.runId });

    const nextTaskRun = getNextTaskRun(args.sprintId);

    setSession(
      (prev) =>
        prev && {
          ...prev,
          currentTaskRunId: nextTaskRun?.runId,
        },
    );
    if (!nextTaskRun) return; // MAYBE: auto finish sprint if last task run
    appendTaskRunTimestamp({ id: nextTaskRun.runId });
  };
  const unskipTask = (args: {
    sprintId: RunnableSprint["id"];
    runId: TaskRun["runId"];
  }) => {
    if (storedSession?.currentTaskRunId)
      appendTaskRunTimestamp({ id: storedSession.currentTaskRunId });

    if (!doesTaskRunExist(args.sprintId, args.runId))
      throw new Error("Task run not found");

    updateTaskRunStatus({
      id: args.runId,
      updates: {
        status: "pending",
      },
    });
    setSession(
      (prev) =>
        prev && {
          ...prev,
          currentTaskRunId: args.runId,
        },
    );
    appendTaskRunTimestamp({ id: args.runId });
  };

  const finishSprint = (sprintId: RunnableSprint["id"]) => {
    const sprint = sprints.data?.find((sprint) => sprint.id === sprintId);
    if (!sprint) throw new Error("Sprint not found");

    updateSprint({
      id: sprintId,
      updates: {
        endedAt: new Date(),
      },
    });

    const taskRunDurations = sprint.tasks.map(({ runId, timestamps = [] }) => {
      if (timestamps === null)
        throw new Error(`Task run has no timestamps recorded: ${runId}`);
      if (timestamps.length % 2 !== 0)
        throw new Error(`Task run has an odd number of timestamps: ${runId}`);

      const pairs = chunk(
        timestamps.sort((a, b) => a.getTime() - b.getTime()),
        2,
      );

      const duration = pairs.reduce((acc, [start, end]) => {
        if (!start || !end)
          throw new Error(`Task run has invalid timestamps: ${runId}`);
        return acc + (end.getTime() - start.getTime());
      }, 0);

      return {
        id: runId,
        duration,
      };
    });

    taskRunDurations.forEach(({ id, duration }) => {
      updateTaskRunStatus({
        id,
        updates: { duration },
      });
    });

    const totalDuration = taskRunDurations.reduce(
      (acc, { duration }) => acc + duration,
      0,
    );

    updateSprint({
      id: sprintId,
      updates: {
        focusTime: totalDuration,
        completedTasks: sprint.tasks.filter(
          (task) => task.status === "completed",
        ).length,
        skippedTasks: sprint.tasks.filter((task) => task.status === "skipped")
          .length,
      },
    });

    const nextSprint = getNextSprint(sprintId);
    if (nextSprint) {
      setSession(
        (prev) =>
          prev && {
            ...prev,
            currentSprintId: nextSprint.id,
            status: "break",
          },
      );
    } else {
      setSession(
        (prev) =>
          prev && {
            ...prev,
            status: "finished",
            currentSprintId: undefined,
            currentTaskRunId: undefined,
          },
      );
    }
  };

  const finishBreak = () => {
    setSession(
      (prev) =>
        prev && {
          ...prev,
          status: "idle",
        },
    );
  };

  const finishSession = (
    taskStatusUpdates: Record<TaskSelect["id"], TaskSelect["status"]>,
  ) => {
    Object.entries(taskStatusUpdates).forEach(([taskId, status]) => {
      updateTaskStatus({
        id: taskId,
        status,
      });
    });
    clearSession();
  };

  return {
    session: storedSession,
    sprints,
    startSprint,
    finishSprint,
    finishBreak,
    completeTask,
    skipTask,
    unskipTask,
    finishSession,
  };
};
