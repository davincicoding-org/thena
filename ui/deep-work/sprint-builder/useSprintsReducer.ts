/* eslint-disable */
import { useReducer } from "react";

import type { Duration, SprintPlan } from "@/core/deep-work";
import type { FlatTask, TaskId } from "@/core/task-management";
import { isTaskIncluded } from "@/core/task-management";
import { createUniqueId } from "@/ui/utils";

// MARK: Actions

export type SprintPlannerAction =
  | {
      action: "ADD_SPRINT";
      payload: { duration?: Duration; tasks?: TaskId[] };
      callback?: (sprintId: SprintPlan["id"]) => void;
    }
  | {
      action: "ADD_SPRINTS";
      payload: { sprints: { duration?: Duration; tasks?: TaskId[] }[] };
    }
  | {
      action: "UPDATE_SPRINT";
      payload: {
        sprintId: SprintPlan["id"];
        updates: Partial<
          Pick<SprintPlan, "duration" | "scheduledStart" | "recoveryTime">
        >;
      };
    }
  | { action: "REORDER_SPRINTS"; payload: { order: number[] } }
  | { action: "DROP_SPRINT"; payload: { sprintId: string } }
  | { action: "ASSIGN_TASK"; payload: { sprintId: string; task: TaskId } }
  | {
      action: "ASSIGN_TASKS";
      payload: { sprintId: string | null; tasks: TaskId[] };
    }
  | {
      action: "UNASSIGN_TASK";
      payload: { sprintId: string; task: TaskId };
    }
  | {
      action: "UNASSIGN_TASKS";
      payload: { sprintId: string; tasks: TaskId[] };
    }
  | {
      action: "MOVE_TASKS";
      payload: {
        fromSprintId: string;
        toSprintId: string;
        tasks: TaskId[];
        insertIndex?: number;
      };
    }
  | {
      action: "REORDER_SPRINT_TASKS";
      payload: { sprintId: string; order: number[] };
    }
  | { action: "SET_SPRINTS"; payload: { sprints: SprintPlan[] } };

// MARK: Errors

export interface SprintsReducerError {
  code: SprintsReducerErrorCode;
  action: SprintPlannerAction;
}

export type SprintsReducerErrorCode =
  | "SPRINT_NOT_FOUND"
  | "SPRINT_NOT_PROVIDED"
  | "TASK_NOT_FOUND"
  | "TASK_NOT_PROVIDED"
  | "SUBTASK_NOT_FOUND"
  | "INVALID_TASK_SELECTION"
  | "INVALID_SPRINT_SELECTION";

// MARK: Hook

export interface SprintsReducerHookOptions {
  taskPool: FlatTask[];
  sprintDuration: Duration;
  onError?: (error: SprintsReducerError) => void;
}

