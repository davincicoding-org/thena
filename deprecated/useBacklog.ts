import type { BacklogTask, Task, TaskInput } from "@/core/task-management";

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

  const tasks = Object.entries(store.pool).map(([id, task]) => ({
    id,
    ...task,
  }));

  const addTask: BacklogHookReturn["addTask"] = (input, callback) => {
    store.addTask(input, (task) => {
      if (callback) callback?.(task);
      // TODO store tag in backend
    });
  };

  const addTasks: BacklogHookReturn["addTasks"] = (tasks, callback) => {
    store.addTasks(tasks, (tasks) => {
      if (callback) callback(tasks);
      // TODO update in backend
    });
  };

  const updateTask: BacklogHookReturn["updateTask"] = (taskId, updates) => {
    store.updateTask(taskId, updates, () => {
      // TODO update in backend
    });
  };

  const deleteTask: BacklogHookReturn["deleteTask"] = (taskId) => {
    store.removeTask(taskId);
    // TODO delete in backend
  };

  const deleteTasks: BacklogHookReturn["deleteTasks"] = (taskIds) => {
    store.removeTasks(taskIds);
    // TODO delete in backend
  };

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
