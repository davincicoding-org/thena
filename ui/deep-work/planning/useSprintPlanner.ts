import { useMemo } from "react";
import { nanoid } from "nanoid";

import { SprintPlan } from "@/core/deep-work";
import {
  hasSubtasks,
  mergeTasks,
  Task,
  TaskSelection,
} from "@/core/task-management";
import { StateSetter } from "@/ui/utils";

import { SprintsReducerError, useSprintsReducer } from "./useSprintsReducer";

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
  const [sprints, dispatch] = useSprintsReducer(
    {
      taskPool,
      sprintDuration,
      onError,
    },
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

  const setSprints: StateSetter<SprintPlan[]> = (value) => {
    const newSprints = typeof value === "function" ? value(sprints) : value;
    dispatch({ type: "SET_SPRINTS", payload: { sprints: newSprints } });
  };

  const addSprint: SessionPlannerHookReturn["addSprint"] = (sprintToAdd) => {
    dispatch({ type: "ADD_SPRINT", payload: sprintToAdd });
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
  Array.from(
    { length: sprintCount },
    (): SprintPlan => ({
      id: nanoid(),
      duration: sprintDuration,
      tasks: [],
    }),
  );