export function useSprintsReducer(
  { taskPool, sprintDuration, onError }: SprintsReducerHookOptions,
  initialSprints: SprintPlan[] = [],
) {
  return useReducer<SprintPlan[], [SprintPlannerAction]>((state, action) => {
    // Helper for error handling
    const handleError = (code: SprintsReducerErrorCode) => {
      onError?.({
        code,
        action,
      });
      return false; // Return false to indicate an error occurred
    };

    // Check if sprint exists
    const sprintExists = (sprintId: string, sprints: SprintPlan[]): boolean =>
      sprints.some((sprint) => sprint.id === sprintId);

    switch (action.action) {
      case "ADD_SPRINT": {
        const { duration = sprintDuration, tasks = [] } = action.payload;

        const newSprintId = createUniqueId(state, 4);
        action.callback?.(newSprintId);

        return [
          ...state,
          {
            id: newSprintId,
            duration,
            tasks: tasks.filter((task) => isTaskIncluded(taskPool, task)),
          },
        ];
      }

      case "ADD_SPRINTS": {
        const { sprints: sprintsToAdd } = action.payload;

        return sprintsToAdd.reduce<SprintPlan[]>((acc, sprint) => {
          return [
            ...acc,
            {
              id: createUniqueId(acc, 4),
              duration: sprint.duration ?? sprintDuration,
              tasks: (sprint.tasks ?? []).reduce<SprintPlan["tasks"]>(
                (acc, taskId) => {
                  if (!isTaskIncluded(taskPool, taskId)) return acc;
                  return [...acc, taskId];
                },
                [],
              ),
            },
          ];
        }, state);
      }

      case "UPDATE_SPRINT": {
        const { sprintId, updates } = action.payload;

        if (!sprintExists(sprintId, state)) {
          handleError("SPRINT_NOT_FOUND");
          return state;
        }

        return state.map((sprint) => {
          if (sprint.id !== sprintId) return sprint;
          return { ...sprint, ...updates };
        });
      }

      case "REORDER_SPRINTS": {
        const { order } = action.payload;

        if (order.length !== state.length) {
          handleError("INVALID_SPRINT_SELECTION");
          return state;
        }

        // Checks if the provided order includes ascending indexes starting from 0
        if (![...order].sort().every((number, index) => number === index)) {
          handleError("INVALID_SPRINT_SELECTION");
          return state;
        }

        return order.map((index) => {
          const matchedSprint = state[index];
          // Should not happen, since we already validated the order above
          if (!matchedSprint) throw new Error("SPRINT_NOT_FOUND");
          return matchedSprint;
        });
      }

      case "DROP_SPRINT": {
        const { sprintId } = action.payload;
        return state.filter((sprint) => sprint.id !== sprintId);
      }

      case "ASSIGN_TASK": {
        const { sprintId, task } = action.payload;

        if (!sprintExists(sprintId, state)) {
          handleError("SPRINT_NOT_FOUND");
          return state;
        }

        if (!isTaskIncluded(taskPool, task)) return state;

        return state.map((sprint) => {
          if (sprint.id !== sprintId) return sprint;

          return {
            ...sprint,
            tasks: [...sprint.tasks, task],
          };
        });
      }

      case "ASSIGN_TASKS": {
        const { sprintId, tasks } = action.payload;

        if (sprintId && !sprintExists(sprintId, state)) {
          handleError("SPRINT_NOT_FOUND");
          return state;
        }

        const validTaskReferences = tasks.filter((taskId) =>
          isTaskIncluded(taskPool, taskId),
        );
        if (!validTaskReferences.length) return state;

        if (sprintId === null) {
          return [
            ...state,
            {
              id: createUniqueId(state, 4),
              duration: sprintDuration,
              tasks: validTaskReferences,
            },
          ];
        }

        return state.map((sprint) => {
          if (sprint.id !== sprintId) return sprint;

          return {
            ...sprint,
            tasks: validTaskReferences.reduce<SprintPlan["tasks"]>(
              (acc, task) => {
                const indexToInsert = acc.findLastIndex(
                  (taskId) => taskId === task,
                );
                if (indexToInsert === -1) return [...acc, task];

                return [
                  ...acc.slice(0, indexToInsert),
                  task,
                  ...acc.slice(indexToInsert),
                ];
              },
              sprint.tasks,
            ),
          };
        });
      }

      case "UNASSIGN_TASK": {
        const { sprintId, task: taskToExclude } = action.payload;

        if (!sprintExists(sprintId, state)) {
          handleError("SPRINT_NOT_FOUND");
          return state;
        }

        return state.map((sprint) => {
          if (sprint.id !== sprintId) return sprint;

          return {
            ...sprint,
            tasks: sprint.tasks.filter((task) => task !== taskToExclude),
          };
        });
      }

      case "UNASSIGN_TASKS": {
        const { sprintId, tasks: tasksToExclude } = action.payload;

        if (!sprintExists(sprintId, state)) {
          handleError("SPRINT_NOT_FOUND");
          return state;
        }

        return state.map((sprint) => {
          if (sprint.id !== sprintId) return sprint;

          return {
            ...sprint,
            tasks: sprint.tasks.filter(
              (task) => !tasksToExclude.includes(task),
            ),
          };
        });
      }

      case "MOVE_TASKS": {
        const { fromSprintId, toSprintId, tasks, insertIndex } = action.payload;

        if (!sprintExists(fromSprintId, state)) {
          handleError("SPRINT_NOT_FOUND");
          return state;
        }

        if (!sprintExists(toSprintId, state)) {
          handleError("SPRINT_NOT_FOUND");
          return state;
        }

        const validTaskReferences = tasks.filter((task) =>
          isTaskIncluded(taskPool, task),
        );
        if (!validTaskReferences.length) return state;

        return state.map((sprint) => {
          // Remove tasks from source sprint
          if (sprint.id === fromSprintId)
            return {
              ...sprint,
              tasks: sprint.tasks.filter(
                (task) => !validTaskReferences.includes(task),
              ),
            };

          // Add tasks to destination sprint
          if (sprint.id === toSprintId) {
            const indexToInsert = insertIndex ?? sprint.tasks.length;

            return {
              ...sprint,
              tasks: [
                ...sprint.tasks.slice(0, indexToInsert),
                ...validTaskReferences,
                ...sprint.tasks.slice(indexToInsert),
              ],
            };
          }

          // Leave other sprints unchanged
          return sprint;
        });
      }

      case "REORDER_SPRINT_TASKS": {
        const { sprintId, order } = action.payload;

        const sprintToAdjust = state.find((sprint) => sprint.id === sprintId);
        if (!sprintToAdjust) {
          handleError("SPRINT_NOT_FOUND");
          return state;
        }

        if (sprintToAdjust.tasks.length !== order.length) {
          handleError("INVALID_TASK_SELECTION");
          return state;
        }

        // Checks if the provided order includes ascending indexes starting from 0
        if (![...order].sort().every((number, index) => number === index)) {
          handleError("INVALID_TASK_SELECTION");
          return state;
        }

        return state.map((sprint) => {
          if (sprint.id !== sprintId) return sprint;

          return {
            ...sprint,
            tasks: order.map((index) => {
              const matchedTask = sprint.tasks[index];
              // Should not happen, since we already validated the order above
              if (!matchedTask) throw new Error("TASK_NOT_FOUND");
              return matchedTask;
            }),
          };
        });
      }

      case "SET_SPRINTS": {
        return action.payload.sprints;
      }

      default:
        return state;
    }
  }, initialSprints);
}
