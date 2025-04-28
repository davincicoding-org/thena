import { groupBy } from "lodash-es";

import type { Task, TaskSelection } from "./types";

export const resolveTaskSelection = (
  taskSelection: TaskSelection,
  tasks: Task[],
): TaskSelection | null => {
  const task = tasks.find((t) => t.id === taskSelection.taskId);
  if (!task) return null;

  // If there are no subtask selections, return the full task
  if (!taskSelection.subtaskIds?.length) return { taskId: task.id };

  // If the task doesn't have subtasks, ignore the subtask selections
  if (!task.subtasks?.length)
    return {
      taskId: task.id,
    };

  const validSubtasSelection = taskSelection.subtaskIds.filter((id) =>
    task.subtasks?.some((subtask) => subtask.id === id),
  );

  if (!validSubtasSelection.length) return null;

  return {
    taskId: task.id,
    subtaskIds: validSubtasSelection,
  };
};

export const mergeTaskSelections = (
  taskSelections: TaskSelection[],
): TaskSelection[] => {
  // TODO ensure order is preserved
  const groupedByTaskId = groupBy(taskSelections, "taskId");

  return Object.entries(groupedByTaskId).map<TaskSelection>(
    ([taskId, taskSelectionsByTaskId]) => {
      const subtaskIds = taskSelectionsByTaskId.flatMap(
        ({ subtaskIds }) => subtaskIds ?? [],
      );

      return {
        taskId,
        subtaskIds: subtaskIds.length ? subtaskIds : undefined,
      };
    },
  );
};

export const excludeTaskSelection = (
  taskSelections: TaskSelection[],
  task: TaskSelection,
): TaskSelection[] => {
  return taskSelections.reduce<TaskSelection[]>((acc, taskSelection) => {
    if (taskSelection.taskId !== task.taskId) return [...acc, taskSelection];

    // If no subtask IDs are provided, exclude the whole task
    if (!taskSelection.subtaskIds?.length) return acc;

    // If the task has no subtasks, ignore the subtasks to exclude
    if (!task.subtaskIds?.length) return [...acc, task];

    const remainingSubtaskIds = task.subtaskIds.filter(
      (subtaskId) => !taskSelection.subtaskIds?.includes(subtaskId),
    );

    return [
      ...acc,
      {
        ...task,
        subtaskIds: remainingSubtaskIds.length
          ? remainingSubtaskIds
          : undefined,
      },
    ];
  }, []);
};
