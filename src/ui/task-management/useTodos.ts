import type { TaskSelect, TaskTree } from "@/core/task-management";
import { api } from "@/trpc/react";

export function useTodos() {
  const utils = api.useUtils();
  const { data = [], isLoading } = api.tasks.list.useQuery({
    status: "todo",
  });

  const createTasks = api.tasks.create.useMutation<{
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

  const bulkCreateTasks = api.tasks.bulkCreate.useMutation<TaskTree[]>({
    onSuccess: (taskTrees) => {
      utils.tasks.list.setData({ status: "todo" }, (prev = []) => [
        ...prev,
        ...taskTrees,
      ]);
    },
  });

  const updateTask = api.tasks.update.useMutation<{
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

  const deleteTask = api.tasks.delete.useMutation<{
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

  return {
    tasks: data,
    isLoading,
    createTasks,
    deleteTask,
    updateTask,
    bulkCreateTasks,
  };
}
