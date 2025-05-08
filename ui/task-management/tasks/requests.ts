import { useUser } from "@clerk/nextjs";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { and, eq, inArray, isNull, notInArray } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

import type {
  FlatTask,
  StandaloneTask,
  TaskId,
  TaskInput,
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
          where: and(filterFn(tasks.id, options.ids), isNull(tasks.parentId)),
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

export const useFlatTasksQuery = (options: {
  ids: TaskId[];
  where: "include" | "exclude";
}) => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  return useQuery<FlatTask[]>(
    {
      queryKey: ["tasks-with-subtasks", options.ids, options.where],
      queryFn: async () => {
        if (!user) throw new Error("User not found");
        const db = await getClientDB();

        const filterFn = options.where === "include" ? inArray : notInArray;
        const parent = alias(tasks, "parent");

        const result = await db
          .select()
          .from(tasks)
          .where(
            and(eq(tasks.userId, user.id), filterFn(tasks.id, options.ids)),
          )
          .leftJoin(parent, eq(tasks.parentId, parent.id));

        return result.map<FlatTask>(({ tasks, parent }) => {
          if (parent) {
            return {
              ...tasks,
              parent,
            };
          }
          return tasks;
        });
      },
      placeholderData: keepPreviousData,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
    queryClient,
  );
};

// TODO add query invalidations

export const useCreateTask = () => {
  const { user } = useUser();

  return useMutation<TaskSelect | undefined, Error, TaskInput>({
    mutationKey: ["create-task"],
    mutationFn: async (input) => {
      console.log(user);
      if (!user) throw new Error("User not found");
      const db = await getClientDB();
      const result = await db
        .insert(tasks)
        .values({
          ...input,
          userId: user.id,
        })
        .returning();
      console.log(result);
      return result[0];
    },
  });
};

export const useUpdateTask = () => {
  return useMutation<
    TaskSelect | undefined,
    Error,
    TaskUpdate & Pick<TaskSelect, "id">
  >({
    mutationKey: ["update-task"],
    mutationFn: async ({ id, ...updates }) => {
      const db = await getClientDB();
      const result = await db
        .update(tasks)
        .set(updates)
        .where(eq(tasks.id, id))
        .returning();
      return result[0];
    },
  });
};

export const useDeleteTask = () => {
  return useMutation<TaskSelect | undefined, Error, TaskId>({
    mutationKey: ["delete-task"],
    mutationFn: async (id) => {
      const db = await getClientDB();
      const result = await db.delete(tasks).where(eq(tasks.id, id)).returning();
      return result[0];
    },
  });
};
