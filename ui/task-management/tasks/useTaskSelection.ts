import { useCallback, useState } from "react";

import type { TaskId } from "@/core/task-management";

export interface TaskSelectionHookReturn {
  selection: TaskId[];
  clearSelection: () => void;
  isTaskSelected: (task: TaskId) => boolean;
  areAllTasksSelected: (tasks: TaskId[]) => boolean;
  toggleTaskSelection: (task: TaskId) => void;
  toggleTasksSelection: (tasks: TaskId[]) => void;
}

export function useTaskSelection(): TaskSelectionHookReturn {
  const [selection, setSelection] = useState<TaskId[]>([]);

  const clearSelection = useCallback(() => setSelection([]), []);

  const isTaskSelected: TaskSelectionHookReturn["isTaskSelected"] = (task) =>
    selection.includes(task);

  const areAllTasksSelected: TaskSelectionHookReturn["areAllTasksSelected"] = (
    tasks,
  ) => tasks.every((task) => selection.includes(task));

  const toggleTaskSelection: TaskSelectionHookReturn["toggleTaskSelection"] = (
    task,
  ) =>
    setSelection((prev) => {
      const isSelected = prev.includes(task);

      if (isSelected) return prev.filter((entry) => entry !== task);

      return [...prev, task];
    });

  const toggleTasksSelection: TaskSelectionHookReturn["toggleTasksSelection"] =
    (tasks) =>
      setSelection((prev) => {
        const areAllSelected = tasks.every((task) => prev.includes(task));

        if (areAllSelected) return prev.filter((task) => !tasks.includes(task));

        const notSelectedTasks = tasks.filter((task) => !prev.includes(task));

        return [...prev, ...notSelectedTasks];
      });

  return {
    selection,
    clearSelection,
    isTaskSelected,
    areAllTasksSelected,
    toggleTaskSelection,
    toggleTasksSelection,
  };
}
