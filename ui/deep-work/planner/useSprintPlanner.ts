import { useMemo, useState } from "react";
import { nanoid } from "nanoid";

import { SprintPlan, TaskSelection } from "@/core/deep-work";
import { hasSubtasks, Task } from "@/core/task-management";

export const DEFAULT_OPTIONS: Required<SessionPlannerHookOptions> = {
  sprintCount: 0,
  sprintDuration: 25,
  onError: () => {},
};

export interface SessionPlannerHookOptions {
  /** Initial number of Sprints */
  sprintCount?: number;
  /** Default duration for new Sprints */
  sprintDuration?: number;
  /** Error callback for handling errors without throwing */
  onError?: (error: SprintPlannerError) => void;
}

// Define a sprint plan with task selections
interface MinimalSprint extends Pick<SprintPlan, "id" | "duration"> {
  tasks: TaskSelection[];
}

export interface SessionPlannerHookReturn {
  /** All current Sprint plans (with populated tasks) */
  sprints: SprintPlan[];

  /** Tasks not yet assigned to any Sprint */
  unassignedTasks: Task[];

  /** Initialize `count` empty Sprints */
  initialize: (options: SessionPlannerHookOptions) => void;

  /** Add a new empty Sprint, using optional duration */
  addSprint: (sprintToAdd: {
    duration?: number;
    tasks?: TaskSelection[];
  }) => void;

  /** Add multiple Sprints at once */
  addSprints: (
    sprintsToAdd: {
      duration?: number;
      tasks?: TaskSelection[];
    }[],
  ) => void;

  /** Update sprint meta data */
  updateSprint: (
    sprintId: SprintPlan["id"],
    updates: Partial<Pick<SprintPlan, "duration">>,
  ) => void;

  /** Reorder Sprints (for drag‑and‑drop UIs) */
  reorderSprints: (sprintIds: SprintPlan["id"][]) => void;

  /** Delete a Sprint */
  dropSprint: (sprintId: SprintPlan["id"]) => void;

  /** Assign one of the tasks into a Sprint */
  assignTask: (options: {
    sprintId: SprintPlan["id"];
    task: TaskSelection;
  }) => void;

  /** Assign multiple tasks into a Sprint */
  assignTasks: (options: {
    sprintId: SprintPlan["id"];
    tasks: TaskSelection[];
  }) => void;

  /** Unassign one of the Sprint's tasks */
  unassignTask: (options: {
    sprintId: SprintPlan["id"];
    task: TaskSelection;
  }) => void;

  /** Unassign multiple of the Sprint's tasks */
  unassignTasks: (options: {
    sprintId: SprintPlan["id"];
    tasks: TaskSelection[];
  }) => void;

  /** Move tasks between two Sprints */
  moveTasks: (options: {
    fromSprintId: SprintPlan["id"];
    toSprintId: SprintPlan["id"];
    tasks: TaskSelection[];
  }) => void;

  /** Reorder tasks within a Sprint (for drag‑and‑drop UIs) */
  reorderSprintTasks: (sprintId: SprintPlan["id"], tasks: Task["id"][]) => void;
}

/**
 * Provides in-memory sprint planning: initialize Sprints, adjust durations, and reorder sprints and tasks.
 */
