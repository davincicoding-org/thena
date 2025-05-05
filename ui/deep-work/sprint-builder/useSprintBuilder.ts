import type { Dispatch } from "react";
import { useEffect } from "react";
import { usePrevious } from "@mantine/hooks";

import type { Duration, SprintPlan } from "@/core/deep-work";
import type { StandaloneTask, TaskTree } from "@/core/task-management";
import { countTasks, flattenTasks } from "@/core/task-management";
import { createUniqueId } from "@/ui/utils";

import type {
  SprintPlannerAction,
  SprintsReducerError,
} from "./useSprintsReducer";
import { useSprintsReducer } from "./useSprintsReducer";

export const DEFAULT_OPTIONS = {
  initialSprints: 0,
  sprintDuration: { minutes: 25 },
};

export interface SessionPlannerHookOptions {
  /** Initial number of Sprints */
  initialSprints?: number;
  /** Default duration for new Sprints */
  sprintDuration?: Duration;
  /** Error callback for handling errors without throwing */
  onError?: (error: SprintsReducerError) => void;
}

export interface SessionPlannerHookReturn {
  /** All current Sprint plans (with populated tasks) */
  sprints: SprintPlan[];

  dispatchAction: Dispatch<SprintPlannerAction>;
}

/**
 * Initialize Sprints, add new Sprints, adjust durations, and reorder sprints and tasks.
 */
export function useSprintBuilder(
  taskPool: (TaskTree | StandaloneTask)[],
  {
    initialSprints = DEFAULT_OPTIONS.initialSprints,
    sprintDuration = DEFAULT_OPTIONS.sprintDuration,
    onError,
  }: SessionPlannerHookOptions = DEFAULT_OPTIONS,
): SessionPlannerHookReturn {
  const flatTasks = flattenTasks(taskPool);
  const [sprints, dispatch] = useSprintsReducer(
    {
      taskPool: flatTasks,
      sprintDuration,
      onError,
    },
    initializeSprints(initialSprints, sprintDuration),
  );

  return {
    sprints,
    dispatchAction: dispatch,
  };
}

// MARK: Utility Functions

export const initializeSprints = (
  sprintCount: number,
  sprintDuration: Duration = DEFAULT_OPTIONS.sprintDuration,
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
