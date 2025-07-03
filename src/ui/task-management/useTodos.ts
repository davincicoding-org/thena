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

  const createTasksMutation = api.tasks.create.useMutation<{
    prev: TaskTree[] | undefined;
    tempIds: number[];
  }>({
    onMutate: async (taskInserts) => {
      await utils.tasks.list.cancel({ status: "todo" });
      const prev = utils.tasks.list.getData({ status: "todo" });

      const latestId = Math.max(...(prev ?? []).map((task) => task.id), 0);

      const mockedTasks = taskInserts.map<TaskSelect>((taskInsert, index) => {
        const tempId = latestId + (index + 1) + 0.1;
        return {
          id: tempId,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: "",
          sortOrder: tempId,
          status: "todo",
          ...taskInsert,
        };
      });

      utils.tasks.list.setData({ status: "todo" }, (prev = []) => {
        return mockedTasks.reduce((acc, mockedTask) => {
          if (typeof mockedTask.parentId !== "number") {
            return [...acc, { ...mockedTask, subtasks: [] }].sort(
              (a, b) => a.sortOrder - b.sortOrder,
            );
          }

          return acc.map((task) => {
            if (task.id !== mockedTask.parentId) return task;
            return {
              ...task,
              subtasks: [...task.subtasks, mockedTask].sort(
                (a, b) => a.sortOrder - b.sortOrder,
              ),
            };
          });
        }, prev);
      });
      return { prev, tempIds: mockedTasks.map((task) => task.id) };
    },
    onError: (err, variables, context) => {
      utils.tasks.list.setData({ status: "todo" }, context?.prev);
    },
    onSuccess: (createdTasks, variables, context) => {
      utils.tasks.list.setData({ status: "todo" }, (prev = []) => {
        return createdTasks.reduce((acc, createdTask, index) => {
          if (createdTask.parentId === null)
            return acc
              .map((task) => {
                if (task.id !== context.tempIds[index]) return task;

                return {
                  ...createdTask,
                  subtasks: [],
                };
              })
              .sort((a, b) => a.sortOrder - b.sortOrder);

          return acc.map((task) => {
            if (task.id !== createdTask.parentId) return task;
            return {
              ...task,
              subtasks: task.subtasks
                .map((subtask) => {
                  if (subtask.id !== context.tempIds[index]) return subtask;
                  return createdTask;
                })
                .sort((a, b) => a.sortOrder - b.sortOrder),
            };
          });
        }, prev);
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

  const createTasks = timeTravel.createAction({
    name: "create-tasks",
    apply: (input: TaskFormValues[]) => createTasksMutation.mutateAsync(input),
    revert: (tasks) =>
      tasks.forEach((task) => void deleteTaskMutation.mutateAsync(task)),
  });

  const deleteTasks = timeTravel.createAction({
    name: "remove-tasks",
    apply: async (tasks: TaskSelect[]) => {
      await Promise.all(
        tasks.map((task) => deleteTaskMutation.mutateAsync(task)),
      );

      return tasks;
    },
    revert: (tasks) => void createTasksMutation.mutateAsync(tasks),
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
    createTasks,
    deleteTasks,
    updateTask,
  };
}