export function useSessionPlanner(
  taskPool: Task[],
  {
    sprintCount = DEFAULT_OPTIONS.sprintCount,
    sprintDuration = DEFAULT_OPTIONS.sprintDuration,
    onError = DEFAULT_OPTIONS.onError,
  }: SessionPlannerHookOptions = DEFAULT_OPTIONS,
): SessionPlannerHookReturn {
  // ------ Initialization ------
  const [sprints, setSprints] = useState<MinimalSprint[]>(
    Array.from(
      { length: sprintCount },
      (): MinimalSprint => ({
        id: nanoid(),
        duration: sprintDuration,
        tasks: [],
      }),
    ),
  );

  const unassignedTasks = useMemo(() => {
    const assignedTasks = mergeTasks(sprints.flatMap((sprint) => sprint.tasks));

    return taskPool.reduce<Task[]>((acc, task) => {
      const assignedTask = assignedTasks.find(
        (assignedTask) => assignedTask.taskId === task.id,
      );
      if (!assignedTask) return [...acc, task];

      if (!hasSubtasks(task) || !hasSubtasks(assignedTask)) return acc;

      const taskWithoutAssignedSubtasks = {
        ...task,
        subtasks: task.subtasks.filter(
          (subtask) => !assignedTask.subtasks?.includes(subtask.id),
        ),
      };

      if (!taskWithoutAssignedSubtasks.subtasks?.length) return acc;

      return [...acc, taskWithoutAssignedSubtasks];
    }, []);
  }, [taskPool, sprints]);

  const initialize: SessionPlannerHookReturn["initialize"] = ({
    sprintCount = DEFAULT_OPTIONS.sprintCount,
    sprintDuration = DEFAULT_OPTIONS.sprintDuration,
  }) =>
    setSprints(
      Array.from(
        { length: sprintCount },
        (): MinimalSprint => ({
          id: nanoid(),
          duration: sprintDuration,
          tasks: [],
        }),
      ),
    );

  // ------ Helpers ------
  const handleError = (
    code: SprintPlannerErrorCode,
    action: SprintPlannerAction,
    details?: Record<string, unknown>,
  ) => {
    onError({
      code,
      action,
      details,
    });
    return false; // Return false to indicate an error occurred
  };

  // ------ Sprint Management ------

  const populatedSprints = useMemo<SessionPlannerHookReturn["sprints"]>(
    () =>
      sprints.map((sprint: MinimalSprint): SprintPlan => {
        const populatedTasks = sprint.tasks
          .map((taskSelection) => {
            // Find the full task from the pool
            const fullTask = taskPool.find(
              (t) => t.id === taskSelection.taskId,
            );
            if (!fullTask) {
              // This should never happen if taskPool contains all tasks
              console.warn(
                `Task ${taskSelection.taskId} not found in task pool`,
              );
              return null;
            }

            // If there are no subtask selections, return the full task
            if (!taskSelection.subtasks?.length) {
              return fullTask;
            }

            // If there are subtask selections, filter the subtasks
            if (fullTask.subtasks?.length) {
              return {
                ...fullTask,
                subtasks: fullTask.subtasks.filter((subtask) =>
                  taskSelection.subtasks?.includes(subtask.id),
                ),
              };
            }

            // If the task doesn't have subtasks but we have subtask selections
            // (shouldn't happen), return the full task
            return fullTask;
          })
          .filter(Boolean) as Task[];

        return {
          ...sprint,
          tasks: populatedTasks,
        };
      }),
    [sprints, taskPool],
  );

  const addSprint: SessionPlannerHookReturn["addSprint"] = ({
    duration = sprintDuration,
    tasks = [],
  }) => {
    // TODO: Validate task (and its subtasks) are not assigned yet

    setSprints((prev) => [
      ...prev,
      {
        id: nanoid(),
        duration,
        tasks,
      },
    ]);
  };

  const addSprints: SessionPlannerHookReturn["addSprints"] = (sprintsToAdd) => {
    // TODO check if tasks are valid
    setSprints((prev) => [
      ...prev,
      ...sprintsToAdd.map(({ duration = sprintDuration, tasks = [] }) => ({
        id: nanoid(),
        duration,
        tasks,
      })),
    ]);
  };

  const updateSprint: SessionPlannerHookReturn["updateSprint"] = (
    sprintId,
    updates,
  ) =>
    setSprints((prev) => {
      if (!sprintExists(sprintId, prev)) {
        handleError("SPRINT_NOT_FOUND", "updateSprint", { sprintId });
        return prev;
      }

      return prev.map((sprint) => {
        if (sprint.id !== sprintId) return sprint;

        return { ...sprint, ...updates };
      });
    });

  const reorderSprints: SessionPlannerHookReturn["reorderSprints"] = (
    sprintIds,
  ) => {
    setSprints((currentSprints) => {
      // Verify all sprint IDs exist
      const invalidSprintIds = sprintIds.filter(
        (id) => !sprintExists(id, currentSprints),
      );
      if (invalidSprintIds.length) {
        invalidSprintIds.forEach((id) =>
          handleError("SPRINT_NOT_FOUND", "reorderSprints", {
            sprintId: id,
          }),
        );
        return currentSprints;
      }

      // Verify all sprints are included in the update
      const missingSprintIds = currentSprints.reduce<SprintPlan["id"][]>(
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
        return currentSprints;
      }

      return [...currentSprints].sort((a, b) => {
        const aIndex = sprintIds.indexOf(a.id);
        const bIndex = sprintIds.indexOf(b.id);
        return aIndex - bIndex;
      });
    });
  };

  const reorderSprintTasks: SessionPlannerHookReturn["reorderSprintTasks"] = (
    sprintId,
    taskIds,
  ) => {
    if (!taskIds.length) return;

    setSprints((prev) => {
      const sprintToAdjust = findSprint(sprintId, prev);
      if (!sprintToAdjust) {
        handleError("SPRINT_NOT_FOUND", "reorderSprintTasks", {
          sprintId,
        });
        return prev;
      }

      const missingTaskIds = sprintToAdjust.tasks.reduce<Task["id"][]>(
        (acc, task) => {
          if (taskIds.includes(task.taskId)) return acc;
          return [...acc, task.taskId];
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
        return prev;
      }

      return prev.map((sprint) => {
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
    });
  };

  const dropSprint: SessionPlannerHookReturn["dropSprint"] = (sprintId) =>
    setSprints((currentSprints) =>
      currentSprints.filter((sprint) => sprint.id !== sprintId),
    );

  // ------ Task Assignment ------

  // Compute unassigned tasks as a derived value

  const assignTask: SessionPlannerHookReturn["assignTask"] = ({
    sprintId,
    task,
  }) => {
    setSprints((prevSprints) => {
      if (!sprintExists(sprintId, prevSprints)) {
        handleError("SPRINT_NOT_FOUND", "assignTask", { sprintId });
        return prevSprints;
      }

      // TODO: Validate task (and its subtasks) are not assigned yet

      return prevSprints.map((sprint) => {
        if (sprint.id !== sprintId) return sprint;

        return {
          ...sprint,
          tasks: mergeTasks([...sprint.tasks, task]),
        };
      });
    });
  };

  const assignTasks: SessionPlannerHookReturn["assignTasks"] = ({
    sprintId,
    tasks,
  }) => {
    setSprints((prevSprints) => {
      if (!sprintExists(sprintId, prevSprints)) {
        handleError("SPRINT_NOT_FOUND", "assignTasks", { sprintId });
        return prevSprints;
      }

      // TODO: Validate tasks (and their subtasks) are not assigned yet

      return prevSprints.map((sprint) => {
        if (sprint.id !== sprintId) return sprint;

        return {
          ...sprint,
          tasks: mergeTasks([...sprint.tasks, ...tasks]),
        };
      });
    });
  };

  const unassignTask: SessionPlannerHookReturn["unassignTask"] = ({
    sprintId,
    task,
  }) => {
    setSprints((prevSprints) => {
      if (!sprintExists(sprintId, prevSprints)) {
        handleError("SPRINT_NOT_FOUND", "unassignTask", { sprintId });
        return prevSprints;
      }

      return prevSprints.map((sprint) => {
        if (sprint.id !== sprintId) return sprint;

        return {
          ...sprint,
          tasks: excludeTask([...sprint.tasks], task),
        };
      });
    });
  };

  const unassignTasks: SessionPlannerHookReturn["unassignTasks"] = ({
    sprintId,
    tasks,
  }) => {
    setSprints((prevSprints) => {
      if (!sprintExists(sprintId, prevSprints)) {
        handleError("SPRINT_NOT_FOUND", "unassignTasks", { sprintId });
        return prevSprints;
      }

      return prevSprints.map((sprint) => {
        if (sprint.id !== sprintId) return sprint;

        return {
          ...sprint,
          tasks: tasks.reduce<TaskSelection[]>(
            (acc, task) => excludeTask([...acc], task),
            sprint.tasks,
          ),
        };
      });
    });
  };

  const moveTasks: SessionPlannerHookReturn["moveTasks"] = ({
    fromSprintId,
    toSprintId,
    tasks,
  }) => {
    setSprints((prev) => {
      if (!sprintExists(fromSprintId, prev)) {
        handleError("SPRINT_NOT_FOUND", "moveTasks", { fromSprintId });
        return prev;
      }

      if (!sprintExists(toSprintId, prev)) {
        handleError("SPRINT_NOT_FOUND", "moveTasks", { toSprintId });
        return prev;
      }

      return prev.map((sprint) => {
        // Remove tasks from source sprint
        if (sprint.id === fromSprintId)
          return {
            ...sprint,
            tasks: tasks.reduce<TaskSelection[]>(
              (acc, task) => excludeTask([...acc], task),
              sprint.tasks,
            ),
          };

        // Add tasks to destination sprint
        if (sprint.id === toSprintId)
          return {
            ...sprint,
            tasks: mergeTasks([...sprint.tasks, ...tasks]),
          };

        // Leave other sprints unchanged
        return sprint;
      });
    });
  };

  return {
    sprints: populatedSprints,
    unassignedTasks,
    initialize,
    addSprint,
    addSprints,
    updateSprint,
    reorderSprints,
    dropSprint,
    assignTask,
    assignTasks,
    unassignTask,
    unassignTasks,
    moveTasks,
    reorderSprintTasks,
  };
}

// ------ Utility Functions ------

const findSprint = (
  sprintId: string,
  sprints: MinimalSprint[],
): MinimalSprint | null =>
  sprints.find((sprint) => sprint.id === sprintId) ?? null;

const sprintExists = (sprintId: string, sprints: MinimalSprint[]): boolean =>
  sprints.some((sprint) => sprint.id === sprintId);

const validateTaskSelections = (selections: TaskSelection[], tasks: Task[]) =>
  selections.reduce<{
    validTaskSelections: TaskSelection[];
    invalidTaskSelections: TaskSelection[];
  }>(
    (acc, selection) => {
      const availableTask = tasks.find((t) => t.id === selection.taskId);
      if (!availableTask)
        return {
          ...acc,
          invalidTaskSelections: [...acc.invalidTaskSelections, selection],
        };

      if (!hasSubtasks(availableTask) || !hasSubtasks(selection))
        return {
          ...acc,
          validTaskSelections: [...acc.validTaskSelections, selection],
        };

      if (
        selection.subtasks?.some(
          (subtaskId) =>
            !availableTask.subtasks?.some(
              (availableSubtask) => availableSubtask.id === subtaskId,
            ),
        )
      )
        return {
          ...acc,
          invalidTaskSelections: [
            ...acc.invalidTaskSelections,
            {
              ...selection,
              subtasks: selection.subtasks?.filter(
                (subtaskId) =>
                  !availableTask.subtasks.some(
                    (availableSubtask) => availableSubtask.id === subtaskId,
                  ),
              ),
            },
          ],
        };

      return {
        ...acc,
        validTaskSelections: [...acc.validTaskSelections, selection],
      };
    },
    { validTaskSelections: [], invalidTaskSelections: [] },
  );

const mergeTasks = (tasks: TaskSelection[]) =>
  tasks.reduce<TaskSelection[]>((acc, task) => {
    const existingTask = acc.find(
      (prevTask) => prevTask.taskId === task.taskId,
    );
    if (!existingTask) return [...acc, task];
    if (!hasSubtasks(task) || !hasSubtasks(existingTask)) return acc;

    return acc.map<TaskSelection>((prevTask) => {
      if (prevTask.taskId !== task.taskId) return prevTask;
      if (!hasSubtasks(prevTask)) return prevTask;

      return {
        ...prevTask,
        subtasks: [...prevTask.subtasks, ...task.subtasks],
      };
    });
  }, []);

const excludeTask = (tasks: TaskSelection[], taskToExclude: TaskSelection) =>
  tasks.reduce<TaskSelection[]>((acc, task) => {
    if (task.taskId !== taskToExclude.taskId) return [...acc, task];

    if (!hasSubtasks(task) || !hasSubtasks(taskToExclude)) return acc;

    const taskWithRemainingSubtasks = {
      ...task,
      subtasks: task.subtasks.filter(
        (subtaskId) => !taskToExclude.subtasks.includes(subtaskId),
      ),
    };

    if (taskWithRemainingSubtasks.subtasks.length)
      return [...acc, taskWithRemainingSubtasks];

    return acc;
  }, []);

// ------ Error Handling ------

export type SprintPlannerErrorCode =
  | "SPRINT_NOT_FOUND"
  | "SPRINT_NOT_PROVIDED"
  | "TASK_NOT_FOUND"
  | "TASK_NOT_PROVIDED"
  | "SUBTASK_NOT_FOUND"
  | "INVALID_TASK_SELECTION";

export type SprintPlannerAction =
  | "updateSprint"
  | "assignTask"
  | "assignTasks"
  | "unassignTask"
  | "unassignTasks"
  | "moveTasks"
  | "reorderSprints"
  | "reorderSprintTasks"
  | "dropSprint"
  | "addSprint"
  | "addSprints";

export interface SprintPlannerError {
  code: SprintPlannerErrorCode;
  action: SprintPlannerAction;
  details?: Record<string, unknown>;
}
