import { useMemo, useState } from "react";

import type { Task } from "@/core/task-management";
import type { ActionSideEffect } from "@/ui/hooks/useHistory";

export interface MinimalTaskListHookOptions {
  initialTasks?: Task["id"][];
}

export interface MinimalTaskListHookReturn {
  taskIds: Task["id"][];
  setTaskIds: (taskIds: Task["id"][]) => void;

  tasks: Task[];

  // Adds a task to the list with a unique id
  addTask: (task: Task["id"], sideEffect?: ActionSideEffect) => void;
  // Adds multiple tasks to the list with unique ids
  addTasks: (tasks: Task["id"][], sideEffect?: ActionSideEffect) => void;
  // Removes a task from the list
  removeTask: (taskId: Task["id"], sideEffect?: ActionSideEffect) => void;
  // Removes multiple tasks from the list
  removeTasks: (taskIds: Task["id"][], sideEffect?: ActionSideEffect) => void;
}

export function useMinimalTaskList(
  taskPool: Task[],
  options: MinimalTaskListHookOptions = {},
): MinimalTaskListHookReturn {
  // TODO tasks ids need to be revalidated when taskPool shrinks
  const [taskIds, setTaskIds] = useState<MinimalTaskListHookReturn["taskIds"]>(
    options.initialTasks ?? [],
  );

  const tasks = useMemo(
    () =>
      taskIds.reduce<MinimalTaskListHookReturn["tasks"]>((acc, id) => {
        const task = taskPool.find((task) => task.id === id);
        if (!task) return acc;
        return [...acc, task];
      }, []),
    [taskPool, taskIds],
  );

  return {
    taskIds,
    setTaskIds,
    tasks,
    addTask: (taskId) => setTaskIds([...taskIds, taskId]),
    addTasks: (taskIds) => setTaskIds([...taskIds, ...taskIds]),
    removeTask: (taskId) => setTaskIds(taskIds.filter((id) => id !== taskId)),
    removeTasks: (taskIds) =>
      setTaskIds(taskIds.filter((id) => !taskIds.includes(id))),
  };
}
