/* eslint-disable max-lines */
"use client";

import type { PaperProps } from "@mantine/core";
import type { IconProps } from "@tabler/icons-react";
import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  Collapse,
  Divider,
  Fieldset,
  Flex,
  Menu,
  NavLink,
  Popover,
  ScrollArea,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import {
  IconAbc,
  IconCalendar,
  IconFilter,
  IconSearch,
  IconSortAscending,
  IconSortDescending,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { isEqual } from "lodash-es";

import type {
  Project,
  ProjectInput,
  StoredTask,
  TaskFilters,
  TaskInput,
  TaskReference,
  TasksSortOptions,
} from "@/core/task-management";
import type { TaskFormProps } from "@/ui/task-management";
import { TASKS_SORT_OPTIONS } from "@/core/task-management";
import { Panel } from "@/ui/components/Panel";
import { useSyncInputState } from "@/ui/hooks/useSyncState";
import {
  hasFiltersApplied,
  TaskForm,
  taskFormOpts,
  useTaskForm,
} from "@/ui/task-management";
import { cn } from "@/ui/utils";

import type { TasksQueryOptionsHookReturn } from "./useTasksQueryOptions";

dayjs.extend(relativeTime);

// MARK: Component

export interface BacklogProps {
  mode: "select" | "edit";
  tasks: StoredTask[];
  filters: TaskFilters;
  sort: TasksSortOptions;
  onFiltersUpdate: TasksQueryOptionsHookReturn["updateFilters"];
  onSortUpdate: TasksQueryOptionsHookReturn["updateSort"];
  projects: Project[];
  onUpdateTask?: (
    taskId: StoredTask["id"],
    values: Partial<StoredTask>,
  ) => void;
  onDeleteTask?: (taskId: StoredTask["id"]) => void;
  onCreateProject?: (
    project: ProjectInput,
    onCreate: (project: Project) => void,
  ) => void;
  selectedTasks?: TaskReference[];
  onToggleTaskSelection?: (task: TaskReference) => void;
}

export function Backlog({
  mode,
  filters,
  sort,
  tasks,
  onFiltersUpdate,
  onSortUpdate,
  projects,
  onUpdateTask,
  onDeleteTask,
  onCreateProject,
  selectedTasks,
  onToggleTaskSelection,
  ...paperProps
}: BacklogProps & PaperProps) {
  return (
    <Panel
      header={
        <BacklogHeader
          disabled={tasks.length === 0}
          filters={filters}
          onFiltersUpdate={onFiltersUpdate}
          projects={projects}
          sort={sort}
          onSortUpdate={onSortUpdate}
        />
      }
      {...paperProps}
    >
      {tasks.length > 0 ? (
        <ScrollArea bg="neutral.8">
          <Stack px="md" py="lg">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                mode={mode}
                task={task}
                projects={projects}
                onUpdate={(values) => onUpdateTask?.(task.id, values)}
                onDelete={() => onDeleteTask?.(task.id)}
                onCreateProject={onCreateProject}
                selected={selectedTasks?.some(
                  (selectedTask) => selectedTask.taskId === task.id,
                )}
                onToggleSelection={() =>
                  onToggleTaskSelection?.({
                    taskId: task.id,
                    subtaskId: null,
                  })
                }
              />
            ))}
            <Text className="not-first:hidden" my="auto">
              Your Backlog is empty
            </Text>
          </Stack>
        </ScrollArea>
      ) : (
        <Center>
          <Text opacity={0.5} size="xl">
            {hasFiltersApplied(filters)
              ? "No tasks match your filters"
              : "Your Backlog is empty"}
          </Text>
        </Center>
      )}
    </Panel>
  );
}

// MARK: Header

interface BacklogHeaderProps
  extends Pick<
    BacklogProps,
    "filters" | "onFiltersUpdate" | "projects" | "sort" | "onSortUpdate"
  > {
  disabled?: boolean;
}

function BacklogHeader({
  disabled,
  filters,
  onFiltersUpdate,
  projects,
  sort,
  onSortUpdate,
}: BacklogHeaderProps) {
  const [searchValue, setSearchValue] = useSyncInputState(filters.search ?? "");

  const resolveProject = (projectId: string): Project =>
    projects.find((project) => project.id === projectId) ?? {
      id: projectId,
      name: projectId,
    };

  return (
    <>
      <Flex p="xs" gap={4}>
        <TextInput
          placeholder="Search"
          leftSection={<IconSearch size={20} />}
          value={searchValue}
          disabled={disabled}
          mr="auto"
          onChange={(e) => {
            setSearchValue(e);
            onFiltersUpdate({ search: e.target.value });
          }}
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
                          label={project.name}
                          leftSection={
                            <Avatar
                              color={project?.color}
                              src={project?.image}
                              size={24}
                              radius="xl"
                              name={project.name}
                              alt={project.name}
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

        <Menu>
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
      <Collapse
        in={
          Boolean(filters.projectIds?.length) || Boolean(filters.tags?.length)
        }
      >
        <ScrollArea scrollbars="x" scrollHideDelay={300}>
          <Flex gap="xs" p="sm" pt={0}>
            {filters.projectIds?.map((projectId) => {
              const project = resolveProject(projectId);
              return (
                <Badge
                  key={projectId}
                  component="button"
                  className="shrink-0 cursor-pointer!"
                  color={project.color ?? "gray"}
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
                  {project.name}
                </Badge>
              );
            })}
          </Flex>
        </ScrollArea>
      </Collapse>
    </>
  );
}

// MARK: Task Item

interface TaskItemProps
  extends Pick<TaskFormProps, "projects" | "onCreateProject"> {
  mode: "select" | "edit";
  task: StoredTask;
  selected?: boolean;
  onToggleSelection: () => void;
  onUpdate?: (values: Partial<StoredTask>) => void;
  onDelete?: () => void;
}

function TaskItem({
  mode,
  task,
  onUpdate,
  onDelete,
  projects,
  selected,
  onCreateProject,
  onToggleSelection,
}: TaskItemProps) {
  const form = useTaskForm({
    ...taskFormOpts,
    defaultValues: task as TaskInput,
    onSubmit: ({ value }) => onUpdate?.(value),
  });
  return (
    <Box>
      <TaskForm
        form={form}
        containerProps={
          mode === "select"
            ? {
                className: cn(
                  "cursor-pointer outline! transition-all [&_*]:cursor-pointer!",
                  selected
                    ? "outline-[var(--mantine-primary-color-filled)]!"
                    : "outline-transparent! hover:outline! hover:outline-current!",
                ),
                onClick: onToggleSelection,
              }
            : undefined
        }
        readOnly={mode !== "edit"}
        projects={projects}
        TaskActions={({ defaultActions }) => (
          <>
            {defaultActions}
            <Divider />
            <Button
              fullWidth
              color="red"
              variant="subtle"
              justify="flex-start"
              radius={0}
              leftSection={<IconTrash size={16} />}
              onClick={onDelete}
            >
              Delete
            </Button>
          </>
        )}
        onCreateProject={onCreateProject}
      />
      <form.Subscribe
        selector={(state) => !isEqual(state.values, task) && state.isValid}
        children={(hasChanged) => (
          <Collapse in={hasChanged} mt={4}>
            <Button
              ml="auto"
              size="xs"
              fullWidth
              onClick={(e) => {
                void form.handleSubmit();
                e.currentTarget.blur();
              }}
            >
              Save Changes
            </Button>
          </Collapse>
        )}
      />
    </Box>
  );
}

// MARK: Utility Functions

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
