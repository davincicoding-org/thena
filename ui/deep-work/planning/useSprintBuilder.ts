import { useEffect } from "react";
import { usePrevious } from "@mantine/hooks";

import type { SprintPlan } from "@/core/deep-work";
import type { Task, TaskReference } from "@/core/task-management";
import {
  countTasks,
  excludeTaskReferences,
  tranformTasksToReferences,
} from "@/core/task-management";
import { createUniqueId } from "@/ui/utils";

import type { SprintsReducerError } from "./useSprintsReducer";
import { useSprintsReducer } from "./useSprintsReducer";

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
  onError?: (error: SprintsReducerError) => void;
}

export interface SessionPlannerHookReturn {
  /** All current Sprint plans (with populated tasks) */
  sprints: SprintPlan[];

  setSprints: (value: SprintPlan[]) => void;

  /** Tasks not yet assigned to any Sprint */
  unassignedTasks: TaskReference[];

  /** Initialize `count` empty Sprints */
  // initialize: (options: SessionPlannerHookOptions) => void;

  /** Add a new empty Sprint, using optional duration */
  addSprint: (
    sprintToAdd: {
      duration?: number;
      tasks?: TaskReference[];
    },
    callback?: (sprintId: SprintPlan["id"]) => void,
  ) => void;

  /** Add multiple Sprints at once */
  addSprints: (
    sprintsToAdd: {
      duration?: number;
      tasks?: TaskReference[];
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
    task: TaskReference;
  }) => void;

  /** Assign multiple tasks into a Sprint */
  assignTasks: (options: {
    sprintId: SprintPlan["id"] | null;
    tasks: TaskReference[];
  }) => void;

  /** Unassign one of the Sprint's tasks */
  unassignTask: (options: {
    sprintId: SprintPlan["id"];
    task: TaskReference;
  }) => void;

  /** Unassign multiple of the Sprint's tasks */
  unassignTasks: (options: {
    sprintId: SprintPlan["id"];
    tasks: TaskReference[];
  }) => void;

  /** Move tasks between two Sprints */
  moveTasks: (options: {
    fromSprintId: SprintPlan["id"];
    toSprintId: SprintPlan["id"];
    tasks: TaskReference[];
  }) => void;

  /** Reorder tasks within a Sprint (for drag‑and‑drop UIs) */
  reorderSprintTasks: (sprintId: SprintPlan["id"], tasks: Task["id"][]) => void;
}

/**
 * Initialize Sprints, add new Sprints, adjust durations, and reorder sprints and tasks.
 */
export function useSprintBuilder(
  taskPool: Task[],
  {
    initialSprints = DEFAULT_OPTIONS.initialSprints,
    sprintDuration = DEFAULT_OPTIONS.sprintDuration,
    onError,
  }: SessionPlannerHookOptions = DEFAULT_OPTIONS,
): SessionPlannerHookReturn {
  const [sprints, dispatch] = useSprintsReducer(
    {
      taskPool,
      sprintDuration,
      onError,
    },
    initializeSprints(initialSprints, sprintDuration),
  );

  const totalAvailableTasks = countTasks(taskPool);
  const prevTotalAssignedTasks = usePrevious(totalAvailableTasks);

  useEffect(() => {
    if (prevTotalAssignedTasks === undefined) return;
    if (totalAvailableTasks >= prevTotalAssignedTasks) return;

    console.log("TASK WAS REMOVED, NEED TO SYNC");
    // dispatch({ type: "SYNC_SPRINTS" });
  }, [prevTotalAssignedTasks, totalAvailableTasks]);

  const unassignedTasks = ((): TaskReference[] => {
    const allAssignedTaskReferences = sprints.flatMap((sprint) => sprint.tasks);

    const allTaskReferences = tranformTasksToReferences(taskPool);

    return excludeTaskReferences(allTaskReferences, allAssignedTaskReferences);
  })();

  const setSprints: SessionPlannerHookReturn["setSprints"] = (sprints) => {
    dispatch({ type: "SET_SPRINTS", payload: { sprints } });
  };

  const addSprint: SessionPlannerHookReturn["addSprint"] = (
    sprintToAdd,
    callback,
  ) => {
    dispatch({ type: "ADD_SPRINT", payload: sprintToAdd, callback });
  };

  const addSprints: SessionPlannerHookReturn["addSprints"] = (sprintsToAdd) => {
    dispatch({ type: "ADD_SPRINTS", payload: { sprints: sprintsToAdd } });
  };

  const updateSprint: SessionPlannerHookReturn["updateSprint"] = (
    sprintId,
    updates,
  ) => {
    dispatch({ type: "UPDATE_SPRINT", payload: { sprintId, updates } });
  };

  const reorderSprints: SessionPlannerHookReturn["reorderSprints"] = (
    sprintIds,
  ) => {
    dispatch({ type: "REORDER_SPRINTS", payload: { sprintIds } });
  };

  const dropSprint: SessionPlannerHookReturn["dropSprint"] = (sprintId) => {
    dispatch({ type: "DROP_SPRINT", payload: { sprintId } });
  };

  const assignTask: SessionPlannerHookReturn["assignTask"] = (options) => {
    dispatch({ type: "ASSIGN_TASK", payload: options });
  };

  const assignTasks: SessionPlannerHookReturn["assignTasks"] = (options) => {
    dispatch({ type: "ASSIGN_TASKS", payload: options });
  };

  const unassignTask: SessionPlannerHookReturn["unassignTask"] = (options) => {
    dispatch({ type: "UNASSIGN_TASK", payload: options });
  };

  const unassignTasks: SessionPlannerHookReturn["unassignTasks"] = (
    options,
  ) => {
    dispatch({ type: "UNASSIGN_TASKS", payload: options });
  };

  const moveTasks: SessionPlannerHookReturn["moveTasks"] = (options) => {
    dispatch({ type: "MOVE_TASKS", payload: options });
  };

  const reorderSprintTasks: SessionPlannerHookReturn["reorderSprintTasks"] = (
    sprintId,
    taskIds,
  ) => {
    dispatch({ type: "REORDER_SPRINT_TASKS", payload: { sprintId, taskIds } });
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

// MARK: Utility Functions

export const initializeSprints = (
  sprintCount: number,
  sprintDuration: number = DEFAULT_OPTIONS.sprintDuration,
): SprintPlan[] =>
  Array.from({ length: sprintCount }).reduce<SprintPlan[]>(
    (acc) => [
      ...acc,
      {
        id: createUniqueId(acc, 4),
        duration: sprintDuration,
        tasks: [],
      },
    ],
    [],
  );
