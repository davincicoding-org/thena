import { useCallback, useMemo, useState } from "react";
import { nanoid } from "nanoid";

import {
  BacklogFilters,
  BacklogSortOptions,
  BacklogTask,
  StateHook,
  Task,
} from "../../../core/task-management/types";

export interface BacklogHookOptions {
  initialTasks?: BacklogTask[];
  stateAdapter?: StateHook<BacklogTask[]>;
  defaultFilters?: BacklogFilters;
  filterStateAdapter?: StateHook<BacklogFilters>;
  defaultSort?: BacklogSortOptions;
  sortStateAdapter?: StateHook<BacklogSortOptions>;
}

export interface BacklogHookReturn {
  filters: BacklogFilters;
  updateFilters: (updates: Partial<BacklogFilters>) => void;
  sort: BacklogSortOptions;
  updateSort: (updates: Partial<BacklogSortOptions>) => void;
  tasks: BacklogTask[];

  // Task operations
  addTask: (task: Omit<Task, "id">) => void;
  addTasks: (tasks: Omit<Task, "id">[]) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, "id">>) => void;
  removeTask: (id: string) => void;
  removeTasks: (ids: string[]) => void;
}

/**
 * Manages the backlog of tasks with support for
 * create, update, delete, filtering, sorting, and undo/redo.
 */
export function useBacklog({
  initialTasks = [],
  stateAdapter: useTasksState = useState,
  defaultFilters = {},
  filterStateAdapter: useFiltersState = useState,
  defaultSort = { sortBy: "addedAt", direction: "desc" },
  sortStateAdapter: useSortState = useState,
}: BacklogHookOptions = {}) {
  // State management
  const [allTasks, setAllTasks] = useTasksState(initialTasks);

  const [filters, setFilters] = useFiltersState(defaultFilters);
  const updateFilters = useCallback<BacklogHookReturn["updateFilters"]>(
    (updates: Partial<BacklogFilters>) => {
      setFilters({ ...filters, ...updates });
    },
    [filters, setFilters],
  );

  const [sort, setSort] = useSortState(defaultSort);
  const updateSort = useCallback<BacklogHookReturn["updateSort"]>(
    (updates: Partial<BacklogSortOptions>) => {
      setSort({ ...sort, ...updates });
    },
    [sort, setSort],
  );

  // Task operations
  const addTask = useCallback<BacklogHookReturn["addTask"]>(
    (task: Omit<Task, "id">) => {
      const newTask: BacklogTask = {
        ...task,
        id: nanoid(),
        addedAt: new Date().toISOString(),
      };
      setAllTasks([...allTasks, newTask]);
    },
    [allTasks, setAllTasks],
  );

  const addTasks = useCallback<BacklogHookReturn["addTasks"]>(
    (newTasks: Omit<Task, "id">[]) => {
      const tasksWithIds = newTasks.map((task) => ({
        ...task,
        id: nanoid(),
        addedAt: new Date().toISOString(),
      }));
      setAllTasks([...allTasks, ...tasksWithIds]);
    },
    [allTasks, setAllTasks],
  );

  const updateTask = useCallback<BacklogHookReturn["updateTask"]>(
    (id: string, updates: Partial<Omit<Task, "id">>) => {
      setAllTasks(
        allTasks.map((task) =>
          task.id === id ? { ...task, ...updates } : task,
        ),
      );
    },
    [allTasks, setAllTasks],
  );

  const removeTask = useCallback<BacklogHookReturn["removeTask"]>(
    (id: string) => {
      setAllTasks(allTasks.filter((task) => task.id !== id));
    },
    [allTasks, setAllTasks],
  );

  const removeTasks = useCallback<BacklogHookReturn["removeTasks"]>(
    (ids: string[]) => {
      setAllTasks(allTasks.filter((task) => !ids.includes(task.id)));
    },
    [allTasks, setAllTasks],
  );

  // Filter and sort tasks
  const tasks = useMemo(() => {
    return allTasks
      .reduce<BacklogTask[]>((acc, task) => {
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          const titleHasSearch = task.title.toLowerCase().includes(searchLower);
          const descriptionHasSearch = task.description
            ?.toLowerCase()
            .includes(searchLower);
          if (!titleHasSearch && !descriptionHasSearch) return acc;
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
      }, [])
      .sort((a, b) => {
        const direction = sort.direction === "asc" ? 1 : -1;
        if (sort.sortBy === "addedAt") {
          return (
            direction *
            (new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime())
          );
        }
        return direction * a.title.localeCompare(b.title);
      });
  }, [allTasks, filters, sort]);

  return {
    filters,
    updateFilters,
    sort,
    updateSort,
    tasks,
    addTask,
    addTasks,
    updateTask,
    removeTask,
    removeTasks,
  };
}
