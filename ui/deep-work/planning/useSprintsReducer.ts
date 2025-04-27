import { useReducer } from "react";
import { nanoid } from "nanoid";

import { SprintPlan } from "@/core/deep-work";
import {
  excludeTask,
  mergeTasks,
  Task,
  TaskSelection,
} from "@/core/task-management";

// MARK: Actions

type SprintPlannerAction =
  | {
      type: "ADD_SPRINT";
      payload: { duration?: number; tasks?: TaskSelection[] };
      callback?: (sprintId: SprintPlan["id"]) => void;
    }
  | {
      type: "ADD_SPRINTS";
      payload: { sprints: { duration?: number; tasks?: TaskSelection[] }[] };
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
  taskPool: Task[];
  sprintDuration: number;
  onError?: (error: SprintsReducerError) => void;
}

export function useSprintsReducer(
  { taskPool, sprintDuration, onError }: SprintsReducerHookOptions,
  initialSprints: SprintPlan[] = [],
) {
  return useReducer<SprintPlan[], [SprintPlannerAction]>((state, action) => {
    // Helper for resolving tasks
    const resolveTask = (taskSelection: TaskSelection): Task | null => {
      const fullTask = taskPool.find((t) => t.id === taskSelection.taskId);
      if (!fullTask) return null;

      // If there are no subtask selections, return the full task
      if (!taskSelection.subtasks?.length) return fullTask;

      // If there are subtask selections, filter the subtasks
      if (fullTask.subtasks?.length)
        return {
          ...fullTask,
          subtasks: fullTask.subtasks.filter((subtask) =>
            taskSelection.subtasks?.includes(subtask.id),
          ),
        };

      // If the task doesn't have subtasks but we have subtask selections
      // (shouldn't happen), return the full task
      return fullTask;
    };

    // Helper for error handling
    const handleError = (
      code: SprintsReducerErrorCode,
      actionName: string,
      details?: Record<string, unknown>,
    ) => {
      onError?.({
        code,
        action: actionName as any,
      });
      return false; // Return false to indicate an error occurred
    };

    // Check if sprint exists
    const sprintExists = (sprintId: string, sprints: SprintPlan[]): boolean =>
      sprints.some((sprint) => sprint.id === sprintId);

    switch (action.type) {
      case "ADD_SPRINT": {
        const { duration = sprintDuration, tasks = [] } = action.payload;

        const newSprintId = nanoid();
        action.callback?.(newSprintId);
        return [
          ...state,
          {
            id: newSprintId,
            duration,
            tasks: tasks.reduce<Task[]>((acc, task) => {
              const resolvedTask = resolveTask(task);
              if (!resolvedTask) return acc;
              return [...acc, resolvedTask];
            }, []),
          },
        ];
      }

      case "ADD_SPRINTS": {
        const { sprints: sprintsToAdd } = action.payload;

        return [
          ...state,
          ...sprintsToAdd.map(({ duration = sprintDuration, tasks = [] }) => ({
            id: nanoid(),
            duration,
            tasks: tasks.reduce<Task[]>((acc, task) => {
              const resolvedTask = resolveTask(task);
              if (!resolvedTask) return acc;
              return [...acc, resolvedTask];
            }, []),
          })),
        ];
      }

      case "UPDATE_SPRINT": {
        const { sprintId, updates } = action.payload;

        if (!sprintExists(sprintId, state)) {
          handleError("SPRINT_NOT_FOUND", "updateSprint", { sprintId });
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
          invalidSprintIds.forEach((id) =>
            handleError("SPRINT_NOT_FOUND", "reorderSprints", {
              sprintId: id,
            }),
          );
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
            handleError("SPRINT_NOT_PROVIDED", "reorderSprints", {
              sprintId: id,
            }),
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
          handleError("SPRINT_NOT_FOUND", "assignTask", { sprintId });
          return state;
        }

        const resolvedTask = resolveTask(task);
        if (!resolvedTask) return state;

        return state.map((sprint) => {
          if (sprint.id !== sprintId) return sprint;

          return {
            ...sprint,
            tasks: mergeTasks([...sprint.tasks, resolvedTask]),
          };
        });
      }

      case "ASSIGN_TASKS": {
        const { sprintId, tasks } = action.payload;

        if (!sprintExists(sprintId, state)) {
          handleError("SPRINT_NOT_FOUND", "assignTasks", { sprintId });
          return state;
        }

        const resolvedTasks = tasks.reduce<Task[]>((acc, task) => {
          const resolvedTask = resolveTask(task);
          if (!resolvedTask) return acc;
          return [...acc, resolvedTask];
        }, []);

        return state.map((sprint) => {
          if (sprint.id !== sprintId) return sprint;

          return {
            ...sprint,
            tasks: mergeTasks([...sprint.tasks, ...resolvedTasks]),
          };
        });
      }

      case "UNASSIGN_TASK": {
        const { sprintId, task } = action.payload;

        if (!sprintExists(sprintId, state)) {
          handleError("SPRINT_NOT_FOUND", "unassignTask", { sprintId });
          return state;
        }

        return state.map((sprint) => {
          if (sprint.id !== sprintId) return sprint;

          return {
            ...sprint,
            tasks: excludeTask([...sprint.tasks], task),
          };
        });
      }

      case "UNASSIGN_TASKS": {
        const { sprintId, tasks } = action.payload;

        if (!sprintExists(sprintId, state)) {
          handleError("SPRINT_NOT_FOUND", "unassignTasks", { sprintId });
          return state;
        }

        return state.map((sprint) => {
          if (sprint.id !== sprintId) return sprint;

          return {
            ...sprint,
            tasks: tasks.reduce<Task[]>(
              (acc, task) => excludeTask([...acc], task),
              sprint.tasks,
            ),
          };
        });
      }

      case "MOVE_TASKS": {
        const { fromSprintId, toSprintId, tasks } = action.payload;

        if (!sprintExists(fromSprintId, state)) {
          handleError("SPRINT_NOT_FOUND", "moveTasks", { fromSprintId });
          return state;
        }

        if (!sprintExists(toSprintId, state)) {
          handleError("SPRINT_NOT_FOUND", "moveTasks", { toSprintId });
          return state;
        }

        const resolvedTasks = tasks.reduce<Task[]>((acc, task) => {
          const resolvedTask = resolveTask(task);
          if (!resolvedTask) return acc;
          return [...acc, resolvedTask];
        }, []);

        return state.map((sprint) => {
          // Remove tasks from source sprint
          if (sprint.id === fromSprintId)
            return {
              ...sprint,
              tasks: tasks.reduce<Task[]>(
                (acc, task) => excludeTask([...acc], task),
                sprint.tasks,
              ),
            };

          // Add tasks to destination sprint
          if (sprint.id === toSprintId)
            return {
              ...sprint,
              tasks: mergeTasks([...sprint.tasks, ...resolvedTasks]),
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
          handleError("SPRINT_NOT_FOUND", "reorderSprintTasks", {
            sprintId,
          });
          return state;
        }

        const missingTaskIds = sprintToAdjust.tasks.reduce<Task["id"][]>(
          (acc, task) => {
            if (taskIds.includes(task.id)) return acc;
            return [...acc, task.id];
          },
          [],
        );

        if (missingTaskIds.length > 0) {
          missingTaskIds.forEach((id) =>
            handleError("TASK_NOT_PROVIDED", "reorderSprintTasks", {
              sprintId,
              taskId: id,
            }),
          );
          return state;
        }

        return state.map((sprint) => {
          if (sprint.id !== sprintId) return sprint;

          return {
            ...sprint,
            tasks: [...sprint.tasks].sort((a, b) => {
              const aIndex = taskIds.indexOf(a.id);
              const bIndex = taskIds.indexOf(b.id);
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
  }, initialSprints);
}
