import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import type { StoredTask, TaskInput } from "@/core/task-management";
import { localDB } from "@/ui/store";
import { createUniqueId } from "@/ui/utils";

interface TasksStoreState {
  // Task data - storing tasks without redundant IDs
  pool: Record<string, Omit<StoredTask, "id">>;
  ready: boolean;

  // Mutation actions
  addTask: (
    task: TaskInput,
    callback?: (task: StoredTask) => void | Promise<void>,
  ) => void;
  addTasks: (
    tasks: TaskInput[],
    callback?: (tasks: StoredTask[]) => void | Promise<void>,
  ) => void;
  updateTask: (
    taskId: StoredTask["id"],
    update: Partial<TaskInput>,
    callback?: (task: StoredTask) => void | Promise<void>,
  ) => void;
  removeTask: (taskId: StoredTask["id"]) => void;
  removeTasks: (taskIds: StoredTask["id"][]) => void;
}

export const useTasksStore = create<TasksStoreState>()(
  devtools(
    persist(
      (set) => ({
        pool: {},
        items: [],
        ready: false,
        addTask: (task, callback) =>
          set((state) => {
            const createdAt = new Date().toISOString();
            const newTask = {
              ...task,
              id: createUniqueId(state.pool),
              createdAt,
              updatedAt: createdAt,
            };

            void callback?.(newTask);

            const { id, ...taskData } = newTask;

            return {
              pool: {
                ...state.pool,
                [id]: taskData,
              },
            };
          }),
        addTasks: (tasks, callback) => {
          set((state) => {
            const createdAt = new Date().toISOString();

            const newTasks = tasks.reduce<Record<string, StoredTask>>(
              (acc, task) => {
                const id = createUniqueId({
                  ...acc,
                  ...state.pool,
                });

                return {
                  ...acc,
                  [createUniqueId({
                    ...acc,
                    ...state.pool,
                  })]: { ...task, createdAt, updatedAt: createdAt, id },
                };
              },
              {},
            );

            void callback?.(Object.values(newTasks));

            return {
              pool: {
                ...state.pool,
                ...Object.fromEntries(
                  Object.values(newTasks).map(({ id, ...task }) => [id, task]),
                ),
              },
            };
          });
        },
        updateTask: (taskId, updates, callback) => {
          set((state) => {
            const existingTask = state.pool[taskId];
            if (!existingTask) return state;

            const updatedAt = new Date().toISOString();

            const updatedTask = {
              ...existingTask,
              ...updates,
              updatedAt,
            };
            void callback?.({ id: taskId, ...updatedTask });

            return {
              pool: {
                ...state.pool,
                [taskId]: updatedTask,
              },
            };
          });
        },
        removeTask: (taskId) => {
          set((state) => {
            const { [taskId]: _removedTask, ...remainingTasks } = state.pool;

            return {
              pool: remainingTasks,
            };
          });
        },
        removeTasks: (taskIds) => {
          set((state) => {
            const result = Object.fromEntries(
              Object.entries(state.pool).filter(
                ([id]) => !taskIds.includes(id),
              ),
            );

            return {
              pool: result,
            };
          });
        },
      }),
      {
        name: "tasks",
        storage: {
          getItem: async (name) => {
            const value = await localDB.getItem(name);
            if (!value) return { state: { pool: {}, ready: true } };

            const pool = JSON.parse(value as string) as TasksStoreState["pool"];
            return {
              state: {
                pool,
                ready: true,
              },
            };
          },
          setItem: (name, { state }) => {
            void localDB.setItem(name, JSON.stringify(state.pool));
          },
          removeItem: (name) => {
            void localDB.removeItem(name);
          },
        },
      },
    ),
  ),
);
