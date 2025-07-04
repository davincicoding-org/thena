import type { SetRequired } from "type-fest";
import { notifications } from "@mantine/notifications";

import type {
  TaskFormValues,
  TaskSelect,
  TaskUpdate,
} from "@/core/task-management";
import type { useTodos } from "@/ui/task-management/useTodos";
import { taskSelectSchema } from "@/core/task-management";
import { useTimeTravel } from "@/ui/hooks/useTimeTravel";

export function useTodosWithTimeTravel(todos: ReturnType<typeof useTodos>) {
  const timeTravel = useTimeTravel({
    onNavigated: ({ event, action }) => {
      if (event === "push") return;
      notifications.show({
        title: event,
        message: action,
        position: "top-right",
      });
    },
  });

  // useHotkeys([
  //   ["mod+z", timeTravel.undo],
  //   ["mod+shift+z", timeTravel.redo],
  // ]);

  const createTasks = timeTravel.createAction({
    name: "create-tasks",
    apply: (input: TaskFormValues[]) => todos.createTasks.mutateAsync(input),
    revert: (tasks) =>
      tasks.forEach((task) => void todos.deleteTask.mutateAsync(task)),
  });

  const deleteTasks = timeTravel.createAction({
    name: "remove-tasks",
    apply: async (tasks: TaskSelect[]) => {
      await Promise.all(
        tasks.map((task) => todos.deleteTask.mutateAsync(task)),
      );

      return tasks;
    },
    revert: (tasks) => void todos.createTasks.mutateAsync(tasks),
  });

  const updateTask = timeTravel.createAction({
    name: "update-task",
    apply: (taskToUpdate: SetRequired<TaskUpdate, "id" | "parentId">) => {
      const prevState = ((): TaskSelect | undefined => {
        if (taskToUpdate.parentId === null) {
          const match = todos.tasks.find((task) => task.id === taskToUpdate.id);
          if (!match) return;
          return taskSelectSchema.strip().parse({
            ...match,
            parentId: null,
          });
        }

        const match = todos.tasks
          .find((task) => task.id === taskToUpdate.parentId)
          ?.subtasks.find((subtask) => subtask.id === taskToUpdate.id);
        if (!match) return;
        return taskSelectSchema.strip().parse({
          ...match,
          parentId: taskToUpdate.parentId,
        });
      })();
      if (!prevState) return;
      void todos.updateTask.mutateAsync(taskToUpdate);
      return prevState;
    },
    revert: (prevState) => {
      if (!prevState) return;
      void todos.updateTask.mutateAsync(prevState);
    },
  });

  return {
    createTasks,
    deleteTasks,
    updateTask,
  };
}
