import { useReducer } from "react";
import { groupBy } from "lodash-es";

import { MinimalSprintPlan, SprintPlan } from "@/core/deep-work";
import {
  excludeTaskSelection,
  mergeTaskSelections,
  resolveTaskSelection,
  Task,
  TaskSelection,
} from "@/core/task-management";
import { createUniqueId } from "@/ui/utils";

// MARK: Actions

type SprintPlannerAction =
  | {
      type: "ADD_SPRINT";
      payload: { duration?: number; tasks?: TaskSelection[] };
      callback?: (sprintId: MinimalSprintPlan["id"]) => void;
    }
  | {
      type: "ADD_SPRINTS";
      payload: { sprints: { duration?: number; tasks?: TaskSelection[] }[] };
    }
  | {
      type: "UPDATE_SPRINT";
      payload: {
        sprintId: string;
        updates: Partial<Pick<MinimalSprintPlan, "duration">>;
      };
    }
  | { type: "REORDER_SPRINTS"; payload: { sprintIds: string[] } }
  | { type: "DROP_SPRINT"; payload: { sprintId: string } }
  | { type: "ASSIGN_TASK"; payload: { sprintId: string; task: TaskSelection } }
  | {
      type: "ASSIGN_TASKS";
      payload: { sprintId: string; tasks: TaskSelection[] };
    }
  | {
      type: "UNASSIGN_TASK";
      payload: { sprintId: string; task: TaskSelection };
    }
  | {
      type: "UNASSIGN_TASKS";
      payload: { sprintId: string; tasks: TaskSelection[] };
    }
  | {
      type: "MOVE_TASKS";
      payload: {
        fromSprintId: string;
        toSprintId: string;
        tasks: TaskSelection[];
      };
    }
  | {
      type: "REORDER_SPRINT_TASKS";
      payload: { sprintId: string; taskIds: string[] };
    }
  | { type: "SET_SPRINTS"; payload: { sprints: MinimalSprintPlan[] } };

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
  // TODO Maybe these should be the unassigned tasks
  taskPool: Task[];
  sprintDuration: number;
  onError?: (error: SprintsReducerError) => void;
}

