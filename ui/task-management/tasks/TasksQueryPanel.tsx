import type { IconProps } from "@tabler/icons-react";
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Collapse,
  Fieldset,
  Flex,
  Menu,
  NavLink,
  Popover,
  ScrollArea,
  TextInput,
} from "@mantine/core";
import {
  IconAbc,
  IconCalendar,
  IconFilter,
  IconSearch,
  IconSortAscending,
  IconSortDescending,
  IconX,
} from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

import type {
  ProjectSelect,
  TaskFilters,
  TasksSortOptions,
} from "@/core/task-management";
import type { TasksQueryOptionsHookReturn } from "@/ui/task-management";
import { TASKS_SORT_OPTIONS } from "@/core/task-management";
import { cn } from "@/ui/utils";

export interface TasksQueryPanelProps {
  filters: TaskFilters;
  sort: TasksSortOptions;
  onFiltersUpdate: TasksQueryOptionsHookReturn["updateFilters"];
  onSortUpdate: TasksQueryOptionsHookReturn["updateSort"];
  projects: ProjectSelect[];
  disabled?: boolean;
}

export function TasksQueryPanel({
  filters,
  sort,
  onFiltersUpdate,
  onSortUpdate,
  projects,
  disabled,
}: TasksQueryPanelProps) {
  const form = useForm({
    defaultValues: {
      title: filters.search ?? "",
    },
    validators: {
      onChange: z.object({
        title: z.string().trim().min(1),
      }),
    },
    listeners: {
      onChange: ({ formApi }) => {
        if (!formApi.state.isValid) return;
        onFiltersUpdate({ search: formApi.state.values.title });
      },
    },
  });

  const resolveProject = (
    projectId: ProjectSelect["id"],
  ): ProjectSelect | undefined =>
    projects.find((project) => project.id === projectId);

  return (
    <>
      <Flex p="xs" gap={4}>
        <form.Field
          name="title"
          children={(field) => (
            <TextInput
              placeholder="Search"
              leftSection={<IconSearch size={20} />}
              rightSection={
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  size="sm"
                  className={cn("transition-opacity", {
                    "pointer-events-none opacity-0":
                      field.state.value.length === 0,
                  })}
                  onClick={() => field.handleChange("")}
                >
                  <IconX size={12} />
                </ActionIcon>
              }
              value={field.state.value}
              disabled={disabled}
              mr="auto"
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        />

        {projects.length > 0 && (
          <Popover
            position="bottom-start"
            withArrow
            arrowPosition="center"
            arrowSize={12}
          >
            <Popover.Target>
              <ActionIcon
                aria-label="Filter Tasks"
                size="36"
                color="gray"
                variant="subtle"
                disabled={disabled}
              >
                <IconFilter size={20} />
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown p="xs">
              <Flex gap="sm">
                {projects.length > 0 && (
                  <Fieldset
                    legend="Projects"
                    p={0}
                    classNames={{ legend: "text-center" }}
                  >
                    <ScrollArea scrollbars="y" h={180}>
                      {projects.map((project) => (
                        <NavLink
                          key={project.id}
                          label={project.title}
                          leftSection={
                            <Avatar
                              // color={project?.color}
                              src={project?.image}
                              size={24}
                              radius="xl"
                              name={project.title}
                              alt={project.title}
                            />
                          }
                          component="button"
                          active={filters.projectIds?.includes(project.id)}
                          onClick={() => {
                            onFiltersUpdate({
                              projectIds: filters.projectIds?.includes(
                                project.id,
                              )
                                ? filters.projectIds?.filter(
                                    (id) => id !== project.id,
                                  )
                                : [...(filters.projectIds ?? []), project.id],
                            });
                          }}
                        />
                      ))}
                    </ScrollArea>
                  </Fieldset>
                )}
              </Flex>
            </Popover.Dropdown>
          </Popover>
        )}

        <Menu position="bottom-end">
          <Menu.Target>
            <Button
              leftSection={
                <SortDirectionIcon size={20} sort={sort.direction} />
              }
              variant="default"
              size="sm"
              disabled={disabled}
            >
              {getSortByLabel(sort.sortBy).short}
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            {TASKS_SORT_OPTIONS.sortBy.map((sortBy) => (
              <Menu.Item
                key={sortBy}
                color={sort.sortBy === sortBy ? "primary" : undefined}
                leftSection={<SortByIcon sortBy={sortBy} size={20} />}
                onClick={() => onSortUpdate({ sortBy })}
              >
                {getSortByLabel(sortBy).full}
              </Menu.Item>
            ))}
            <Menu.Divider />
            {TASKS_SORT_OPTIONS.direction.map((direction) => (
              <Menu.Item
                key={direction}
                color={sort.direction === direction ? "primary" : undefined}
                leftSection={<SortDirectionIcon sort={direction} size={20} />}
                onClick={() => onSortUpdate({ direction })}
              >
                {getSortDirectionLabel(direction)}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      </Flex>
      <Collapse in={Boolean(filters.projectIds?.length)}>
        <ScrollArea scrollbars="x" scrollHideDelay={300}>
          <Flex gap="xs" p="sm" pt={0}>
            {filters.projectIds?.map((projectId) => {
              const project = resolveProject(projectId);
              if (!project) return null;
              return (
                <Badge
                  key={projectId}
                  component="button"
                  className="shrink-0 cursor-pointer!"
                  // color={project.color ?? "gray"}
                  size="md"
                  variant="light"
                  autoContrast
                  rightSection={<IconX size={12} />}
                  onClick={() => {
                    onFiltersUpdate({
                      projectIds: filters.projectIds?.filter(
                        (id) => id !== projectId,
                      ),
                    });
                  }}
                >
                  {project.title}
                </Badge>
              );
            })}
          </Flex>
        </ScrollArea>
      </Collapse>
    </>
  );
}

// MARK: Icons & Labels

const getSortByLabel = (
  sort: TasksSortOptions["sortBy"],
): { full: string; short?: string } => {
  switch (sort) {
    case "title":
      return { full: "Title" };
    case "createdAt":
      return { full: "Creation Date", short: "Created" };
    case "updatedAt":
      return { full: "Last Updated", short: "Updated" };
  }
};

function SortByIcon({
  sortBy,
  ...iconProps
}: { sortBy: TasksSortOptions["sortBy"] } & IconProps) {
  switch (sortBy) {
    case "title":
      return <IconAbc {...iconProps} />;
    case "createdAt":
      return <IconCalendar {...iconProps} />;
    case "updatedAt":
      return <IconCalendar {...iconProps} />;
  }
}

const getSortDirectionLabel = (direction: TasksSortOptions["direction"]) => {
  switch (direction) {
    case "asc":
      return "Ascending";
    case "desc":
      return "Descending";
  }
};

function SortDirectionIcon({
  sort,
  ...iconProps
}: { sort: TasksSortOptions["direction"] } & IconProps) {
  switch (sort) {
    case "asc":
      return <IconSortAscending {...iconProps} />;
    case "desc":
      return <IconSortDescending {...iconProps} />;
  }
}
