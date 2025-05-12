import { useCallback, useState } from "react";

import type { TaskId, TaskSelection } from "@/core/task-management";

export interface TaskSelectionHookReturn {
  selection: TaskSelection[];
  clearSelection: () => void;
  isTaskSelected: (task: TaskId) => boolean;
  areAllTasksSelected: (tasks: TaskId[]) => boolean;
  toggleTaskSelection: (task: {
    id: TaskId;
    parent: TaskId | null;
    subtasks?: TaskId[];
  }) => void;
}

export function useTaskSelection(): TaskSelectionHookReturn {
  const [selection, setSelection] = useState<TaskSelection[]>([]);

  const flatSelection = selection.flatMap(({ id, subtasks }) => [
    id,
    ...(subtasks ?? []),
  ]);

  const clearSelection = useCallback(() => setSelection([]), []);

  const isTaskSelected: TaskSelectionHookReturn["isTaskSelected"] = (task) =>
    flatSelection.includes(task);

  const areAllTasksSelected: TaskSelectionHookReturn["areAllTasksSelected"] = (
    tasks,
  ) => tasks.every((task) => flatSelection.includes(task));

  const toggleTaskSelection: TaskSelectionHookReturn["toggleTaskSelection"] = (
    task,
  ) =>
    setSelection((prev) => {
      if (task.parent) {
        const parent = prev.find((t) => t.id === task.parent);
        if (!parent) {
          return [...prev, { id: task.parent, subtasks: [task.id] }];
        }
        const selectedSubtasks = parent.subtasks ?? [];
        if (!selectedSubtasks.includes(task.id)) {
          return prev.map((t) => {
            if (t.id !== task.parent) return t;
            return { ...t, subtasks: [...(t.subtasks ?? []), task.id] };
          });
        }

        if (selectedSubtasks.length === 1) {
          return prev.filter((t) => t.id !== task.parent);
        }

        return prev.map((t) => {
          if (t.id !== task.parent) return t;
          return {
            ...t,
            subtasks: selectedSubtasks.filter((t) => t !== task.id),
          };
        });
      }

      const selectedTask = prev.find((t) => t.id === task.id);
      if (!selectedTask) {
        return [...prev, { id: task.id, subtasks: task.subtasks }];
      }

      const subtasksToToggle = task.subtasks ?? [];

      if (subtasksToToggle.length === 0) {
        return prev.filter((t) => t.id !== task.id);
      }

      const selectedSubtasks = selectedTask.subtasks ?? [];

      if (selectedSubtasks.every((t) => subtasksToToggle.includes(t))) {
        return prev.filter((t) => t.id !== task.id);
      }

      return prev.map((t) => {
        if (t.id !== task.id) return t;
        return {
          ...t,
          subtasks: subtasksToToggle,
        };
      });
    });

  return {
    selection,
    clearSelection,
    isTaskSelected,
    areAllTasksSelected,
    toggleTaskSelection,
  };
}
