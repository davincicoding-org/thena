import { useCallback, useMemo } from "react";

import { BacklogTask, Task, TaskInput } from "@/core/task-management";

import { useBacklogStore } from "./useBacklogStore";

export interface BacklogHookReturn {
  loading: boolean;
  tasks: BacklogTask[];
  addTask: (task: TaskInput, callback?: (task: Task) => void) => void;
  addTasks: (tasks: TaskInput[], callback?: (tasks: Task[]) => void) => void;
  updateTask: (taskId: Task["id"], updates: Partial<Omit<Task, "id">>) => void;
  deleteTask: (taskId: Task["id"]) => void;
  deleteTasks: (taskIds: Task["id"][]) => void;
}

/**
 * Manages stored tags.
 */

export function useBacklog(): BacklogHookReturn {
  const store = useBacklogStore();

  const tasks = useMemo(
    () =>
      Object.entries(store.pool).map(([id, task]) => ({
        id,
        ...task,
      })),
    [store.pool],
  );

  const addTask = useCallback<BacklogHookReturn["addTask"]>(
    (input, callback) => {
      store.addTask(input, async (task) => {
        if (callback) callback?.(task);
        // TODO store tag in backend
      });
    },
    [],
  );

  const addTasks = useCallback<BacklogHookReturn["addTasks"]>(
    (tasks, callback) => {
      store.addTasks(tasks, (tasks) => {
        if (callback) callback(tasks);
        // TODO update in backend
      });
    },
    [],
  );
  const updateTask = useCallback<BacklogHookReturn["updateTask"]>(
    (taskId, updates) => {
      store.updateTask(taskId, updates, (task) => {
        // TODO update in backend
      });
    },
    [],
  );

  const deleteTask = useCallback<BacklogHookReturn["deleteTask"]>((taskId) => {
    store.removeTask(taskId);
    // TODO delete in backend
  }, []);

  const deleteTasks = useCallback<BacklogHookReturn["deleteTasks"]>(
    (taskIds) => {
      store.removeTasks(taskIds);
      // TODO delete in backend
    },
    [],
  );

  return {
    loading: !store.ready,
    tasks,
    addTask,
    addTasks,
    updateTask,
    deleteTask,
    deleteTasks,
  };
}
