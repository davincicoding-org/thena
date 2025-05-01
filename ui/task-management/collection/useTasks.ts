import type { StoredTask, Task, TaskInput } from "@/core/task-management";

import { useTasksStore } from "./useTasksStore";

export interface TasksHookReturn {
  loading: boolean;
  items: StoredTask[];
  addTask: (task: TaskInput, callback?: (task: StoredTask) => void) => void;
  addTasks: (
    tasks: TaskInput[],
    callback?: (tasks: StoredTask[]) => void,
  ) => void;
  updateTask: (taskId: Task["id"], updates: Partial<TaskInput>) => void;
  deleteTask: (taskId: Task["id"]) => void;
  deleteTasks: (taskIds: Task["id"][]) => void;
}

/**
 * Manages stored tags.
 */

export function useTasks(): TasksHookReturn {
  const store = useTasksStore();

  const items = Object.entries(store.pool).map(([id, task]) => ({
    id,
    ...task,
  }));

  const addTask: TasksHookReturn["addTask"] = (input, callback) => {
    store.addTask(input, (task) => {
      if (callback) callback?.(task);
      // TODO store tag in backend
    });
  };

  const addTasks: TasksHookReturn["addTasks"] = (tasks, callback) => {
    store.addTasks(tasks, (tasks) => {
      if (callback) callback(tasks);
      // TODO update in backend
    });
  };

  const updateTask: TasksHookReturn["updateTask"] = (taskId, updates) => {
    store.updateTask(taskId, updates, () => {
      // TODO update in backend
    });
  };

  const deleteTask: TasksHookReturn["deleteTask"] = (taskId) => {
    store.removeTask(taskId);
    // TODO delete in backend
  };

  const deleteTasks: TasksHookReturn["deleteTasks"] = (taskIds) => {
    store.removeTasks(taskIds);
    // TODO delete in backend
  };

  return {
    loading: !store.ready,
    items,
    addTask,
    addTasks,
    updateTask,
    deleteTask,
    deleteTasks,
  };
}
