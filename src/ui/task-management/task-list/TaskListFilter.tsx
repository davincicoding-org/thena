import type { BoxProps } from "@mantine/core";
import { useRef } from "react";
import { Flex, Select } from "@mantine/core";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";

import type { ProjectSelect } from "@/core/task-management";
import { ProjectAvatar } from "@/ui/task-management";
import { cn, derive } from "@/ui/utils";

import type { TaskFilters } from "./useFilteredTasks";
import { TaskListSort } from "./TaskListSort";

export interface TaskListFilterProps {
  filters: TaskFilters;
  onUpdateFilters: (filters: Partial<TaskFilters>) => void;
  projects: ProjectSelect[];
  className?: string;
}

export function TaskListFilter({
  filters,
  onUpdateFilters,
  projects,
  className,
  ...boxProps
}: TaskListFilterProps & BoxProps) {
  const selectRef = useRef<HTMLInputElement>(null);
  const selectedProject = projects.find(
    (project) => project.id === filters.project,
  );

  return (
    <Flex className={cn("h-14 items-center", className)} {...boxProps}>
      <AnimatePresence mode="wait">
        {selectedProject && (
          <m.div
            key={filters.project}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ProjectAvatar project={selectedProject} radius={0} size={56} />
          </m.div>
        )}
      </AnimatePresence>

      <Select
        value={derive(() => {
          if (filters.project === null) return null;
          if (filters.project === "unassigned") return "unassigned";
          return filters.project.toString();
        })}
        classNames={{
          root: cn("mx-2"),
        }}
        ref={selectRef}
        clearable={filters.project !== undefined}
        placeholder="All Tasks"
        data={[
          {
            label: "Without Project",
            value: "unassigned",
          },
          {
            group: "Projects",
            items: projects.map((project) => ({
              label: project.title,
              value: project.id.toString(),
            })),
          },
        ]}
        onChange={(value) => {
          selectRef.current?.blur();
          if (value === null) return onUpdateFilters({ project: null });
          if (value === "unassigned")
            return onUpdateFilters({ project: "unassigned" });
          onUpdateFilters({ project: Number(value) });
        }}
      />

      <TaskListSort
        className="mr-3 ml-auto shrink-0"
        size="input-sm"
        variant="subtle"
        color="gray"
        sort={filters.sort}
        onChange={(sort) => onUpdateFilters({ sort })}
      />
    </Flex>
  );
}
