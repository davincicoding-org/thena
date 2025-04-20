export const hasSubtasks = <T extends { subtasks?: unknown[] }>(
  task: T,
): task is T & { subtasks: Required<T>["subtasks"] } => {
  if (!task.subtasks) return false;
  return task.subtasks && task.subtasks.length > 0;
};
