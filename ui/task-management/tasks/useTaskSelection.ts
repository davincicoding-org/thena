import { useCallback, useState } from "react";

import type { TaskReference } from "@/core/task-management";
import {
  doesTaskReferenceExist,
  excludeTaskReferences,
} from "@/core/task-management";

export interface TaskSelectionHookReturn {
  selection: TaskReference[];
  clearSelection: () => void;
  isTaskSelected: (task: TaskReference) => boolean;
  isTaskGroupSelected: (tasks: TaskReference[]) => boolean;
  toggleTaskSelection: (task: TaskReference) => void;
  toggleTaskGroupSelection: (tasks: TaskReference[]) => void;
}

export function useTaskSelection(): TaskSelectionHookReturn {
  const [selection, setSelection] = useState<TaskReference[]>([]);

  const clearSelection = useCallback(() => setSelection([]), []);

  const isTaskSelected: TaskSelectionHookReturn["isTaskSelected"] = (task) =>
    doesTaskReferenceExist(task, selection);

  const isTaskGroupSelected: TaskSelectionHookReturn["isTaskGroupSelected"] = (
    tasks,
  ) => tasks.every((task) => doesTaskReferenceExist(task, selection));

  const toggleTaskSelection: TaskSelectionHookReturn["toggleTaskSelection"] = (
    task,
  ) =>
    setSelection((prev) => {
      const isSelected = doesTaskReferenceExist(task, prev);

      if (isSelected) {
        return excludeTaskReferences(prev, [task]);
      }

      return [...prev, task];
    });

  const toggleTaskGroupSelection: TaskSelectionHookReturn["toggleTaskGroupSelection"] =
    (tasks) =>
      setSelection((prev) => {
        const areAllSelected = tasks.every((task) =>
          doesTaskReferenceExist(task, prev),
        );

        if (areAllSelected) {
          return excludeTaskReferences(prev, tasks);
        }

        const notSelectedTasks = tasks.filter(
          (task) => !doesTaskReferenceExist(task, prev),
        );

        return [...prev, ...notSelectedTasks];
      });

  return {
    selection,
    clearSelection,
    isTaskSelected,
    isTaskGroupSelected,
    toggleTaskSelection,
    toggleTaskGroupSelection,
  };
}
