import { useMemo, useState } from "react";
import { nanoid } from "nanoid";

import { SprintPlan, TaskSelection } from "@/core/deep-work";
import { hasSubtasks, Subtask, Task } from "@/core/task-management";
import { ExternalState as InjectedState, StateSetter } from "@/ui/utils";

export const DEFAULT_OPTIONS = {
  initialSprints: 0,
  sprintDuration: 25,
};

export interface SessionPlannerHookOptions {
  /** Initial number of Sprints */
  initialSprints?: number;
  /** Default duration for new Sprints */
  sprintDuration?: number;
  /** Error callback for handling errors without throwing */
  onError?: (error: SprintPlannerError) => void;
}

// const toMinimalTasks = (tasks: Task[]): TaskSelection[] =>
//   tasks.map((task) => ({
//     taskId: task.id,
//     subtasks: task.subtasks?.map((subtask) => subtask.id),
//   }));

export interface SessionPlannerHookReturn {
  /** All current Sprint plans (with populated tasks) */
  sprints: SprintPlan[];

  setSprints: StateSetter<SprintPlan[]>;

  /** Tasks not yet assigned to any Sprint */
  unassignedTasks: Task[];

  /** Initialize `count` empty Sprints */
  // initialize: (options: SessionPlannerHookOptions) => void;

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
    initialSprints = DEFAULT_OPTIONS.initialSprints,
    sprintDuration = DEFAULT_OPTIONS.sprintDuration,
    onError,
  }: SessionPlannerHookOptions = DEFAULT_OPTIONS,
): SessionPlannerHookReturn {
  const [sprints, setSprints] = useState<SprintPlan[]>(
    initializeSprints(initialSprints, sprintDuration),
  );

  const unassignedTasks = useMemo(() => {
    const assignedTasks = mergeTasks(sprints.flatMap((sprint) => sprint.tasks));

    return taskPool.reduce<Task[]>((acc, task) => {
      const assignedTask = assignedTasks.find(
        (assignedTask) => assignedTask.id === task.id,
      );
      if (!assignedTask) return [...acc, task];

      if (!hasSubtasks(task) || !hasSubtasks(assignedTask)) return acc;

      const taskWithoutAssignedSubtasks = {
        ...task,
        subtasks: task.subtasks.filter((subtask) =>
          assignedTask.subtasks.every(
            (assignedSubtask) => assignedSubtask.id !== subtask.id,
          ),
        ),
      };

      if (!taskWithoutAssignedSubtasks.subtasks?.length) return acc;

      return [...acc, taskWithoutAssignedSubtasks];
    }, []);
  }, [taskPool, sprints]);

  // const initialize: SessionPlannerHookReturn["initialize"] = ({
  //   initialSprints: sprintCount = DEFAULT_OPTIONS.initialSprints,
  //   sprintDuration = DEFAULT_OPTIONS.sprintDuration,
  // }) =>
  //   setSprints(
  //     Array.from(
  //       { length: sprintCount },
  //       (): MinimalSprint => ({
  //         id: nanoid(),
  //         duration: sprintDuration,
  //         tasks: [],
  //       }),
  //     ),
  //   );

  // ------ Helpers ------
  const handleError = (
    code: SprintPlannerErrorCode,
    action: SprintPlannerAction,
    details?: Record<string, unknown>,
  ) => {
    onError?.({
      code,
      action,
      details,
    });
    return false; // Return false to indicate an error occurred
  };

  // ------ Sprint Management ------

  const resolveTask = (taskSelection: TaskSelection) => {
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
        tasks: tasks.reduce<Task[]>((acc, task) => {
          const resolvedTask = resolveTask(task);
          if (!resolvedTask) return acc;
          return [...acc, resolvedTask];
        }, []),
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
        tasks: tasks.reduce<Task[]>((acc, task) => {
          const resolvedTask = resolveTask(task);
          if (!resolvedTask) return acc;
          return [...acc, resolvedTask];
        }, []),
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
        return prev;
      }

      return prev.map((sprint) => {
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

      const resolvedTask = resolveTask(task);
      // TODO: Handle error
      if (!resolvedTask) return prevSprints;

      // TODO: Validate task (and its subtasks) are not assigned yet

      return prevSprints.map((sprint) => {
        if (sprint.id !== sprintId) return sprint;

        return {
          ...sprint,
          tasks: mergeTasks([...sprint.tasks, resolvedTask]),
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

      const resolvedTasks = tasks.reduce<Task[]>((acc, task) => {
        const resolvedTask = resolveTask(task);
        // TODO: Handle error
        if (!resolvedTask) return acc;
        return [...acc, resolvedTask];
      }, []);

      // TODO: Validate tasks (and their subtasks) are not assigned yet

      return prevSprints.map((sprint) => {
        if (sprint.id !== sprintId) return sprint;

        return {
          ...sprint,
          tasks: mergeTasks([...sprint.tasks, ...resolvedTasks]),
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
          tasks: tasks.reduce<Task[]>(
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

      const resolvedTasks = tasks.reduce<Task[]>((acc, task) => {
        const resolvedTask = resolveTask(task);
        // TODO: Handle error
        if (!resolvedTask) return acc;
        return [...acc, resolvedTask];
      }, []);

      return prev.map((sprint) => {
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
    });
  };

  return {
    sprints,
    setSprints,
    unassignedTasks,
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

export const initializeSprints = (
  sprintCount: number,
  sprintDuration: number = DEFAULT_OPTIONS.sprintDuration,
): SprintPlan[] =>
  Array.from(
    { length: sprintCount },
    (): SprintPlan => ({
      id: nanoid(),
      duration: sprintDuration,
      tasks: [],
    }),
  );

const findSprint = (
  sprintId: string,
  sprints: SprintPlan[],
): SprintPlan | null =>
  sprints.find((sprint) => sprint.id === sprintId) ?? null;

const sprintExists = (sprintId: string, sprints: SprintPlan[]): boolean =>
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

export const mergeTasks = (tasks: Task[]): Task[] =>
  tasks.reduce<Task[]>((acc, task) => {
    const existingTask = acc.find((prevTask) => prevTask.id === task.id);
    if (!existingTask) return [...acc, task];
    if (!hasSubtasks(task) || !hasSubtasks(existingTask)) return acc;

    return acc.map<Task>((prevTask) => {
      if (prevTask.id !== task.id) return prevTask;
      if (!hasSubtasks(prevTask)) return prevTask;

      return {
        ...prevTask,
        subtasks: task.subtasks.reduce<Subtask[]>((acc, subtask) => {
          const isSubtaskAlreadyInList = acc.some(
            (subtaskInList) => subtaskInList.id === subtask.id,
          );
          if (isSubtaskAlreadyInList) return acc;
          return [...acc, subtask];
        }, prevTask.subtasks),
      };
    });
  }, []);

export const excludeTask = (
  tasks: Task[],
  taskToExclude: TaskSelection,
): Task[] =>
  tasks.reduce<Task[]>((acc, task) => {
    if (task.id !== taskToExclude.taskId) return [...acc, task];

    if (!hasSubtasks(task) || !hasSubtasks(taskToExclude)) return acc;

    const taskWithRemainingSubtasks = {
      ...task,
      subtasks: task.subtasks.filter((subtask) =>
        taskToExclude.subtasks.every(
          (subtaskToExclude) => subtask.id !== subtaskToExclude,
        ),
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
