import { useState } from "react";

import type {
  SubtaskReference,
  Task,
  TaskSelection,
} from "@/core/task-management";
import {
  excludeTaskSelection,
  mergeTaskSelections,
} from "@/core/task-management";

export interface TaskSelectionHookReturn<T extends Task> {
  selection: TaskSelection[];
  tasks: T[];
  clearSelection: () => void;
  isTaskSelected: (task: T) => boolean;
  isSubtaskSelected: (taskReference: SubtaskReference) => boolean;
  toggleTaskSelection: (task: T) => void;
  toggleSubtaskSelection: (taskReference: SubtaskReference) => void;
}

export function useTaskSelection<T extends Task>(
  taskList: T[] = [],
): TaskSelectionHookReturn<T> {
  const [selection, setSelection] = useState<TaskSelection[]>([]);

  const isTaskSelected: TaskSelectionHookReturn<T>["isTaskSelected"] = (task) =>
    selection.some((selectedTask) => isTaskFullyIncluded(task, selectedTask));

  const isSubtaskSelected: TaskSelectionHookReturn<T>["isSubtaskSelected"] = ({
    taskId,
    subtaskId,
  }) =>
    selection.some((selectedTask) =>
      isSubtaskIncluded({ taskId, subtaskId }, selectedTask),
    );

  const tasks = taskList.reduce<T[]>((acc, task) => {
    if (isTaskSelected(task)) return [...acc, task];

    if (!task.subtasks?.length) return acc;

    const selectedSubTasks = task.subtasks.filter((subtask) =>
      isSubtaskSelected({
        taskId: task.id,
        subtaskId: subtask.id,
      }),
    );

    if (selectedSubTasks.length === 0) return acc;

    return [
      ...acc,
      {
        ...task,
        subtasks: selectedSubTasks,
      },
    ];
  }, []);

  const toggleTaskSelection: TaskSelectionHookReturn<T>["toggleTaskSelection"] =
    (task) =>
      setSelection((prev) => {
        const isFullySelected = prev.some((selectedTask) =>
          isTaskFullyIncluded(task, selectedTask),
        );

        if (isFullySelected)
          return prev.filter((selectedTask) => selectedTask.taskId !== task.id);

        const isPartiallySelected = prev.some((selectedTask) =>
          isTaskPartiallyIncluded(task, selectedTask),
        );

        if (isPartiallySelected)
          return prev.map((selectedTask) => {
            if (selectedTask.taskId !== task.id) return selectedTask;

            return {
              ...selectedTask,
              subtaskIds: task.subtasks?.length
                ? task.subtasks.map(({ id }) => id)
                : undefined,
            };
          });

        if (!task.subtasks?.length)
          return [
            ...prev,
            {
              taskId: task.id,
            },
          ];

        return [
          ...prev,
          {
            taskId: task.id,
            subtaskIds: task.subtasks.map(({ id }) => id),
          },
        ];
      });

  const toggleSubtaskSelection: TaskSelectionHookReturn<T>["toggleSubtaskSelection"] =
    (taskReference) =>
      setSelection((prev) => {
        const isSelected = prev.some((selectedTask) =>
          isSubtaskIncluded(taskReference, selectedTask),
        );

        if (isSelected) {
          return excludeTaskSelection(prev, {
            taskId: taskReference.taskId,
            subtaskIds: [taskReference.subtaskId],
          });
        }

        return mergeTaskSelections([
          ...prev,
          {
            taskId: taskReference.taskId,
            subtaskIds: [taskReference.subtaskId],
          },
        ]);
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
  selectedTask: TaskSelection,
): boolean => {
  if (selectedTask.taskId !== task.id) return false;
  return true;
};

const isTaskFullyIncluded = (
  task: Task,
  selectedTask: TaskSelection,
): boolean => {
  if (!isTaskPartiallyIncluded(task, selectedTask)) return false;
  if (!task.subtasks?.length) return true;

  return task.subtasks.every((subtask) =>
    selectedTask.subtaskIds?.includes(subtask.id),
  );
};

const isSubtaskIncluded = (
  { taskId, subtaskId }: SubtaskReference,
  selectedTask: TaskSelection,
): boolean => {
  if (selectedTask.taskId !== taskId) return false;
  if (!selectedTask.subtaskIds?.length) return false;
  return selectedTask.subtaskIds.includes(subtaskId);
};
