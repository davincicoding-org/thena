import { useMemo } from "react";

import type { ProjectSelect, TaskTree } from "@/core/task-management";

export interface TaskFilters {
  project: ProjectSelect["id"] | null | "unassigned";
  sort: "default" | "priority";
}

export function useFilteredTasks(allTasks: TaskTree[], filters: TaskFilters) {
  return useMemo(() => {
    const withFiltersApplied = allTasks.filter((task) => {
      if (filters.project === "unassigned" && task.projectId !== null)
        return false;
      if (
        typeof filters.project === "number" &&
        task.projectId !== filters.project
      )
        return false;
      return true;
    });

    if (filters.sort === "default") return withFiltersApplied;

    return withFiltersApplied.sort((a, b) => {
      if (a.priority === b.priority) return a.sortOrder - b.sortOrder;
      return a.priority > b.priority ? -1 : 1;
    });
  }, [allTasks, filters]);
}
