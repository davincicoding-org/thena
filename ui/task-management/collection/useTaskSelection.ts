import { useState } from "react";

import type { Task, TaskReference } from "@/core/task-management";
import {
  excludeTaskReferences,
  resolveTaskReferences,
} from "@/core/task-management";

export interface TaskSelectionHookReturn<T extends Task> {
  selection: TaskReference[];
  tasks: T[];
  clearSelection: () => void;
  isTaskSelected: (task: T) => boolean;
  isSubtaskSelected: (taskReference: TaskReference) => boolean;
  toggleTaskSelection: (task: T) => void;
  toggleSubtaskSelection: (taskReference: TaskReference) => void;
}

export function useTaskSelection<T extends Task>(
  taskList: T[] = [],
): TaskSelectionHookReturn<T> {
  const [selection, setSelection] = useState<TaskReference[]>([]);

  const isTaskSelected: TaskSelectionHookReturn<T>["isTaskSelected"] = (task) =>
    isTaskFullyIncluded(task, selection);

  const isSubtaskSelected: TaskSelectionHookReturn<T>["isSubtaskSelected"] = ({
    taskId,
    subtaskId,
  }) => isSubtaskIncluded({ taskId, subtaskId }, selection);

  const tasks = resolveTaskReferences(selection, taskList);

  const toggleTaskSelection: TaskSelectionHookReturn<T>["toggleTaskSelection"] =
    (task) =>
      setSelection((prev) => {
        const isFullySelected = isTaskFullyIncluded(task, prev);

        if (isFullySelected)
          return prev.filter((selectedTask) => selectedTask.taskId !== task.id);

        const isPartiallySelected = isTaskPartiallyIncluded(task, prev);

        if (isPartiallySelected)
          return [
            ...prev.filter((selectedTask) => selectedTask.taskId !== task.id),
            ...(task.subtasks ?? []).map((subtask) => ({
              taskId: task.id,
              subtaskId: subtask.id,
            })),
          ];

        if (!task.subtasks?.length)
          return [
            ...prev,
            {
              taskId: task.id,
              subtaskId: null,
            },
          ];

        return [
          ...prev,
          ...(task.subtasks ?? []).map((subtask) => ({
            taskId: task.id,
            subtaskId: subtask.id,
          })),
        ];
      });

  const toggleSubtaskSelection: TaskSelectionHookReturn<T>["toggleSubtaskSelection"] =
    (taskReference) =>
      setSelection((prev) => {
        const isSelected = isSubtaskIncluded(taskReference, prev);

        if (isSelected) {
          return excludeTaskReferences(prev, [taskReference]);
        }

        return [...prev, taskReference];
      });

  return {
    tasks,
    selection,
    clearSelection: () => setSelection([]),
    isTaskSelected,
    isSubtaskSelected,
    toggleTaskSelection,
    toggleSubtaskSelection,
  };
}

/* HELPER FUNCTIONS */

const isTaskPartiallyIncluded = (
  task: Task,
  selection: TaskReference[],
): boolean => selection.some((selectedTask) => selectedTask.taskId === task.id);

const isTaskFullyIncluded = (
  task: Task,
  selection: TaskReference[],
): boolean => {
  if (!isTaskPartiallyIncluded(task, selection)) return false;
  if (!task.subtasks?.length) return true;

  return task.subtasks.every((subtask) =>
    selection.some(({ subtaskId }) => subtaskId === subtask.id),
  );
};

const isSubtaskIncluded = (
  { taskId, subtaskId }: TaskReference,
  selection: TaskReference[],
): boolean =>
  selection.some(
    (entry) => subtaskId === entry.subtaskId && taskId === entry.taskId,
  );
