/* eslint-disable max-lines */
import type { StorageValue } from "zustand/middleware";
import { arrayMove } from "@dnd-kit/sortable";
import { pick } from "lodash-es";
import { nanoid } from "nanoid";
import superjson from "superjson";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { SprintPlan } from "@/core/deep-work";
import type { TaskId } from "@/core/task-management";

// Generic synchronous action type with optional success callback
// V = input variables, A = artifact returned on success
type Action<V, A> = (vars: V, onSuccess?: (artifact: A) => void) => void;

type SprintId = SprintPlan["id"];
type SprintInsert = Omit<SprintPlan, "id">;

interface SessionPlanningState {
  ready: boolean;
  tasks: TaskId[];
  sprints: SprintPlan[];

  addTasks: Action<
    (TaskId | { id: TaskId; index: number })[],
    { addedTasks: { id: TaskId; index?: number }[] }
  >;
  removeTasks: Action<
    TaskId[],
    {
      removedFromMaster: {
        id: TaskId;
        index: number;
      }[];
      removedFromSprints: {
        sprintId: SprintId;
        tasks: { id: TaskId; index: number }[];
      }[];
    }
  >;

  createSprint: Action<SprintInsert, { id: SprintId }>;
  insertSprint: Action<{ sprint: SprintPlan; index?: number }, void>;
  removeSprint: Action<SprintId, { sprint: SprintPlan; index: number }>;
  reorderSprints: Action<
    { from: number; to: number },
    { from: number; to: number }
  >;
  updateSprint: Action<
    { id: SprintId; data: Partial<Omit<SprintPlan, "id" | "tasks">> },
    { id: SprintId; previous: Partial<SprintPlan> }
  >;

  reorderSprintTasks: Action<
    { sprintId: SprintId; from: number; to: number },
    { sprintId: SprintId; from: number; to: number }
  >;
  addTasksToSprint: Action<
    { sprintId: SprintId; tasks: (TaskId | { id: TaskId; index: number })[] },
    { addedTasks: { id: TaskId; index: number }[] }
  >;
  removeTasksFromSprint: Action<
    { sprintId: SprintId; tasks: TaskId[] },
    { removedTasks: { id: TaskId; index: number }[] }
  >;
  moveTasksBetweenSprints: Action<
    {
      sourceSprint: SprintId;
      targetSprint: SprintId;
      targetIndex?: number;
      tasks: TaskId[];
    },
    {
      sourceIndex?: number;
    }
  >;

  reset: () => void;
}

