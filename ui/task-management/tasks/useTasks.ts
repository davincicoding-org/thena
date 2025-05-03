import type { StoredTask, TaskInput } from "@/core/task-management";
import type { MutationAction } from "@/ui/utils";
import { createMutationAction } from "@/ui/utils";

import { useTasksStore } from "./useTasksStore";

export interface TasksHookReturn {
  loading: boolean;
  items: StoredTask[];
  addTask: MutationAction<TaskInput, StoredTask>;
  addTasks: MutationAction<TaskInput[], StoredTask[]>;
  updateTask: MutationAction<
    {
      taskId: StoredTask["id"];
      updates: Partial<TaskInput>;
    },
    Record<"updated" | "prev", StoredTask> | undefined
  >;
  insertTask: MutationAction<StoredTask>;
  deleteTask: MutationAction<StoredTask["id"], StoredTask | undefined>;
  deleteTasks: MutationAction<StoredTask["id"][], StoredTask[]>;
}

/**
 * Manages stored tags.
 */

export function useTasks(): TasksHookReturn {
  const store = useTasksStore();

  const items = Object.entries(store.pool).map(([id, task]) => ({
    id,
    ...task,
  }));

  return {
    loading: !store.ready,
    items,
    addTask: createMutationAction(store.addTask),
    addTasks: createMutationAction(store.addTasks),
    updateTask: createMutationAction(store.updateTask),
    insertTask: createMutationAction(store.insertTask),
    deleteTask: createMutationAction(store.removeTask),
    deleteTasks: createMutationAction(store.removeTasks),
  };
}
