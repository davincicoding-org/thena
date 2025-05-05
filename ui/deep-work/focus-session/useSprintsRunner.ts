import { useMemo, useState } from "react";

import type {
  RunnableSprint,
  SessionBreakSlot,
  SprintPlan,
  SprintRunSlot,
  WithRunMetrics,
} from "@/core/deep-work";
import type { FlatTask, TaskId } from "@/core/task-management";

export interface SprintsRunnerHookOptions {
  plans: SprintPlan[];
  tasks: FlatTask[];
  onFinish?: () => void;
}

export interface SprintsRunnerHookReturn {
  status: "idle" | "sprint-run" | "break" | "finished";
  slots: (SprintRunSlot | SessionBreakSlot)[];
  activeSprint: RunnableSprint | undefined;
  upcomingSprints: RunnableSprint[];
  startSprint: () => void;
  completeTask: (task: TaskId) => void;
  skipTask: (task: TaskId) => void;
  jumpToTask: (task: TaskId, skippedTasks?: TaskId[]) => void;
  finishSprint: () => void;
  finishBreak: () => void;
}

export function useSprintsRunner({
  plans,
  tasks,
  onFinish,
}: SprintsRunnerHookOptions): SprintsRunnerHookReturn {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] =
    useState<SprintsRunnerHookReturn["status"]>("idle");

  const [taskRuns, setTaskRuns] = useState<
    Record<TaskId, WithRunMetrics<Record<never, never>>>
  >({});

  const sprints = useMemo(
    () =>
      plans.map((plan) => ({
        ...plan,
        tasks: plan.tasks.reduce<RunnableSprint["tasks"]>((acc, task) => {
          const flatTask = tasks.find((t) => t.uid === task);
          if (!flatTask) return acc;

          return [
            ...acc,
            {
              ...flatTask,
              ...taskRuns[task],
            },
          ];
        }, []),
      })),
    [plans, taskRuns, tasks],
  );

  const slots = useMemo(() => {
    return sprints.reduce<SprintsRunnerHookReturn["slots"]>((acc, sprint) => {
      const sprintRunSlot: SprintRunSlot = {
        type: "sprint-run",
        sprint,
      };

      if (acc.length === 0) return [sprintRunSlot];

      const breakSlot: SessionBreakSlot = {
        type: "break",
        duration: { minutes: 1 },
        nextSprint: sprintRunSlot.sprint.id,
      };

      return [...acc, breakSlot, sprintRunSlot];
    }, []);
  }, [sprints]);

  const completeTask: SprintsRunnerHookReturn["completeTask"] = (task) => {
    setTaskRuns((prev) => ({
      ...prev,
      [task]: {
        ...prev[task],
        completedAt: Date.now(),
      },
    }));
  };

  const skipTask: SprintsRunnerHookReturn["skipTask"] = (task) => {
    setTaskRuns((prev) => ({
      ...prev,
      [task]: {
        ...prev[task],
        skipped: true,
      },
    }));
  };

  const jumpToTask: SprintsRunnerHookReturn["jumpToTask"] = (
    task,
    skippedTasks = [],
  ) => {
    setTaskRuns((prev) => {
      const skipped = skippedTasks.reduce<typeof prev>(
        (acc, taskToSkip) => ({
          ...acc,
          [taskToSkip]: {
            ...prev[taskToSkip],
            skipped: true,
          },
        }),
        {
          [task]: {
            ...prev[task],
            skipped: false,
          },
        },
      );

      return {
        ...prev,
        ...skipped,
      };
    });
  };

  return {
    slots,
    status,
    activeSprint: sprints[currentIndex],
    upcomingSprints: sprints.slice(currentIndex + 1),
    startSprint: () => {
      setStatus("sprint-run");
    },
    finishSprint: () => {
      if (currentIndex === sprints.length - 1) {
        setStatus("finished");
        setCurrentIndex(currentIndex + 1);
        onFinish?.();
      } else {
        setCurrentIndex(currentIndex + 1);
        setStatus("break");
      }
    },
    finishBreak: () => {
      setStatus("idle");
    },
    completeTask,
    skipTask,
    jumpToTask,
  };
}