export const useSessionPlanningState = create<SessionPlanningState>()(
  persist(
    (set) => ({
      ready: false,
      tasks: [],
      sprints: [],

      addTasks: (tasks, onSuccess) => {
        const addedTasks = new Array<{ id: TaskId; index: number }>();
        set((state) => {
          return {
            ...state,
            tasks: tasks.reduce((acc, task) => {
              const { id, index } =
                typeof task === "object"
                  ? task
                  : { id: task, index: undefined };
              if (acc.includes(id)) return acc;
              if (index !== undefined) {
                acc.splice(index, 0, id);
                addedTasks.push({ id, index });
              } else {
                acc.push(id);
                addedTasks.push({ id, index: acc.length - 1 });
              }

              return acc;
            }, state.tasks),
          };
        });
        onSuccess?.({ addedTasks });
      },

      // Remove tasks from master list and all sprints
      removeTasks: (ids, onSuccess) => {
        const removedFromMaster = new Array<{
          id: TaskId;
          index: number;
        }>();
        const removedFromSprints = new Array<{
          sprintId: SprintId;
          tasks: { id: TaskId; index: number }[];
        }>();

        set((state) => {
          return {
            tasks: state.tasks.filter((t, index) => {
              if (!ids.includes(t)) return true;
              removedFromMaster.push({ id: t, index });
              return false;
            }),
            sprints: state.sprints.map((sprint) => {
              const tasksToRemove = sprint.tasks.reduce(
                (acc, t, index) => {
                  if (!ids.includes(t)) return acc;
                  acc.push({ id: t, index });
                  return acc;
                },
                [] as { id: TaskId; index: number }[],
              );

              if (tasksToRemove.length === 0) return sprint;

              removedFromSprints.push({
                sprintId: sprint.id,
                tasks: tasksToRemove,
              });

              return {
                ...sprint,
                tasks: sprint.tasks.filter((t) => !ids.includes(t)),
              };
            }),
          };
        });
        onSuccess?.({ removedFromMaster, removedFromSprints });
      },

      // Create a new sprint
      createSprint: (sprintData, onSuccess) => {
        const id = nanoid();
        set((state) => ({
          ...state,
          sprints: [...state.sprints, { id, ...sprintData }],
        }));
        onSuccess?.({ id });
      },

      // Insert a sprint at a specific index
      insertSprint: ({ sprint, index }, onSuccess) => {
        set((state) => ({
          ...state,
          sprints: [
            ...state.sprints.slice(0, index),
            sprint,
            ...state.sprints.slice(index),
          ],
        }));
        onSuccess?.();
      },

      // Remove a sprint
      removeSprint: (id, onSuccess) => {
        let removedSprint: { sprint: SprintPlan; index: number } | undefined =
          undefined;
        set((state) => ({
          ...state,
          sprints: state.sprints.filter((s, index) => {
            if (s.id !== id) return;
            removedSprint = { sprint: s, index };
            return false;
          }),
        }));
        if (removedSprint === undefined)
          throw new Error(`removeSprint failed: sprint not found (id=${id})`);

        onSuccess?.(removedSprint);
      },

      // Reorder sprints
      reorderSprints: ({ from, to }, onSuccess) => {
        set((state) => ({
          ...state,
          sprints: arrayMove(state.sprints, from, to),
        }));
        onSuccess?.({ from, to });
      },

      // Update sprint fields
      updateSprint: ({ id, data }, onSuccess) => {
        let previous: Partial<SprintPlan> | undefined = undefined;
        set((state) => ({
          ...state,
          sprints: state.sprints.map((s) => {
            if (s.id !== id) return s;
            previous = pick(s, Object.keys(data));
            return { ...s, ...data };
          }),
        }));
        if (!previous)
          throw new Error(`updateSprint failed: sprint not found (id=${id})`);
        onSuccess?.({ id, previous });
      },

      // Reorder tasks within a sprint
      reorderSprintTasks: ({ sprintId, from, to }, onSuccess) => {
        set((state) => ({
          ...state,
          sprints: state.sprints.map((s) => {
            if (s.id !== sprintId) return s;
            return {
              ...s,
              tasks: arrayMove(s.tasks, from, to),
            };
          }),
        }));
        onSuccess?.({ sprintId, from, to });
      },

      // Add tasks to a sprint
      addTasksToSprint: ({ sprintId, tasks }, onSuccess) => {
        const addedTasks = new Array<{ id: TaskId; index: number }>();
        set((state) => {
          const validTasks = tasks.reduce<{ id: TaskId; index?: number }[]>(
            (acc, t) => {
              const { id, index } =
                typeof t === "object" ? t : { id: t, index: undefined };
              if (!state.tasks.includes(id)) return acc;

              return [...acc, { id, index }];
            },
            [],
          );
          return {
            ...state,
            sprints: state.sprints.map((s) => {
              if (s.id !== sprintId) return s;

              return {
                ...s,
                tasks: validTasks.reduce((acc, t) => {
                  if (t.index === undefined) {
                    addedTasks.push({ id: t.id, index: acc.length });
                    return [...acc, t.id];
                  }
                  addedTasks.push({ id: t.id, index: t.index });
                  acc.splice(t.index, 0, t.id);
                  return acc;
                }, s.tasks),
              };
            }),
          };
        });
        onSuccess?.({ addedTasks });
      },

      // Remove tasks from a sprint
      removeTasksFromSprint: ({ sprintId, tasks }, onSuccess) => {
        const removedTasks = new Array<{ id: TaskId; index: number }>();
        set((state) => ({
          ...state,
          sprints: state.sprints.map((s) => {
            if (s.id !== sprintId) return s;
            return {
              ...s,
              tasks: s.tasks.filter((t) => {
                if (!tasks.includes(t)) return true;
                removedTasks.push({ id: t, index: s.tasks.indexOf(t) });
                return false;
              }),
            };
          }),
        }));
        onSuccess?.({ removedTasks });
      },

      // Move task between sprints
      moveTasksBetweenSprints: (
        { sourceSprint, targetSprint, tasks, targetIndex },
        onSuccess,
      ) => {
        let sourceIndex: number | undefined = undefined;
        set((state) => {
          tasks.forEach((task) => {
            if (!state.tasks.includes(task))
              throw new Error(
                `moveTaskBetweenSprints failed: task not found (task=${task})`,
              );
          });

          if (sourceSprint === targetSprint)
            throw new Error(
              `moveTaskBetweenSprints failed: source and target sprints are the same (sourceSprint=${sourceSprint}, targetSprint=${targetSprint})`,
            );

          if (state.sprints.every((s) => s.id !== sourceSprint))
            throw new Error(
              `moveTaskBetweenSprints failed: source sprint not found (sourceSprint=${sourceSprint})`,
            );

          if (state.sprints.every((s) => s.id !== targetSprint))
            throw new Error(
              `moveTaskBetweenSprints failed: target sprint not found (targetSprint=${targetSprint})`,
            );

          return {
            ...state,
            sprints: state.sprints.map((s) => {
              if (s.id === sourceSprint)
                return {
                  ...s,
                  tasks: s.tasks.filter((t, index) => {
                    if (!tasks.includes(t)) return true;
                    if (targetIndex === undefined) sourceIndex = index;
                    return false;
                  }),
                };
              if (s.id === targetSprint)
                return {
                  ...s,
                  tasks: [
                    ...s.tasks.slice(0, targetIndex),
                    ...tasks,
                    ...s.tasks.slice(targetIndex),
                  ],
                };
              return s;
            }),
          };
        });
        onSuccess?.({ sourceIndex });
      },

      reset() {
        set({
          tasks: [],
          sprints: [],
        });
      },
    }),
    {
      name: "session-planning",
      storage: {
        getItem: (name) => {
          const storedValue = localStorage.getItem(name);
          if (!storedValue)
            return {
              version: undefined,
              state: {
                ready: true,
                tasks: new Array<TaskId>(),
                sprints: new Array<SprintPlan>(),
              },
            };
          const { state, version } =
            superjson.parse<StorageValue<Omit<SessionPlanningState, "ready">>>(
              storedValue,
            );

          return {
            version,
            state: {
              ...state,
              ready: true,
            },
          };
        },
        setItem: (key, { version, state: { ready: _ready, ...state } }) => {
          const storedValue = superjson.stringify({ version, state });
          localStorage.setItem(key, storedValue);
        },
        removeItem: (key) => {
          localStorage.removeItem(key);
        },
      },
    },
  ),
);
