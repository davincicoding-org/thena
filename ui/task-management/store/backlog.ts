import localForage from "localforage";
import { nanoid } from "nanoid";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import { BacklogTask } from "@/core/task-management";
import { StateSetter } from "@/ui/utils";

// Define matcher function type
export type TaskMatcher = (task: BacklogTask) => boolean;

// Define the store state interface
interface BacklogStoreState {
  // Task data - storing tasks without redundant IDs
  tasks: Record<string, Omit<BacklogTask, "id">>;

  // Query actions
  getTask: (
    idOrMatcher: BacklogTask["id"] | TaskMatcher,
  ) => BacklogTask | undefined;
  getTasks: (idsOrMatcher?: BacklogTask["id"][] | TaskMatcher) => BacklogTask[];

  // Mutation actions
  addTask: (task: Omit<BacklogTask, "id" | "addedAt">) => BacklogTask;
  addTasks: (tasks: Omit<BacklogTask, "id" | "addedAt">[]) => BacklogTask[];
  updateTask: (
    taskId: BacklogTask["id"],
    update: Partial<Omit<BacklogTask, "id">>,
  ) => void;
  removeTask: (taskId: BacklogTask["id"]) => void;
}

const localTaskStorage = localForage.createInstance({
  driver: localForage.INDEXEDDB,
  name: "tasks",
  version: 1,
});

export const useBacklogTasksStore = create<BacklogStoreState>()(
  devtools(
    persist(
      (set, get) => ({
        tasks: {},
        isLoading: false,
        getTask: (idOrMatcher) => {
          const { tasks } = get();

          if (typeof idOrMatcher === "string") {
            const task = tasks[idOrMatcher];
            return task ? { ...task, id: idOrMatcher } : undefined;
          }

          const tasksWithIds = Object.entries(tasks).map(([id, task]) => ({
            ...task,
            id,
          }));
          return tasksWithIds.find(idOrMatcher);
        },
        getTasks: (idsOrMatcher) => {
          const { tasks } = get();

          const tasksWithIds = Object.entries(tasks).map(([id, task]) => ({
            ...task,
            id,
          }));

          if (!idsOrMatcher) return tasksWithIds;

          if (Array.isArray(idsOrMatcher))
            return idsOrMatcher
              .map((id) => (tasks[id] ? { ...tasks[id], id } : undefined))
              .filter(Boolean) as BacklogTask[];

          return tasksWithIds.filter(idsOrMatcher);
        },
        addTask: (task) => {
          const id = nanoid();
          const newTask = { ...task, addedAt: new Date().toISOString() };

          set((state) => ({
            tasks: {
              ...state.tasks,
              [id]: newTask,
            },
          }));

          return { ...newTask, id };
        },
        addTasks: (tasks) => {
          const newTasks = tasks.reduce<BacklogStoreState["tasks"]>(
            (acc, task) => ({
              ...acc,
              [nanoid()]: { ...task, addedAt: new Date().toISOString() },
            }),
            {},
          );

          set((state) => ({
            tasks: { ...state.tasks, ...newTasks },
          }));

          return Object.entries(newTasks).map(([id, task]) => ({
            ...task,
            id,
          }));
        },
        updateTask: (taskId, updates) => {
          set((state) => {
            const existingTask = state.tasks[taskId];
            if (!existingTask) return state;

            return {
              tasks: {
                ...state.tasks,
                [taskId]: { ...existingTask, ...updates },
              },
            };
          });
        },
        removeTask: (taskId) => {
          set((state) => {
            const { [taskId]: _, ...remainingTasks } = state.tasks;
            return { tasks: remainingTasks };
          });
        },
      }),
      {
        name: "tasks",
        storage: createJSONStorage(() => localForage),
      },
    ),
  ),
);

const x = createJSONStorage(() => ({
  getItem: async (key) => {
    const tasks: Record<string, unknown> = {};
    await localTaskStorage.iterate((value, id) => {
      tasks[id] = value;
    });
    return JSON.stringify({ tasks });
  },
  setItem: (key, value) => {
    console.log("setItem", key, value);
    const { state } = JSON.parse(value) as {
      state: Pick<BacklogStoreState, "tasks">;
    };

    const entries = Object.entries(state.tasks);
    return Promise.all(
      entries.map(([id, task]) => localTaskStorage.setItem(id, task)),
    );
  },
  removeItem: (key) => {
    localTaskStorage.clear();
  },
}));
