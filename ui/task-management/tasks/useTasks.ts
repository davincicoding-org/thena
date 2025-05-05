import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { and, eq, inArray, isNull, notInArray } from "drizzle-orm";

import type {
  StandaloneTask,
  TaskId,
  TaskInsert,
  TaskSelect,
  TaskTree,
  TaskUpdate,
} from "@/core/task-management";
import { getClientDB } from "@/db/client";
import { tasks } from "@/db/schema";

export const useTasksWithSubtasksQuery = (options: {
  ids: TaskId[];
  where: "include" | "exclude";
}) => {
  const queryClient = useQueryClient();
  return useQuery<(TaskTree | StandaloneTask)[]>(
    {
      queryKey: ["tasks-with-subtasks", options.ids, options.where],
      queryFn: async () => {
        const db = await getClientDB();

        const filterFn = options.where === "include" ? inArray : notInArray;

        const result = await db.query.tasks.findMany({
          where: and(
            filterFn(tasks.uid, options.ids),
            isNull(tasks.parentTaskId),
          ),
          with: {
            subtasks: true,
          },
        });

        return result;
      },
      placeholderData: keepPreviousData,
    },
    queryClient,
  );
};

// TODO add query invalidations

export const useCreateTask = () => {
  return useMutation<TaskSelect | undefined, Error, TaskInsert>({
    mutationKey: ["create-task"],
    mutationFn: async (input) => {
      const db = await getClientDB();
      const result = await db.insert(tasks).values(input).returning();
      return result[0];
    },
  });
};

export const useUpdateTask = () => {
  return useMutation<
    TaskSelect | undefined,
    Error,
    TaskUpdate & Pick<TaskSelect, "uid">
  >({
    mutationKey: ["update-task"],
    mutationFn: async ({ uid, ...updates }) => {
      const db = await getClientDB();
      const result = await db
        .update(tasks)
        .set(updates)
        .where(eq(tasks.uid, uid))
        .returning();
      return result[0];
    },
  });
};

export const useDeleteTask = () => {
  return useMutation<TaskSelect | undefined, Error, TaskId>({
    mutationKey: ["delete-task"],
    mutationFn: async (uid) => {
      const db = await getClientDB();
      const result = await db
        .delete(tasks)
        .where(eq(tasks.uid, uid))
        .returning();
      return result[0];
    },
  });
};
