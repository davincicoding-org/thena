import type { TaskId, TaskSelect } from "@/core/task-management/db";

import type { AnyTask, FlatTask, Subtask, TaskFilters } from "./types";
import { isTaskTree } from "./types";

export const countTasks = (tasks: AnyTask[]): number =>
  tasks.reduce(
    (acc, task) => acc + (isTaskTree(task) ? task.subtasks.length : 1),
    0,
  );

export const flattenTask = (task: AnyTask): FlatTask[] => {
  if (!isTaskTree(task)) return [task];

  return task.subtasks.map<Subtask>((subtask) => ({
    parent: task,
    ...subtask,
  }));
};

export const flattenTasks = (tasks: AnyTask[]): FlatTask[] => {
  return tasks.flatMap<FlatTask>(flattenTask);
};

export const isTaskIncluded = <T extends Pick<TaskSelect, "uid">>(
  tasks: T[],
  taskIdToCheck: T["uid"],
): boolean => tasks.some((task) => task.uid === taskIdToCheck);

export const areTasksIncluded = <T extends Pick<TaskSelect, "uid">>(
  tasks: T[],
  taskIdsToFind: T["uid"][],
): boolean => taskIdsToFind.every((taskId) => isTaskIncluded(tasks, taskId));

export const excludeTasks = <T extends Pick<TaskSelect, "uid">>(
  tasks: T[],
  tasksToExclude: TaskId[],
): T[] => tasks.filter((task) => !tasksToExclude.includes(task.uid));

export const excludeTasksAndCompact = (
  tasks: AnyTask[],
  toExclude: TaskId[],
): AnyTask[] =>
  tasks.flatMap((task) => {
    if (toExclude.includes(task.uid)) return [];
    if (!isTaskTree(task)) return [task];
    const remainingSubtasks = task.subtasks.filter(
      (subtask) => !toExclude.includes(subtask.uid),
    );
    if (remainingSubtasks.length === 0) return [];
    if (remainingSubtasks.length === 1)
      return flattenTask({
        ...task,
        subtasks: remainingSubtasks,
      });

    return [{ ...task, subtasks: remainingSubtasks }];
  });

export const includeTasksAndCompact = (
  tasks: AnyTask[],
  toInclude: TaskId[],
): AnyTask[] =>
  tasks.flatMap((task) => {
    if (!isTaskTree(task)) return toInclude.includes(task.uid) ? [task] : [];

    const includedSubtasks = task.subtasks.filter((subtask) =>
      toInclude.includes(subtask.uid),
    );

    if (includedSubtasks.length === 0) return [];
    if (includedSubtasks.length === 1)
      return flattenTask({
        ...task,
        subtasks: includedSubtasks,
      });

    return [{ ...task, subtasks: includedSubtasks }];
  });

// MARK: Possibly deprecated
export const hasFiltersApplied = ({ projectIds, search }: TaskFilters) => {
  return Boolean(projectIds?.length ?? search);
};
