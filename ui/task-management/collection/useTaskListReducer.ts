import { useReducer } from "react";

import type { Task, TaskInput } from "@/core/task-management";
import { createUniqueId } from "@/ui/utils";

export type TaskListAction =
  | {
      type: "add";
      task: TaskInput;
    }
  | {
      type: "addMany";
      tasks: TaskInput[];
    }
  | {
      type: "update";
      taskId: Task["id"];
      updates: Partial<Task>;
    }
  | {
      type: "remove";
      taskId: Task["id"];
    }
  | {
      type: "removeMany";
      taskIds: Task["id"][];
    }
  | {
      type: "set";
      tasks: Task[];
    };

export function useTaskListReducer(initialTasks: Task[] = []) {
  return useReducer<Task[], [TaskListAction]>((prev, action) => {
    switch (action.type) {
      case "add":
        return [...prev, { ...action.task, id: createUniqueId(prev) }];
      case "addMany":
        return action.tasks.reduce(
          (acc, task) => [...acc, { ...task, id: createUniqueId(acc) }],
          prev,
        );
      case "update":
        return prev.map((task) =>
          task.id === action.taskId ? { ...task, ...action.updates } : task,
        );
      case "remove":
        return prev.filter((task) => task.id !== action.taskId);
      case "removeMany":
        return prev.filter((task) => !action.taskIds.includes(task.id));
      case "set":
        return action.tasks;
    }
  }, initialTasks);
}
