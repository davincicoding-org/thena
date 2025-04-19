import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { nanoid } from "nanoid";
import useUndo from "use-undo";

import { StateHook, Subtask, Task } from "../../../core/task-management/types";

export type SubtaskInput = Omit<Subtask, "id">;
export type TaskInput = Omit<Task, "id"> & { subtasks?: SubtaskInput[] };

export interface TaskListHookOptions {
  initialTasks?: Task[];
  useStateAdapter?: StateHook<Task[]>;
}

export interface TaskListHookReturn {
  // Current list of tasks
  tasks: Task[];
  setTasks: Dispatch<SetStateAction<Task[]>>;

  // Task operations
  addTask: (task: TaskInput) => void;
  addTasks: (tasks: TaskInput[]) => void;
  updateTask: (id: string, updates: Partial<TaskInput>) => void;
  removeTask: (id: string) => void;
  removeTasks: (ids: string[]) => void;

  // Subtask operations
  addSubtask: (taskId: string, subtask: SubtaskInput) => void;
  addSubtasks: (taskId: string, subtasks: SubtaskInput[]) => void;
  updateSubtask: (
    taskId: string,
    subtaskId: string,
    updates: Partial<SubtaskInput>,
  ) => void;
  removeSubtask: (taskId: string, subtaskId: string) => void;
  removeSubtasks: (taskId: string, subtaskIds: string[]) => void;
}

/**
 * Manages a local, temporary list of tasks in a task list.
 * Tasks (and subtasks) can be added, removed, edited, and batch‑operated with undo/redo support.
 */
export function useTaskList({
  initialTasks = [],
  useStateAdapter = useState,
}: TaskListHookOptions = {}): TaskListHookReturn {
  // Use the useUndo hook for managing tasks with history
  const [tasks, setTasks] = useStateAdapter(initialTasks);

  /**
   * Add a single task
   */
  const addTask = useCallback<TaskListHookReturn["addTask"]>(
    (task) => {
      setTasks([...tasks, { ...task, id: nanoid() }]);
    },
    [tasks, setTasks],
  );

  /**
   * Add multiple tasks
   */
  const addTasks = useCallback<TaskListHookReturn["addTasks"]>(
    (newTasks) => {
      setTasks([
        ...tasks,
        ...newTasks.map((task) => ({ ...task, id: nanoid() })),
      ]);
    },
    [tasks, setTasks],
  );

  /**
   * Update an existing task
   */
  const updateTask = useCallback<TaskListHookReturn["updateTask"]>(
    (id, updates) => {
      setTasks(
        tasks.map((task: Task) =>
          task.id === id ? { ...task, ...updates } : task,
        ),
      );
    },
    [tasks, setTasks],
  );

  /**
   * Remove a single task
   */
  const removeTask = useCallback<TaskListHookReturn["removeTask"]>(
    (id) => {
      setTasks(tasks.filter((task: Task) => task.id !== id));
    },
    [tasks, setTasks],
  );

  /**
   * Remove multiple tasks
   */
  const removeTasks = useCallback<TaskListHookReturn["removeTasks"]>(
    (ids) => {
      setTasks(tasks.filter((task: Task) => !ids.includes(task.id)));
    },
    [tasks, setTasks],
  );

  /**
   * Add a subtask to a task
   */
  const addSubtask = useCallback<TaskListHookReturn["addSubtask"]>(
    (taskId, subtask) => {
      setTasks(
        tasks.map((task: Task) => {
          if (task.id === taskId) {
            const subtasks = task.subtasks || [];
            return {
              ...task,
              subtasks: [...subtasks, { ...subtask, id: nanoid() }],
            };
          }
          return task;
        }),
      );
    },
    [tasks, setTasks],
  );

  /**
   * Add multiple subtasks to a task
   */
  const addSubtasks = useCallback<TaskListHookReturn["addSubtasks"]>(
    (taskId, subtasks) => {
      setTasks(
        tasks.map((task: Task) => {
          if (task.id === taskId) {
            const existingSubtasks = task.subtasks || [];
            return {
              ...task,
              subtasks: [
                ...existingSubtasks,
                ...subtasks.map((subtask) => ({
                  ...subtask,
                  id: nanoid(),
                })),
              ],
            };
          }
          return task;
        }),
      );
    },
    [tasks, setTasks],
  );

  /**
   * Update a subtask
   */
  const updateSubtask = useCallback<TaskListHookReturn["updateSubtask"]>(
    (taskId, subtaskId, updates) => {
      setTasks(
        tasks.map((task: Task) => {
          if (task.id === taskId && task.subtasks) {
            return {
              ...task,
              subtasks: task.subtasks.map((subtask) =>
                subtask.id === subtaskId ? { ...subtask, ...updates } : subtask,
              ),
            };
          }
          return task;
        }),
      );
    },
    [tasks, setTasks],
  );

  /**
   * Remove a subtask
   */
  const removeSubtask = useCallback<TaskListHookReturn["removeSubtask"]>(
    (taskId, subtaskId) => {
      setTasks(
        tasks.map((task: Task) => {
          if (task.id === taskId && task.subtasks) {
            return {
              ...task,
              subtasks: task.subtasks.filter(
                (subtask) => subtask.id !== subtaskId,
              ),
            };
          }
          return task;
        }),
      );
    },
    [tasks, setTasks],
  );

  /**
   * Remove multiple subtasks
   */
  const removeSubtasks = useCallback<TaskListHookReturn["removeSubtasks"]>(
    (taskId, subtaskIds) => {
      setTasks(
        tasks.map((task: Task) => {
          if (task.id === taskId && task.subtasks) {
            return {
              ...task,
              subtasks: task.subtasks.filter(
                (subtask) => !subtaskIds.includes(subtask.id),
              ),
            };
          }
          return task;
        }),
      );
    },
    [tasks, setTasks],
  );

  return {
    tasks,
    setTasks,
    addTask,
    addTasks,
    updateTask,
    removeTask,
    removeTasks,
    addSubtask,
    addSubtasks,
    updateSubtask,
    removeSubtask,
    removeSubtasks,
  };
}
