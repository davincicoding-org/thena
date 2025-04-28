import { useCallback, useState } from "react";

import type {
  BacklogFilters,
  BacklogSortOptions,
  BacklogTask,
} from "@/core/task-management";

import { hasFiltersApplied } from "./utils";

export interface BacklogHookOptions {
  defaultFilters?: BacklogFilters;
  defaultSort?: BacklogSortOptions;
}

export interface BacklogQueryOptionsHookReturn {
  filters: BacklogFilters;
  filterTasks: (tasks: BacklogTask[]) => BacklogTask[];
  updateFilters: (updates: Partial<BacklogFilters>) => void;
  sort: BacklogSortOptions;
  sortFn: (a: BacklogTask, b: BacklogTask) => number;
  updateSort: (updates: Partial<BacklogSortOptions>) => void;
}

/**
 * Manages filters and sorting for a backlog of tasks.
 */
export function useBacklogQueryOptions({
  defaultFilters = {},
  defaultSort = { sortBy: "addedAt", direction: "desc" },
}: BacklogHookOptions = {}) {
  const [{ sort, filters }, setOptions] = useState({
    filters: defaultFilters,
    sort: defaultSort,
  });
  const updateFilters = useCallback<
    BacklogQueryOptionsHookReturn["updateFilters"]
  >(
    (updates) => {
      setOptions((prev) => ({
        ...prev,
        filters: { ...prev.filters, ...updates },
      }));
    },
    [setOptions],
  );

  const filterTasks = useCallback<BacklogQueryOptionsHookReturn["filterTasks"]>(
    (items) => {
      if (!hasFiltersApplied(filters)) return items;

      return items.reduce<BacklogTask[]>((acc, task) => {
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          const titleHasSearch = task.title.toLowerCase().includes(searchLower);
          if (!titleHasSearch) return acc;
        }

        if (filters.projectIds?.length) {
          if (task.projectId === undefined) return acc;
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
    },
    [filters],
  );

  const updateSort = useCallback<BacklogQueryOptionsHookReturn["updateSort"]>(
    (updates) => {
      setOptions((prev) => ({ ...prev, sort: { ...prev.sort, ...updates } }));
    },
    [setOptions],
  );

  const sortFn = useCallback<BacklogQueryOptionsHookReturn["sortFn"]>(
    (a, b) => {
      const direction = sort.direction === "asc" ? 1 : -1;
      if (sort.sortBy === "addedAt") {
        return (
          direction *
          (new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime())
        );
      }
      return direction * a.title.localeCompare(b.title);
    },
    [sort],
  );

  return {
    filters,
    filterTasks,
    updateFilters,
    sort,
    sortFn,
    updateSort,
  };
}
