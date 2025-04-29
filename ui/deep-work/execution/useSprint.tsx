import { useEffect, useState } from "react";

import type {
  PopulatedSprintPlan,
  RuntITem$$$,
  SprintStatus,
  WithRun,
} from "@/core/deep-work";
import type { TaskReference } from "@/core/task-management";

interface SprintRun {
  duration: number;
  timeElapsed: number;
  status: SprintStatus;
  tasks: RuntITem$$$[];
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
  onComplete?: () => void;
}

export function useSprint(
  plan: PopulatedSprintPlan | undefined,
  options: SprintHookOptions,
): SprintRun | undefined {
  const [status, setStatus] = useState<SprintStatus>("idle");
  const [taskRuns, setTaskRuns] = useState<WithRun<TaskReference>[]>([]);
  const [currentTask, setCurrentTask] = useState<TaskReference>();
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    if (!plan) return;
    setStatus("idle");
    setCurrentTask(undefined);
    setTaskRuns(
      plan.tasks.map(({ taskId, subtaskId }) => ({ taskId, subtaskId })),
    );
    setTimeElapsed(0);
  }, [plan]);

  useEffect(() => {
    if (status !== "running") return;
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 0.1);
    }, 100);
    return () => clearInterval(timer);
  }, [status]);

  useEffect(() => {
    if (!plan) return;
    if (status !== "running") return;
    if (timeElapsed < plan.duration) return;
    setStatus("over");
  }, [timeElapsed, plan, status]);

  if (!plan) return undefined;

  const tasks = ((): SprintRun["tasks"] => {
    if (!plan) return [];
    return plan.tasks.map<RuntITem$$$>((item) => {
      const taskRun = taskRuns.find(
        (run) => run.taskId === item.taskId && run.subtaskId === item.subtaskId,
      );

      return {
        label: item.title,
        group: item.parentTitle,
        taskId: item.taskId,
        subtaskId: item.subtaskId,
        ...taskRun,
      };
    });
  })();

  const start: SprintRun["start"] = () => {
    const [firstTask] = taskRuns;
    if (!firstTask) return;
    setStatus("running");
    options.onStart?.();
    setCurrentTask({
      taskId: firstTask.taskId,
      subtaskId: firstTask.subtaskId,
    });
  };

  const pause: SprintRun["pause"] = () => {
    setStatus("paused");
    options.onPause?.();
  };

  const resume: SprintRun["resume"] = () => {
    setStatus("running");
    options.onResume?.();
  };

  const completeTask: SprintRun["completeTask"] = ({ taskId, subtaskId }) => {
    const taskRunIndex = taskRuns.findIndex(
      (run) => run.taskId === taskId && run.subtaskId === subtaskId,
    );

    const nextTask = taskRuns.find((run, index) => {
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
      options.onComplete?.();
    }

    setTaskRuns((prev) =>
      prev.map((run, index) =>
        index === taskRunIndex ? { ...run, completedAt: Date.now() } : run,
      ),
    );
  };

  const skipTask: SprintRun["skipTask"] = ({ taskId, subtaskId }) => {
    const taskRunIndex = taskRuns.findIndex(
      (run) => run.taskId === taskId && run.subtaskId === subtaskId,
    );

    const nextTask = taskRuns.find((run, index) => {
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
      options.onComplete?.();
    }

    setTaskRuns((prev) =>
      prev.map((run, index) =>
        index === taskRunIndex ? { ...run, skipped: true } : run,
      ),
    );
  };

  const runTaskManually: SprintRun["runTaskManually"] = ({
    taskId,
    subtaskId,
  }) => {
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
  };

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
