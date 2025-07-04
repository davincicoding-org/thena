import type { TaskId, TaskSelect } from "@/core/task-management/db";

import type {
  AnyTask,
  FlatTask,
  Subtask,
  TaskFilters,
  TaskTree,
} from "./types";
import { isTaskTree } from "./types";

export const countTasks = (tasks: AnyTask[]): number =>
  tasks.reduce(
    (acc, task) => acc + (isTaskTree(task) ? task.subtasks.length : 1),
    0,
  );

export const flattenTask = (task: TaskTree): FlatTask[] => {
  if (task.subtasks.length === 0)
    return [
      {
        parent: null,
        ...task,
      },
    ];

  if (task.subtasks.length === 1)
    return [
      {
        parent: {
          parent: null,
          ...task,
        },
        ...task.subtasks[0]!,
      },
    ];

  return task.subtasks.map<Subtask>((subtask) => ({
    parent: {
      parent: null,
      ...task,
    },
    ...subtask,
  }));
};

export const flattenTasks = (tasks: TaskTree[]): FlatTask[] => {
  return tasks.flatMap<FlatTask>(flattenTask);
};

export const isTaskIncluded = <T extends Pick<TaskSelect, "id">>(
  tasks: T[],
  taskIdToCheck: T["id"],
): boolean => tasks.some((task) => task.id === taskIdToCheck);

export const areTasksIncluded = <T extends Pick<TaskSelect, "id">>(
  tasks: T[],
  taskIdsToFind: T["id"][],
): boolean => taskIdsToFind.every((taskId) => isTaskIncluded(tasks, taskId));

export const excludeTasks = <T extends Pick<TaskSelect, "id">>(
  tasks: T[],
  tasksToExclude: TaskId[],
): T[] => tasks.filter((task) => !tasksToExclude.includes(task.id));

export const excludeAndFlattenTasks = (
  tasks: TaskTree[],
  toExclude: TaskId[],
): AnyTask[] => flattenTasks(tasks).filter((t) => !toExclude.includes(t.id));

export const pickTasks = <T extends Pick<TaskSelect, "id">>(
  tasks: T[],
  tasksToPick: TaskId[],
): T[] =>
  tasksToPick.reduce<T[]>((acc, taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) return [...acc, task];
    return acc;
  }, []);

export const includeTasksAndCompact = (
  tasks: AnyTask[],
  toInclude: TaskId[],
): AnyTask[] =>
  tasks.flatMap<AnyTask>((task) => {
    if (!isTaskTree(task)) return toInclude.includes(task.id) ? [task] : [];

    const includedSubtasks = task.subtasks.filter((subtask) =>
      toInclude.includes(subtask.id),
    );

    if (includedSubtasks.length === 0) return [];
    if (includedSubtasks.length === 1)
      return flattenTask({
        ...task,
        subtasks: includedSubtasks,
      });

    return [{ ...task, subtasks: includedSubtasks }];
  });

export const unflattenTasks = (tasks: FlatTask[]): TaskTree[] =>
  tasks.reduce<TaskTree[]>((acc, task) => {
    // Check if standalone task is already included
    if (acc.some((t) => t.id === task.id)) return acc;

    // Check if is standalone task
    if (!task.parent) return [...acc, { ...task, subtasks: [] }];

    // Check if parent task tree is already included
    const parentIndex = acc.findIndex((t) => t.id === task.parent.id);
    if (parentIndex !== -1) {
      const parent = acc[parentIndex]!;
      const populatedParent: TaskTree = {
        ...parent,
        subtasks: [...parent.subtasks, task],
      };
      return [
        ...acc.slice(0, parentIndex),
        populatedParent,
        ...acc.slice(parentIndex + 1),
      ];
    }

    // Task tree should be constructed from subtask
    return [
      ...acc,
      {
        ...task.parent,
        subtasks: [task],
      },
    ];
  }, []);

// MARK: Possibly deprecated
export const hasFiltersApplied = ({ projectIds, search }: TaskFilters) => {
  return Boolean(projectIds?.length ?? search);
};

export const filterTaskTrees = (
  tasks: TaskTree[],
  filter: (task: Omit<TaskSelect, "parentId">) => boolean,
) => {
  return tasks.flatMap<TaskTree>((taskTree) => {
    if (!filter(taskTree)) return [];

    if (taskTree.subtasks.length === 0) return [taskTree];

    const filteredSubtasks = taskTree.subtasks.filter(filter);

    if (filteredSubtasks.length === 0) return [];

    return [
      {
        ...taskTree,
        subtasks: filteredSubtasks,
      },
    ];
  });
};
