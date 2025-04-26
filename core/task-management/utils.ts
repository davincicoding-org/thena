import { Subtask, Task, TaskSelection } from "./types";

export const hasSubtasks = <T extends { subtasks?: unknown[] }>(
  task: T,
): task is T & { subtasks: Required<T>["subtasks"] } => {
  if (!task.subtasks) return false;
  return task.subtasks && task.subtasks.length > 0;
};

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
