import type { SetRequired } from "type-fest";
import { notifications } from "@mantine/notifications";

import type {
  TaskFormValues,
  TaskSelect,
  TaskTree,
  TaskUpdate,
} from "@/core/task-management";
import { taskSelectSchema } from "@/core/task-management";
import { api } from "@/trpc/react";
import { useTimeTravel } from "@/ui/hooks/useTimeTravel";

export function useTodos() {
  const utils = api.useUtils();
  const { data = [], isLoading } = api.tasks.list.useQuery({
    status: "todo",
  });

  const createTaskMutation = api.tasks.create.useMutation<{
    prev: TaskTree[] | undefined;
    tempId: number;
  }>({
    onMutate: async (taskInsert) => {
      await utils.tasks.list.cancel({ status: "todo" });
      const prev = utils.tasks.list.getData({ status: "todo" });

      const tempId = Math.max(...(prev ?? []).map((task) => task.id), 0) + 1;

      const mockedTask: TaskSelect = {
        id: tempId,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "",
        sortOrder: tempId,
        status: "todo",
        ...taskInsert,
      };
      utils.tasks.list.setData({ status: "todo" }, (prev = []) => {
        if (typeof taskInsert.parentId !== "number") {
          return [...prev, { ...mockedTask, subtasks: [] }].sort(
            (a, b) => a.sortOrder - b.sortOrder,
          );
        }

        return prev.map((task) => {
          if (task.id !== taskInsert.parentId) return task;
          return {
            ...task,
            subtasks: [...task.subtasks, mockedTask].sort(
              (a, b) => a.sortOrder - b.sortOrder,
            ),
          };
        });
      });
      return { prev, tempId };
    },
    onError: (err, variables, context) => {
      utils.tasks.list.setData({ status: "todo" }, context?.prev);
    },
    onSuccess: (createdTask, variables, context) => {
      utils.tasks.list.setData({ status: "todo" }, (prev = []) => {
        if (createdTask.parentId === null)
          return prev
            .map((task) => {
              if (task.id !== context.tempId) return task;

              return {
                ...createdTask,
                subtasks: [],
              };
            })
            .sort((a, b) => a.sortOrder - b.sortOrder);

        return prev.map((task) => {
          if (task.id !== createdTask.parentId) return task;
          return {
            ...task,
            subtasks: task.subtasks
              .map((subtask) => {
                if (subtask.id !== context.tempId) return subtask;
                return createdTask;
              })
              .sort((a, b) => a.sortOrder - b.sortOrder),
          };
        });
      });
    },
  });

  const updateTaskMutation = api.tasks.update.useMutation<{
    prev: TaskTree[] | undefined;
  }>({
    onMutate: async (taskUpdate) => {
      await utils.tasks.list.cancel({ status: "todo" });
      const prev = utils.tasks.list.getData({ status: "todo" });
      utils.tasks.list.setData({ status: "todo" }, (prev = []) => {
        if (taskUpdate.parentId === null) {
          return prev
            .map((task) => {
              if (task.id !== taskUpdate.id) return task;
              return { ...task, ...taskUpdate };
            })
            .sort(
              (a, b) =>
                (a.customSortOrder ?? a.id) - (b.customSortOrder ?? b.id),
            );
        }
        return prev.map((task) => {
          if (task.id !== taskUpdate.parentId) return task;

          return {
            ...task,
            subtasks: task.subtasks
              .map((subtask) => {
                if (subtask.id !== taskUpdate.id) return subtask;
                return { ...subtask, ...taskUpdate };
              })
              .sort(
                (a, b) =>
                  (a.customSortOrder ?? a.id) - (b.customSortOrder ?? b.id),
              ),
          };
        });
      });
      return { prev };
    },
    onError: (err, variables, context) => {
      utils.tasks.list.setData({ status: "todo" }, context?.prev);
    },
  });

  const deleteTaskMutation = api.tasks.delete.useMutation<{
    prev: TaskTree[] | undefined;
  }>({
    onMutate: async (taskId) => {
      await utils.tasks.list.cancel({ status: "todo" });
      const prev = utils.tasks.list.getData({ status: "todo" });
      utils.tasks.list.setData({ status: "todo" }, (prev = []) => {
        if (taskId.parentId === null) {
          return prev.filter((task) => task.id !== taskId.id);
        }
        return prev.map((task) => {
          if (task.id !== taskId.parentId) return task;
          return {
            ...task,
            subtasks: task.subtasks.filter(
              (subtask) => subtask.id !== taskId.id,
            ),
          };
        });
      });
      return { prev };
    },
    onError: (err, variables, context) => {
      utils.tasks.list.setData({ status: "todo" }, context?.prev);
    },
  });

  // MARK: Task Actions

  // useHotkeys([
  //   ["mod+z", timeTravel.undo],
  //   ["mod+shift+z", timeTravel.redo],
  // ]);

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

  const createTask = timeTravel.createAction({
    name: "create-task",
    apply: (input: TaskFormValues) => createTaskMutation.mutateAsync(input),
    revert: (task) => void deleteTaskMutation.mutateAsync(task),
  });

  const deleteTasks = timeTravel.createAction({
    name: "remove-tasks",
    apply: async (tasks: TaskSelect[]) => {
      await Promise.all(
        tasks.map((task) => deleteTaskMutation.mutateAsync(task)),
      );

      return tasks;
    },
    revert: (tasks) => {
      tasks.forEach(
        (task) => task && void createTaskMutation.mutateAsync(task),
      );
    },
  });

  const updateTask = timeTravel.createAction({
    name: "update-task",
    apply: (taskToUpdate: SetRequired<TaskUpdate, "id" | "parentId">) => {
      const prevState = ((): TaskSelect | undefined => {
        if (taskToUpdate.parentId === null) {
          const match = data.find((task) => task.id === taskToUpdate.id);
          if (!match) return;
          return taskSelectSchema.strip().parse({
            ...match,
            parentId: null,
          });
        }

        const match = data
          .find((task) => task.id === taskToUpdate.parentId)
          ?.subtasks.find((subtask) => subtask.id === taskToUpdate.id);
        if (!match) return;
        return taskSelectSchema.strip().parse({
          ...match,
          parentId: taskToUpdate.parentId,
        });
      })();
      if (!prevState) return;
      void updateTaskMutation.mutateAsync(taskToUpdate);
      return prevState;
    },
    revert: (prevState) => {
      if (!prevState) return;
      void updateTaskMutation.mutateAsync(prevState);
    },
  });

  return {
    tasks: data,
    isLoading,
    createTask,
    deleteTasks,
    updateTask,
  };
}
