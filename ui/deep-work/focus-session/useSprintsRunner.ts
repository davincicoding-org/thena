import { useMemo, useState } from "react";

import type {
  RunnableSprint,
  SessionBreakSlot,
  SprintRunSlot,
  TaskRun,
} from "@/core/deep-work";
import type { TaskId } from "@/core/task-management";

export interface SprintsRunnerHookOptions {
  sprints: RunnableSprint[];
  onFinish?: () => void;
  onUpdateTaskRun: (
    taskId: TaskRun["runId"],
    status: TaskRun["status"],
  ) => void;
}

export interface SprintsRunnerHookReturn {
  status: "idle" | "sprint-run" | "break" | "finished";
  slots: (SprintRunSlot | SessionBreakSlot)[];
  activeSprint: RunnableSprint | undefined;
  upcomingSprints: RunnableSprint[];
  startSprint: () => void;
  completeTask: (task: TaskId) => void;
  skipTask: (task: TaskId) => void;
  unskipTask: (task: TaskId) => void;
  finishSprint: () => void;
  finishBreak: () => void;
}

export function useSprintsRunner({
  sprints,
  onFinish,
  onUpdateTaskRun,
}: SprintsRunnerHookOptions): SprintsRunnerHookReturn {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] =
    useState<SprintsRunnerHookReturn["status"]>("idle");

  // const [taskRuns, setTaskRuns] = useState<
  //   Record<TaskRun["runId"], TaskRun["status"]>
  // >({});

  // const populatedSprints = useMemo(
  //   () =>
  //     sprints.map((sprint) => ({
  //       ...sprint,
  //       tasks: sprint.tasks.map((task) => ({
  //         ...task,
  //         status: taskRuns[task.runId] ?? task.status,
  //       })),
  //     })),
  //   [sprints, taskRuns],
  // );

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
    // setTaskRuns((prev) => ({
    //   ...prev,
    //   [task]: "completed",
    // }));
    onUpdateTaskRun(task, "completed");
  };

  const skipTask: SprintsRunnerHookReturn["skipTask"] = (task) => {
    // setTaskRuns((prev) => ({
    //   ...prev,
    //   [task]: "skipped",
    // }));
    onUpdateTaskRun(task, "skipped");
  };

  const unskipTask: SprintsRunnerHookReturn["unskipTask"] = (task) => {
    // setTaskRuns((prev) => ({
    //   ...prev,
    //   [task]: "pending",
    // }));
    onUpdateTaskRun(task, "pending");
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
    unskipTask,
  };
}
