import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { BacklogTask } from "@/core/task-management";
import { localDB } from "@/ui/store";
import { createUniqueId } from "@/ui/utils";

export type TaskMatcher = (task: BacklogTask) => boolean;

interface BacklogStoreState {
  // Task data - storing tasks without redundant IDs
  pool: Record<string, Omit<BacklogTask, "id">>;
  items: BacklogTask[];
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
  ) => void;
  removeTask: (taskId: BacklogTask["id"]) => void;
}

const fromPool = (pool: Record<string, Omit<BacklogTask, "id">>) =>
  Object.entries(pool).map(([id, task]) => ({
    ...task,
    id,
  }));

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

            const updatedPool = {
              ...state.pool,
              [id]: populatedTask,
            };

            return {
              pool: updatedPool,
              items: fromPool(updatedPool),
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

            const updatedPool = { ...state.pool, ...newTasks };

            return {
              pool: updatedPool,
              items: fromPool(updatedPool),
            };
          });
        },
        updateTask: (taskId, updates) => {
          set((state) => {
            const existingTask = state.pool[taskId];
            if (!existingTask) return state;

            const updatedPool = {
              ...state.pool,
              [taskId]: { ...existingTask, ...updates },
            };

            return {
              pool: updatedPool,
              items: fromPool(updatedPool),
            };
          });
        },
        removeTask: (taskId) => {
          set((state) => {
            const { [taskId]: _, ...remainingTasks } = state.pool;

            return {
              pool: remainingTasks,
              items: fromPool(remainingTasks),
            };
          });
        },
      }),
      {
        name: "backlog",
        storage: {
          getItem: async (name) => {
            const value = await localDB.getItem(name);
            if (!value) return { state: { pool: {}, items: [], ready: true } };

            const pool = JSON.parse(
              value as string,
            ) as BacklogStoreState["pool"];
            return {
              state: {
                pool,
                ready: true,
                items: fromPool(pool),
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
