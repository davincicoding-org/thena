import { useCallback, useEffect, useMemo, useState } from "react";

import { SprintPlan, SprintStatus, TaskRun, WithRun } from "@/core/deep-work";
import { hasSubtasks, TaskReference } from "@/core/task-management";

interface SprintRun {
  duration: number;
  timeElapsed: number;
  status: SprintStatus;
  tasks: TaskRun[];
  currentTask?: TaskReference;
  start: () => void;
  pause: () => void;
  resume: () => void;
  completeTask: (task: TaskReference) => void;
  skipTask: (task: TaskReference) => void;
  runTaskManually: (task: TaskReference) => void;
}

export interface SprintHookOptions {
  onStart?: () => void;
  onPause?: () => void;
  onResume?: () => void;
}

export function useSprint(
  plan: SprintPlan,
  options: SprintHookOptions,
): SprintRun {
  const [status, setStatus] = useState<SprintStatus>("idle");
  const [taskRuns, setTaskRuns] = useState<WithRun<TaskReference>[]>([]);
  const [currentTask, setCurrentTask] = useState<TaskReference>();
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    setStatus("idle");
    setCurrentTask(undefined);
    setTaskRuns(
      plan.tasks.flatMap((task) => {
        if (hasSubtasks(task)) {
          return task.subtasks.map((subtask) => ({
            taskId: task.id,
            subtaskId: subtask.id,
          }));
        }
        return [
          {
            taskId: task.id,
          },
        ];
      }),
    );
    setTimeElapsed(0);
  }, [plan.id]);

  useEffect(() => {
    if (status !== "running") return;
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 0.1);
    }, 100);
    return () => clearInterval(timer);
  }, [status]);

  const tasks = useMemo((): SprintRun["tasks"] => {
    return plan.tasks.map((task) => {
      const taskRun = taskRuns.find(
        (run) => run.taskId === task.id && run.subtaskId === undefined,
      );

      if (!hasSubtasks(task))
        return {
          ...task,
          ...taskRun,
        };

      return {
        ...task,
        ...taskRun,
        subtasks: task.subtasks.map((subtask) => {
          const subtaskRun = taskRuns.find(
            (run) => run.taskId === task.id && run.subtaskId === subtask.id,
          );
          return {
            ...subtask,
            ...subtaskRun,
          };
        }),
      };
    });
  }, [taskRuns, plan.tasks]);

  const start = useCallback<SprintRun["start"]>(() => {
    const [firstTask] = taskRuns;
    if (!firstTask) return;
    setStatus("running");
    options.onStart?.();
    setCurrentTask({
      taskId: firstTask.taskId,
      subtaskId: firstTask.subtaskId,
    });
  }, [options.onStart, taskRuns]);

  const pause = useCallback<SprintRun["pause"]>(() => {
    setStatus("paused");
    options.onPause?.();
  }, [options.onPause]);

  const resume = useCallback<SprintRun["resume"]>(() => {
    setStatus("running");
    options.onResume?.();
  }, [options.onResume]);

  const completeTask = useCallback<SprintRun["completeTask"]>(
    ({ taskId, subtaskId }) =>
      setTaskRuns((prev) => {
        const taskRunIndex = prev.findIndex(
          (run) => run.taskId === taskId && run.subtaskId === subtaskId,
        );

        const nextTask = prev.find((run, index) => {
          if (index <= taskRunIndex) return false;
          if (run.completedAt) return false;
          if (run.skipped) return false;
          return true;
        });

        if (nextTask) {
          setCurrentTask(nextTask);
        } else {
          setCurrentTask(undefined);
          setStatus("completed");
        }

        return prev.map((run, index) =>
          index === taskRunIndex ? { ...run, completedAt: Date.now() } : run,
        );
      }),
    [timeElapsed],
  );

  const skipTask = useCallback<SprintRun["skipTask"]>(
    ({ taskId, subtaskId }) =>
      setTaskRuns((prev) => {
        const taskRunIndex = prev.findIndex(
          (run) => run.taskId === taskId && run.subtaskId === subtaskId,
        );

        const nextTask = prev.find((run, index) => {
          if (index <= taskRunIndex) return false;
          if (run.completedAt) return false;
          if (run.skipped) return false;
          return true;
        });

        if (nextTask) {
          setCurrentTask(nextTask);
        } else {
          setCurrentTask(undefined);
          setStatus("completed");
        }

        return prev.map((run, index) =>
          index === taskRunIndex ? { ...run, skipped: true } : run,
        );
      }),
    [timeElapsed],
  );

  const runTaskManually = useCallback<SprintRun["runTaskManually"]>(
    ({ taskId, subtaskId }) => {
      setTaskRuns((prev) => {
        const taskIndex = prev.findIndex(
          (run) => run.taskId === taskId && run.subtaskId === subtaskId,
        );

        return prev.map((run, index) => {
          if (index > taskIndex) return run;
          if (index === taskIndex) {
            return {
              ...run,
              skipped: undefined,
            };
          }

          if (run.completedAt) return run;

          return {
            ...run,
            skipped: true,
          };
        });
      });

      setCurrentTask({ taskId, subtaskId });
    },
    [],
  );

  return {
    status,
    duration: plan.duration,
    timeElapsed,
    tasks,
    currentTask,
    start,
    pause,
    resume,
    completeTask,
    skipTask,
    runTaskManually,
  };
}
