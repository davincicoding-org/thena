import { useState } from "react";

import type {
  StoredTask,
  TaskFilters,
  TasksSortOptions,
} from "@/core/task-management";

import { hasFiltersApplied } from "./utils";

export interface TasksHookOptions {
  defaultFilters?: TaskFilters;
  defaultSort?: TasksSortOptions;
}

export interface TasksQueryOptionsHookReturn {
  filters: TaskFilters;
  filterTasks: (tasks: StoredTask[]) => StoredTask[];
  updateFilters: (updates: Partial<TaskFilters>) => void;
  sort: TasksSortOptions;
  sortFn: (a: StoredTask, b: StoredTask) => number;
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

    return items.reduce<StoredTask[]>((acc, task) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const titleHasSearch = task.title.toLowerCase().includes(searchLower);
        if (!titleHasSearch) return acc;
      }

      if (filters.projectIds?.length) {
        if (!task.projectId) return acc;
        if (!filters.projectIds.includes(task.projectId)) return acc;
      }

      if (filters.tags?.length) {
        const taskHasTag = task.tags?.some((tag) =>
          filters.tags?.includes(tag),
        );
        const subtaskHasTag = task.subtasks?.some((subtask) =>
          subtask.tags?.some((tag) => filters.tags?.includes(tag)),
        );

        if (!taskHasTag && !subtaskHasTag) return acc;

        if (!taskHasTag)
          task.subtasks = task.subtasks?.filter((subtask) =>
            subtask.tags?.some((tag) => filters.tags?.includes(tag)),
          );
      }
      return [...acc, task];
    }, []);
  };

  const updateSort: TasksQueryOptionsHookReturn["updateSort"] = (updates) => {
    setOptions((prev) => ({ ...prev, sort: { ...prev.sort, ...updates } }));
  };

  const sortFn: TasksQueryOptionsHookReturn["sortFn"] = (a, b) => {
    const direction = sort.direction === "asc" ? 1 : -1;
    if (sort.sortBy === "createdAt") {
      return (
        direction *
        (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      );
    }
    return direction * a.title.localeCompare(b.title);
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
