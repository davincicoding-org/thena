import { useMemo, useState } from "react";

import type {
  RunnableSprint,
  SessionBreakSlot,
  SprintPlan,
  SprintRunSlot,
  WithRunMetrics,
} from "@/core/deep-work";
import type { Task, TaskReference } from "@/core/task-management";
import { resolveTaskReferencesFlat } from "@/core/task-management";

export interface SprintsRunnerHookOptions {
  plans: SprintPlan[];
  tasks: Task[];
  onFinish?: () => void;
}

export interface SprintsRunnerHookReturn {
  status: "idle" | "sprint-run" | "break" | "finished";
  slots: (SprintRunSlot | SessionBreakSlot)[];
  activeSprint: RunnableSprint | undefined;
  upcomingSprints: RunnableSprint[];
  startSprint: () => void;
  completeTask: (task: TaskReference) => void;
  skipTask: (task: TaskReference) => void;
  jumpToTask: (task: TaskReference, skippedTasks?: TaskReference[]) => void;
  finishSprint: () => void;
  finishBreak: () => void;
}

type TaskRunKey = `${TaskReference["taskId"]}--${TaskReference["subtaskId"]}`;
const taskRunKey = (task: TaskReference): TaskRunKey =>
  `${task.taskId}--${task.subtaskId}`;

export function useSprintsRunner({
  plans,
  tasks,
  onFinish,
}: SprintsRunnerHookOptions): SprintsRunnerHookReturn {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] =
    useState<SprintsRunnerHookReturn["status"]>("idle");

  const [taskRuns, setTaskRuns] = useState<
    Record<string, WithRunMetrics<Record<never, never>>>
  >({});

  const sprints = useMemo(() => {
    return plans.map((plan) => ({
      ...plan,
      tasks: resolveTaskReferencesFlat(plan.tasks, tasks).map((task) => ({
        ...task,
        ...taskRuns[taskRunKey(task)],
      })),
    }));
  }, [plans, tasks, taskRuns]);

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
      [taskRunKey(task)]: {
        ...prev[taskRunKey(task)],
        completedAt: Date.now(),
      },
    }));
  };

  const skipTask: SprintsRunnerHookReturn["skipTask"] = (task) => {
    setTaskRuns((prev) => ({
      ...prev,
      [taskRunKey(task)]: {
        ...prev[taskRunKey(task)],
        skipped: true,
      },
    }));
  };

  const jumpToTask: SprintsRunnerHookReturn["jumpToTask"] = (
    task,
    skippedTasks = [],
  ) => {
    const targetTaskRunKey = taskRunKey(task);
    const skippedTaskRunKeys = skippedTasks.map((skippedTask) =>
      taskRunKey(skippedTask),
    );

    setTaskRuns((prev) => {
      const skipped = skippedTaskRunKeys.reduce<typeof prev>(
        (acc, taskToSkip) => ({
          ...acc,
          [taskToSkip]: {
            ...prev[taskToSkip],
            skipped: true,
          },
        }),
        {
          [targetTaskRunKey]: {
            ...prev[targetTaskRunKey],
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
