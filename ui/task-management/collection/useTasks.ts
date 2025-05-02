import type { StoredTask, Task, TaskInput } from "@/core/task-management";

import { useTasksStore } from "./useTasksStore";

/**
 * Manages stored tags.
 */

export function useTasks() {
  const store = useTasksStore();

  const items = Object.entries(store.pool).map(([id, task]) => ({
    id,
    ...task,
  }));

  function addTask(task: TaskInput): Promise<StoredTask>;
  function addTask(task: TaskInput, callback: (task: StoredTask) => void): void;
  function addTask(
    task: TaskInput,
    callback?: (task: StoredTask) => void,
  ): void | Promise<StoredTask> {
    const backendCall = (_result: StoredTask) => {
      // TODO store tag in backend
    };

    if (callback)
      return store.addTask(task, (result) => {
        callback(result);
        backendCall(result);
      });

    return new Promise((resolve) => {
      store.addTask(task, (result) => {
        backendCall(result);
        resolve(result);
      });
    });
  }

  function addTasks(tasks: TaskInput[]): Promise<StoredTask[]>;
  function addTasks(
    tasks: TaskInput[],
    callback: (tasks: StoredTask[]) => void,
  ): void;
  function addTasks(
    tasks: TaskInput[],
    callback?: (tasks: StoredTask[]) => void,
  ): void | Promise<StoredTask[]> {
    const backendCall = (_result: StoredTask[]) => {
      // TODO store tag in backend
    };

    if (callback)
      return store.addTasks(tasks, (result) => {
        callback(result);
        backendCall(result);
      });

    return new Promise((resolve) => {
      store.addTasks(tasks, (result) => {
        backendCall(result);
        resolve(result);
      });
    });
  }

  function updateTask(
    taskId: Task["id"],
    updates: Partial<TaskInput>,
  ): Promise<Record<"updated" | "prev", StoredTask> | undefined>;
  function updateTask(
    taskId: Task["id"],
    updates: Partial<TaskInput>,
    callback: (
      result: Record<"updated" | "prev", StoredTask> | undefined,
    ) => void,
  ): void;
  function updateTask(
    taskId: Task["id"],
    updates: Partial<TaskInput>,
    callback?: (
      result: Record<"updated" | "prev", StoredTask> | undefined,
    ) => void,
  ): void | Promise<Record<"updated" | "prev", StoredTask> | undefined> {
    const backendCall = (
      _result: Record<"updated" | "prev", StoredTask> | undefined,
    ) => {
      // TODO store tag in backend
    };

    if (callback)
      return store.updateTask(taskId, updates, (result) => {
        callback(result);
        backendCall(result);
      });

    return new Promise((resolve) => {
      store.updateTask(taskId, updates, (result) => {
        backendCall(result);
        resolve(result);
      });
    });
  }

  const insertTask = (task: StoredTask) => {
    store.insertTask(task);
    // TODO insert in backend
  };

  function deleteTask(taskId: Task["id"]): Promise<StoredTask>;
  function deleteTask(
    taskId: Task["id"],
    callback: (task: StoredTask | undefined) => void,
  ): void;
  function deleteTask(
    taskId: Task["id"],
    callback?: (task: StoredTask | undefined) => void,
  ): void | Promise<StoredTask | undefined> {
    const backendCall = (_result: StoredTask | undefined) => {
      // TODO delete in backend
    };

    if (callback)
      return store.removeTask(taskId, (result) => {
        callback(result);
        backendCall(result);
      });

    return new Promise((resolve) => {
      store.removeTask(taskId, (result) => {
        backendCall(result);
        resolve(result);
      });
    });
  }

  function deleteTasks(taskIds: Task["id"][]): Promise<StoredTask[]>;
  function deleteTasks(
    taskIds: Task["id"][],
    callback: (tasks: StoredTask[]) => void,
  ): void;
  function deleteTasks(
    taskIds: Task["id"][],
    callback?: (tasks: StoredTask[]) => void,
  ): void | Promise<StoredTask[]> {
    const backendCall = (_result: StoredTask[]) => {
      // TODO delete in backend
    };

    if (callback)
      return store.removeTasks(taskIds, (result) => {
        callback(result);
        backendCall(result);
      });

    return new Promise((resolve) => {
      store.removeTasks(taskIds, (result) => {
        backendCall(result);
        resolve(result);
      });
    });
  }

  return {
    loading: !store.ready,
    items,
    addTask,
    addTasks,
    updateTask,
    insertTask,
    deleteTask,
    deleteTasks,
  };
}
