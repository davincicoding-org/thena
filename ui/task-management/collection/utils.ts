import type { TaskFilters } from "@/core/task-management";

export const hasFiltersApplied = ({
  projectIds,
  tags,
  search,
}: TaskFilters) => {
  return Boolean(projectIds?.length ?? tags?.length ?? search);
};
