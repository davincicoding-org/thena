import { Dispatch, SetStateAction, useCallback, useState } from "react";

import { Task, TaskInput } from "@/core/task-management";
import { createUniqueId, ExternalState } from "@/ui/utils";

export interface TaskListHookOptions {
  initialItems?: Task[];
  externalState?: ExternalState<Task[]>;
}

export interface TaskListHookReturn {
  // Current list of tasks
  items: Task[];
  setItems: Dispatch<SetStateAction<Task[]>>;

  // Task operations
  addTask: (task: TaskInput) => void;
  addTasks: (tasks: TaskInput[]) => void;
  updateTask: (taskId: Task["id"], updates: Partial<TaskInput>) => void;
  removeTask: (taskId: Task["id"]) => void;
  removeTasks: (taskIds: Task["id"][]) => void;
}

/**
 * Manages a list of tasks.
 * Tasks can be added, removed, edited, and batch‑operated.
 */
export function useTaskList({
  initialItems = [],
  externalState: [items, setItems] = useState(initialItems),
}: TaskListHookOptions = {}): TaskListHookReturn {
  const generateTaskID = (existingItems: Task[]) =>
    createUniqueId(
      Object.fromEntries(existingItems.map((item) => [item.id, null])),
    );

  /**
   * Add a single task
   */
  const addTask = useCallback<TaskListHookReturn["addTask"]>(
    (task) =>
      setItems((prev) => [...prev, { ...task, id: generateTaskID(prev) }]),
    [],
  );

  /**
   * Add multiple tasks
   */
  const addTasks = useCallback<TaskListHookReturn["addTasks"]>(
    (tasks) =>
      setItems((prev) =>
        tasks.reduce<Task[]>(
          (acc, task) => [...acc, { ...task, id: generateTaskID(acc) }],
          [...prev],
        ),
      ),
    [],
  );

  /**
   * Update an existing task
   */
  const updateTask = useCallback<TaskListHookReturn["updateTask"]>(
    (taskId, updates) =>
      setItems((prev) =>
        prev.map((task: Task) =>
          task.id === taskId ? { ...task, ...updates } : task,
        ),
      ),
    [],
  );

  /**
   * Remove a single task
   */
  const removeTask = useCallback<TaskListHookReturn["removeTask"]>(
    (taskId) =>
      setItems((prev) => prev.filter((task: Task) => task.id !== taskId)),
    [],
  );

  /**
   * Remove multiple tasks
   */
  const removeTasks = useCallback<TaskListHookReturn["removeTasks"]>(
    (taskIds) =>
      setItems((prev) =>
        prev.filter((task: Task) => !taskIds.includes(task.id)),
      ),
    [],
  );

  return {
    items,
    setItems,
    addTask,
    addTasks,
    updateTask,
    removeTask,
    removeTasks,
  };
}