export function useSprintsReducer(
  { taskPool, sprintDuration, onError }: SprintsReducerHookOptions,
  initialSprints: MinimalSprintPlan[] = [],
) {
  return useReducer<MinimalSprintPlan[], [SprintPlannerAction]>(
    (state, action) => {
      // Helper for error handling
      const handleError = (code: SprintsReducerErrorCode) => {
        onError?.({
          code,
          action,
        });
        return false; // Return false to indicate an error occurred
      };

      // Check if sprint exists
      const sprintExists = (
        sprintId: string,
        sprints: MinimalSprintPlan[],
      ): boolean => sprints.some((sprint) => sprint.id === sprintId);

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
              tasks: tasks.reduce<TaskSelection[]>((acc, task) => {
                const resolvedSelection = resolveTaskSelection(task, taskPool);
                if (!resolvedSelection) return acc;
                return mergeTaskSelections([...acc, resolvedSelection]);
              }, []),
            },
          ];
        }

        case "ADD_SPRINTS": {
          const { sprints: sprintsToAdd } = action.payload;

          return sprintsToAdd.reduce<MinimalSprintPlan[]>((acc, sprint) => {
            return [
              ...acc,
              {
                id: createUniqueId(acc, 4),
                duration: sprint.duration || sprintDuration,
                tasks: (sprint.tasks || []).reduce<TaskSelection[]>(
                  (acc, task) => {
                    const resolvedSelection = resolveTaskSelection(
                      task,
                      taskPool,
                    );
                    if (!resolvedSelection) return acc;
                    return mergeTaskSelections([...acc, resolvedSelection]);
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
            invalidSprintIds.forEach((id) => handleError("SPRINT_NOT_FOUND"));
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
            missingSprintIds.forEach((id) =>
              handleError("SPRINT_NOT_PROVIDED"),
            );
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

          const resolvedSelection = resolveTaskSelection(task, taskPool);
          if (!resolvedSelection) return state;

          return state.map((sprint) => {
            if (sprint.id !== sprintId) return sprint;

            return {
              ...sprint,
              tasks: mergeTaskSelections([...sprint.tasks, resolvedSelection]),
            };
          });
        }

        case "ASSIGN_TASKS": {
          const { sprintId, tasks } = action.payload;

          if (!sprintExists(sprintId, state)) {
            handleError("SPRINT_NOT_FOUND");
            return state;
          }

          const resolvedSelections = tasks.reduce<TaskSelection[]>(
            (acc, task) => {
              const resolvedSelection = resolveTaskSelection(task, taskPool);
              if (!resolvedSelection) return acc;
              return [...acc, resolvedSelection];
            },
            [],
          );

          return state.map((sprint) => {
            if (sprint.id !== sprintId) return sprint;

            return {
              ...sprint,
              tasks: mergeTaskSelections([
                ...sprint.tasks,
                ...resolvedSelections,
              ]),
            };
          });
        }

        case "UNASSIGN_TASK": {
          const { sprintId, task } = action.payload;

          if (!sprintExists(sprintId, state)) {
            handleError("SPRINT_NOT_FOUND");
            return state;
          }

          return state.map((sprint) => {
            if (sprint.id !== sprintId) return sprint;

            return {
              ...sprint,
              tasks: excludeTaskSelection([...sprint.tasks], task),
            };
          });
        }

        case "UNASSIGN_TASKS": {
          const { sprintId, tasks } = action.payload;

          if (!sprintExists(sprintId, state)) {
            handleError("SPRINT_NOT_FOUND");
            return state;
          }

          return state.map((sprint) => {
            if (sprint.id !== sprintId) return sprint;

            return {
              ...sprint,
              tasks: tasks.reduce<TaskSelection[]>(
                (acc, task) => excludeTaskSelection([...acc], task),
                sprint.tasks,
              ),
            };
          });
        }

        case "MOVE_TASKS": {
          const { fromSprintId, toSprintId, tasks } = action.payload;

          if (!sprintExists(fromSprintId, state)) {
            handleError("SPRINT_NOT_FOUND");
            return state;
          }

          if (!sprintExists(toSprintId, state)) {
            handleError("SPRINT_NOT_FOUND");
            return state;
          }

          const resolvedTaskSelections = tasks.reduce<TaskSelection[]>(
            (acc, task) => {
              const resolvedTask = resolveTaskSelection(task, taskPool);
              if (!resolvedTask) return acc;
              return mergeTaskSelections([...acc, resolvedTask]);
            },
            [],
          );

          return state.map((sprint) => {
            // Remove tasks from source sprint
            if (sprint.id === fromSprintId)
              return {
                ...sprint,
                tasks: tasks.reduce<TaskSelection[]>(
                  (acc, task) => excludeTaskSelection([...acc], task),
                  sprint.tasks,
                ),
              };

            // Add tasks to destination sprint
            if (sprint.id === toSprintId)
              return {
                ...sprint,
                tasks: mergeTaskSelections([
                  ...sprint.tasks,
                  ...resolvedTaskSelections,
                ]),
              };

            // Leave other sprints unchanged
            return sprint;
          });
        }

        case "REORDER_SPRINT_TASKS": {
          const { sprintId, taskIds } = action.payload;

          if (!taskIds.length) return state;

          const sprintToAdjust = state.find((sprint) => sprint.id === sprintId);
          if (!sprintToAdjust) {
            handleError("SPRINT_NOT_FOUND");
            return state;
          }

          const missingTaskIds = sprintToAdjust.tasks.reduce<Task["id"][]>(
            (acc, { taskId }) => {
              if (taskIds.includes(taskId)) return acc;
              return [...acc, taskId];
            },
            [],
          );

          if (missingTaskIds.length > 0) {
            missingTaskIds.forEach((id) => handleError("TASK_NOT_PROVIDED"));
            return state;
          }

          return state.map((sprint) => {
            if (sprint.id !== sprintId) return sprint;

            return {
              ...sprint,
              tasks: [...sprint.tasks].sort((a, b) => {
                const aIndex = taskIds.indexOf(a.taskId);
                const bIndex = taskIds.indexOf(b.taskId);
                return aIndex - bIndex;
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
    },
    initialSprints,
  );
}
