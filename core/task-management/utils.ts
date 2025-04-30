import type { FlatTask, FlatTaskGroup, Task, TaskReference } from "./types";

export const countTasks = (tasks: Task[]): number =>
  tasks.reduce((acc, task) => acc + (task.subtasks?.length ?? 1), 0);

// Checks if the task reference is valid
export const doesTaskReferenceExist = (
  taskReference: TaskReference,
  tasks: TaskReference[],
): boolean =>
  tasks.some(
    ({ taskId, subtaskId }) =>
      taskId === taskReference.taskId && subtaskId === taskReference.subtaskId,
  );

export const resolveTaskReferences = <T extends Task>(
  taskReferences: TaskReference[],
  tasks: FlatTask[],
): FlatTask[] =>
  tasks.filter((task) => doesTaskReferenceExist(task, taskReferences));

export const tranformTasksToReferences = (tasks: Task[]): TaskReference[] => {
  return tasks.flatMap<TaskReference>((task) => {
    if (!task.subtasks?.length) return [{ taskId: task.id, subtaskId: null }];

    return task.subtasks.map((subtask) => ({
      taskId: task.id,
      subtaskId: subtask.id,
    }));
  });
};

export const flattenTasks = (tasks: Task[]): FlatTask[] => {
  return tasks.flatMap<FlatTask>(({ id: taskId, ...task }) => {
    if (!task.subtasks?.length) return [{ taskId, subtaskId: null, ...task }];

    return task.subtasks.map<FlatTask>(({ id, ...subtask }) => ({
      taskId,
      subtaskId: id,
      parentTitle: task.title,
      projectId: task.projectId,
      ...subtask,
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

export const isTaskGroup = (
  item: FlatTaskGroup | FlatTask,
): item is FlatTaskGroup => "groupLabel" in item;

export const groupFlatTasks = (tasks: FlatTask[]) =>
  tasks.reduce<(FlatTaskGroup | FlatTask)[]>((acc, task) => {
    const prevItem = acc[acc.length - 1];

    if (!prevItem) return [...acc, task];

    if (prevItem.taskId !== task.taskId) return [...acc, task];

    if (isTaskGroup(prevItem))
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
) =>
  // Reduce is used, because `targetSelection` items could be an extension of TaskReference
  targetSelection.reduce<TaskReference[]>((acc, { taskId, subtaskId }) => {
    const isIncluded = excludedSelection.some(
      (taskReferenceToExclude) =>
        taskReferenceToExclude.taskId === taskId &&
        taskReferenceToExclude.subtaskId === subtaskId,
    );
    if (isIncluded) return acc;

    return [...acc, { taskId, subtaskId }];
  }, []);
