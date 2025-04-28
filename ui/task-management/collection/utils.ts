import type { BacklogFilters } from "@/core/task-management";

export const hasFiltersApplied = ({
  projectIds,
  tags,
  search,
}: BacklogFilters) => {
  return Boolean(projectIds?.length ?? tags?.length ?? search);
};
