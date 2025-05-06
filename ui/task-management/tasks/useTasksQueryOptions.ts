import { useState } from "react";

import type {
  StandaloneTask,
  TaskFilters,
  TasksSortOptions,
  TaskTree,
} from "@/core/task-management";
import { hasFiltersApplied } from "@/core/task-management";

export interface TasksHookOptions {
  defaultFilters?: TaskFilters;
  defaultSort?: TasksSortOptions;
}

export interface TasksQueryOptionsHookReturn {
  filters: TaskFilters;
  filterTasks: (
    tasks: (TaskTree | StandaloneTask)[],
  ) => (TaskTree | StandaloneTask)[];
  updateFilters: (updates: Partial<TaskFilters>) => void;
  sort: TasksSortOptions;
  sortFn: (
    a: TaskTree | StandaloneTask,
    b: TaskTree | StandaloneTask,
  ) => number;
  updateSort: (updates: Partial<TasksSortOptions>) => void;
}

/**
 * Manages filters and sorting for a backlog of tasks.
 */
export function useTasksQueryOptions({
  defaultFilters = {},
  defaultSort = { sortBy: "createdAt", direction: "desc" },
}: TasksHookOptions = {}) {
  const [{ sort, filters }, setOptions] = useState({
    filters: defaultFilters,
    sort: defaultSort,
  });
  const updateFilters: TasksQueryOptionsHookReturn["updateFilters"] = (
    updates,
  ) => {
    setOptions((prev) => ({
      ...prev,
      filters: { ...prev.filters, ...updates },
    }));
  };

  const filterTasks: TasksQueryOptionsHookReturn["filterTasks"] = (items) => {
    if (!hasFiltersApplied(filters)) return items;

    return items.reduce<(TaskTree | StandaloneTask)[]>((acc, task) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const titleHasSearch = task.title.toLowerCase().includes(searchLower);
        if (!titleHasSearch) return acc;
      }

      if (filters.projectIds?.length) {
        if (!task.projectId) return acc;
        if (!filters.projectIds.includes(task.projectId)) return acc;
      }

      // if (filters.tags?.length) {
      //   const taskHasTag = task.tags?.some((tag) =>
      //     filters.tags?.includes(tag),
      //   );
      //   const subtaskHasTag = task.subtasks?.some((subtask) =>
      //     subtask.tags?.some((tag) => filters.tags?.includes(tag)),
      //   );

      //   if (!taskHasTag && !subtaskHasTag) return acc;

      //   if (!taskHasTag)
      //     task.subtasks = task.subtasks?.filter((subtask) =>
      //       subtask.tags?.some((tag) => filters.tags?.includes(tag)),
      //     );
      // }
      return [...acc, task];
    }, []);
  };

  const updateSort: TasksQueryOptionsHookReturn["updateSort"] = (updates) => {
    setOptions((prev) => ({ ...prev, sort: { ...prev.sort, ...updates } }));
  };

  const sortFn: TasksQueryOptionsHookReturn["sortFn"] = (a, b) => {
    const direction = sort.direction === "asc" ? 1 : -1;
    switch (sort.sortBy) {
      case "createdAt":
        return (
          direction *
          (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        );
      case "updatedAt":
        return (
          direction *
          (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
        );
      case "title":
        return direction * a.title.localeCompare(b.title);
    }
  };

  return {
    filters,
    filterTasks,
    updateFilters,
    sort,
    sortFn,
    updateSort,
  };
}
