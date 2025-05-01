import { useReducer } from "react";

import type { Duration, SprintPlan } from "@/core/deep-work";
import type { FlatTask, TaskReference } from "@/core/task-management";
import {
  doesTaskReferenceExist,
  excludeTaskReferences,
} from "@/core/task-management";
import { createUniqueId } from "@/ui/utils";

// MARK: Actions

type SprintPlannerAction =
  | {
      type: "ADD_SPRINT";
      payload: { duration?: Duration; tasks?: TaskReference[] };
      callback?: (sprintId: SprintPlan["id"]) => void;
    }
  | {
      type: "ADD_SPRINTS";
      payload: { sprints: { duration?: Duration; tasks?: TaskReference[] }[] };
    }
  | {
      type: "UPDATE_SPRINT";
      payload: {
        sprintId: string;
        updates: Partial<Pick<SprintPlan, "duration">>;
      };
    }
  | { type: "REORDER_SPRINTS"; payload: { sprintIds: string[] } }
  | { type: "DROP_SPRINT"; payload: { sprintId: string } }
  | { type: "ASSIGN_TASK"; payload: { sprintId: string; task: TaskReference } }
  | {
      type: "ASSIGN_TASKS";
      payload: { sprintId: string | null; tasks: TaskReference[] };
    }
  | {
      type: "UNASSIGN_TASK";
      payload: { sprintId: string; task: TaskReference };
    }
  | {
      type: "UNASSIGN_TASKS";
      payload: { sprintId: string; tasks: TaskReference[] };
    }
  | {
      type: "MOVE_TASKS";
      payload: {
        fromSprintId: string;
        toSprintId: string;
        tasks: TaskReference[];
        insertIndex?: number;
      };
    }
  | {
      type: "REORDER_SPRINT_TASKS";
      payload: { sprintId: string; order: number[] };
    }
  | { type: "SET_SPRINTS"; payload: { sprints: SprintPlan[] } };

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
  | "INVALID_TASK_SELECTION";

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

    switch (action.type) {
      case "ADD_SPRINT": {
        const { duration = sprintDuration, tasks = [] } = action.payload;

        const newSprintId = createUniqueId(state, 4);
        action.callback?.(newSprintId);

        return [
          ...state,
          {
            id: newSprintId,
            duration,
            tasks: tasks.reduce<SprintPlan["tasks"]>((acc, task) => {
              if (!doesTaskReferenceExist(task, taskPool)) return acc;
              return [...acc, task];
            }, []),
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
                (acc, task) => {
                  if (!doesTaskReferenceExist(task, taskPool)) return acc;
                  return [...acc, task];
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
        const { sprintIds } = action.payload;

        // Verify all sprint IDs exist
        const invalidSprintIds = sprintIds.filter(
          (id) => !sprintExists(id, state),
        );

        if (invalidSprintIds.length) {
          invalidSprintIds.forEach(() => handleError("SPRINT_NOT_FOUND"));
          return state;
        }

        // Verify all sprints are included in the update
        const missingSprintIds = state.reduce<SprintPlan["id"][]>(
          (acc, sprint) => {
            if (sprintIds.includes(sprint.id)) return acc;
            return [...acc, sprint.id];
          },
          [],
        );

        // If we're not rearranging all sprints, do nothing
        if (missingSprintIds.length) {
          missingSprintIds.forEach(() => handleError("SPRINT_NOT_PROVIDED"));
          return state;
        }

        return [...state].sort((a, b) => {
          const aIndex = sprintIds.indexOf(a.id);
          const bIndex = sprintIds.indexOf(b.id);
          return aIndex - bIndex;
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

        if (!doesTaskReferenceExist(task, taskPool)) return state;

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

        const validTaskReferences = tasks.filter((task) =>
          doesTaskReferenceExist(task, taskPool),
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
                  ({ taskId }) => taskId === task.taskId,
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
            tasks: excludeTaskReferences(sprint.tasks, [taskToExclude]),
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
            tasks: excludeTaskReferences(sprint.tasks, tasksToExclude),
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
          doesTaskReferenceExist(task, taskPool),
        );
        if (!validTaskReferences.length) return state;

        return state.map((sprint) => {
          // Remove tasks from source sprint
          if (sprint.id === fromSprintId)
            return {
              ...sprint,
              tasks: excludeTaskReferences(sprint.tasks, validTaskReferences),
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
