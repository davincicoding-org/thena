import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { BacklogTask } from "@/core/task-management";
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
    callback?: (task: BacklogTask) => void,
  ) => void;
  addTasks: (
    tasks: Omit<BacklogTask, "id" | "addedAt">[],
    callback?: (tasks: BacklogTask[]) => void,
  ) => void;
  updateTask: (
    taskId: BacklogTask["id"],
    update: Partial<Omit<BacklogTask, "id">>,
    callback?: (task: BacklogTask) => void,
  ) => void;
  removeTask: (taskId: BacklogTask["id"]) => void;
  removeTasks: (taskIds: BacklogTask["id"][]) => void;
}

export const useBacklogStore = create<BacklogStoreState>()(
  devtools(
    persist(
      (set, get) => ({
        pool: {},
        items: [],
        ready: false,
        addTask: (task, callback) =>
          set((state) => {
            const id = createUniqueId(state.pool);
            const populatedTask = {
              ...task,
              addedAt: new Date().toISOString(),
            };

            callback?.({ ...populatedTask, id });

            return {
              pool: {
                ...state.pool,
                [id]: populatedTask,
              },
            };
          }),
        addTasks: (tasks, callback) => {
          set((state) => {
            const newTasks = tasks.reduce<BacklogStoreState["pool"]>(
              (acc, task) => ({
                ...acc,
                [createUniqueId({
                  ...acc,
                  ...state.pool,
                })]: { addedAt: new Date().toISOString(), ...task },
              }),
              {},
            );

            callback?.(
              Object.entries(newTasks).map(([id, task]) => ({
                ...task,
                id,
              })),
            );

            return {
              pool: { ...state.pool, ...newTasks },
            };
          });
        },
        updateTask: (taskId, updates, callback) => {
          set((state) => {
            const existingTask = state.pool[taskId];
            if (!existingTask) return state;

            const updatedTask = { ...existingTask, ...updates };
            callback?.({ id: taskId, ...updatedTask });

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
            const { [taskId]: _, ...remainingTasks } = state.pool;

            return {
              pool: remainingTasks,
            };
          });
        },
        removeTasks: (taskIds) => {
          set((state) => ({
            pool: taskIds.reduce<BacklogStoreState["pool"]>((_acc, taskId) => {
              const { [taskId]: _removedTask, ...remainingTasks } = state.pool;
              return remainingTasks;
            }, state.pool),
          }));
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
            localDB.setItem(name, JSON.stringify(state.pool));
          },
          removeItem: (name) => {
            localDB.removeItem(name);
          },
        },
      },
    ),
  ),
);
