import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import type { BacklogTask } from "@/core/task-management";
import { localDB } from "@/ui/store";
import { createUniqueId } from "@/ui/utils";

export type TaskMatcher = (task: BacklogTask) => boolean;

interface BacklogStoreState {
  // Task data - storing tasks without redundant IDs
  pool: Record<string, Omit<BacklogTask, "id">>;
  ready: boolean;

  // Mutation actions
  addTask: (
    task: Omit<BacklogTask, "id" | "addedAt">,
    callback?: (task: BacklogTask) => void | Promise<void>,
  ) => void;
  addTasks: (
    tasks: Omit<BacklogTask, "id" | "addedAt">[],
    callback?: (tasks: BacklogTask[]) => void | Promise<void>,
  ) => void;
  updateTask: (
    taskId: BacklogTask["id"],
    update: Partial<Omit<BacklogTask, "id">>,
    callback?: (task: BacklogTask) => void | Promise<void>,
  ) => void;
  removeTask: (taskId: BacklogTask["id"]) => void;
  removeTasks: (taskIds: BacklogTask["id"][]) => void;
}

export const useBacklogStore = create<BacklogStoreState>()(
  devtools(
    persist(
      (set) => ({
        pool: {},
        items: [],
        ready: false,
        addTask: (task, callback) =>
          set((state) => {
            const newTask = {
              ...task,
              id: createUniqueId(state.pool),
              addedAt: new Date().toISOString(),
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
            const newTasks = tasks.reduce<Record<string, BacklogTask>>(
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
                  })]: { ...task, addedAt: new Date().toISOString(), id },
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

            const updatedTask = { ...existingTask, ...updates };
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

            console.log("removeTasks", { state, taskIds, result });
            return {
              pool: result,
            };
          });
        },
      }),
      {
        name: "backlog",
        storage: {
          getItem: async (name) => {
            const value = await localDB.getItem(name);
            if (!value) return { state: { pool: {}, ready: true } };

            const pool = JSON.parse(
              value as string,
            ) as BacklogStoreState["pool"];
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
