import { useCallback, useState } from "react";

import {
  excludeTaskSelection,
  hasSubtasks,
  mergeTaskSelections,
  SubtaskReference,
  Task,
  TaskSelection,
} from "@/core/task-management";

export interface TaskSelectionHookRetrun {
  selection: TaskSelection[];
  clearSelection: () => void;
  isTaskSelected: (task: Task) => boolean;
  isSubtaskSelected: (taskReference: SubtaskReference) => boolean;
  toggleTaskSelection: (task: Task) => void;
  toggleSubtaskSelection: (taskReference: SubtaskReference) => void;
}

export function useTaskSelection(): TaskSelectionHookRetrun {
  const [selection, setSelection] = useState<TaskSelection[]>([]);

  const isTaskSelected = useCallback<TaskSelectionHookRetrun["isTaskSelected"]>(
    (task) =>
      selection.some((selectedTask) => isTaskFullyIncluded(task, selectedTask)),
    [selection],
  );

  const isSubtaskSelected = useCallback<
    TaskSelectionHookRetrun["isSubtaskSelected"]
  >(
    ({ taskId, subtaskId }) =>
      selection.some((selectedTask) =>
        isSubtaskIncluded({ taskId, subtaskId }, selectedTask),
      ),
    [selection],
  );

  const toggleTaskSelection = useCallback<
    TaskSelectionHookRetrun["toggleTaskSelection"]
  >(
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
              subtaskIds: hasSubtasks(task)
                ? task.subtasks.map(({ id }) => id)
                : undefined,
            };
          });

        if (!hasSubtasks(task))
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
      }),
    [],
  );

  const toggleSubtaskSelection = useCallback<
    TaskSelectionHookRetrun["toggleSubtaskSelection"]
  >(
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
      }),
    [],
  );

  return {
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
  if (!hasSubtasks(task)) return true;

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
