import type { FlatTask, FlatTaskGroup, Task, TaskReference } from "./types";

export const countTasks = (tasks: Task[]): number =>
  tasks.reduce((acc, task) => acc + (task.subtasks?.length ?? 1), 0);

// Checks if the task reference is valid and returns the task reference
export const isValidTaskReference = (
  taskReference: TaskReference,
  tasks: Task[],
): boolean => {
  const task = tasks.find((t) => t.id === taskReference.taskId);

  // Task must exist
  if (!task) return false;

  if (taskReference.subtaskId === null) {
    // Task must not have subtasks
    if (task.subtasks?.length) return false;
    return true;
  }

  // Task has no subtasks, so subtask reference must not be provided
  if (!task.subtasks?.length) return false;

  if (task.subtasks?.length && taskReference.subtaskId === null) return false;

  const doesSubtaskExist = task.subtasks.some(
    (subtask) => subtask.id === taskReference.subtaskId,
  );

  if (!doesSubtaskExist) return false;
  return true;
};

export const resolveTaskReferences = <T extends Task>(
  taskReferences: TaskReference[],
  tasks: T[],
): T[] => {
  const validTaskReferences = taskReferences.filter((taskReference) =>
    isValidTaskReference(taskReference, tasks),
  );

  console.log({ validTaskReferences });
  const mergedTaskReferences = validTaskReferences.reduce<
    {
      taskId: TaskReference["taskId"];
      subtaskIds?: NonNullable<TaskReference["subtaskId"]>[];
    }[]
  >((acc, taskReference) => {
    const isAlreadyInAcc = acc.some(
      ({ taskId }) => taskId === taskReference.taskId,
    );

    if (!isAlreadyInAcc)
      return [
        ...acc,
        {
          taskId: taskReference.taskId,
          subtaskIds: taskReference.subtaskId
            ? [taskReference.subtaskId]
            : undefined,
        },
      ];

    return acc.map((entry) => {
      if (entry.taskId !== taskReference.taskId) return entry;

      return {
        ...entry,
        subtaskIds: taskReference.subtaskId
          ? [...(entry.subtaskIds ?? []), taskReference.subtaskId]
          : undefined,
      };
    });
  }, []);

  return mergedTaskReferences.reduce<T[]>((acc, { taskId, subtaskIds }) => {
    const task = tasks.find(({ id }) => id === taskId);
    if (!task) return acc;

    if (!subtaskIds) return [...acc, task];

    if (!task.subtasks?.length) return acc;

    return [
      ...acc,
      {
        ...task,
        subtasks: task.subtasks.filter(({ id }) => subtaskIds.includes(id)),
      },
    ];
  }, []);
};

export const tranformTasksToReferences = (tasks: Task[]): TaskReference[] => {
  return tasks.flatMap<TaskReference>((task) => {
    if (!task.subtasks?.length) return [{ taskId: task.id, subtaskId: null }];

    return task.subtasks.map((subtask) => ({
      taskId: task.id,
      subtaskId: subtask.id,
    }));
  });
};

export const resolveTaskReferencesFlat = (
  taskReferences: TaskReference[],
  tasks: Task[],
): FlatTask[] => {
  return taskReferences.reduce<FlatTask[]>((acc, taskReference) => {
    const task = tasks.find(({ id }) => id === taskReference.taskId);
    if (!task) return acc;

    const { id: _id, ...taskData } = task;
    if (!task.subtasks?.length && taskReference.subtaskId === null)
      return [
        ...acc,
        {
          ...taskReference,
          ...taskData,
        },
      ];

    if (!task.subtasks?.length && taskReference.subtaskId === null) return acc;

    const subtask = task.subtasks?.find(
      ({ id }) => id === taskReference.subtaskId,
    );
    if (!subtask) return acc;

    const { id: _subtaskId, ...subtaskData } = subtask;

    return [
      ...acc,
      {
        ...taskReference,
        ...taskData,
        ...subtaskData,
        parentTitle: task.title,
        projectId: task.projectId,
      },
    ];
  }, []);
};

export const groupFlatTasks = (tasks: FlatTask[]) =>
  tasks.reduce<(FlatTaskGroup | FlatTask)[]>((acc, task) => {
    const prevItem = acc[acc.length - 1];

    if (!prevItem) return [...acc, task];

    if (prevItem.taskId !== task.taskId) return [...acc, task];

    if ("groupLabel" in prevItem)
      return [
        ...acc.slice(0, -1),
        {
          ...prevItem,
          items: [...prevItem.items, task],
        },
      ];

    return [
      ...acc.slice(0, -1),
      {
        taskId: task.taskId,
        groupLabel: task.parentTitle ?? task.title,
        items: [prevItem, task],
      },
    ];
  }, []);

export const excludeTaskReferences = (
  targetSelection: TaskReference[],
  excludedSelection: TaskReference[],
): TaskReference[] =>
  targetSelection.filter((existingTaskReference) => {
    const isExcluded = excludedSelection.some(
      (excludedTaskReference) =>
        existingTaskReference.taskId === excludedTaskReference.taskId &&
        existingTaskReference.subtaskId === excludedTaskReference.subtaskId,
    );

    return !isExcluded;
  });
