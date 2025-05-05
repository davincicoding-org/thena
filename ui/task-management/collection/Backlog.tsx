/* eslint-disable max-lines */
"use client";

import type { PaperProps } from "@mantine/core";
import type { IconProps } from "@tabler/icons-react";
import type { UseMutateFunction } from "@tanstack/react-query";
import {
  ActionIcon,
  Avatar,
  Badge,
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

import type {
  ProjectInsertExtended,
  ProjectSelect,
  StandaloneTask,
  TaskFilters,
  TaskId,
  TaskInsert,
  TaskSelect,
  TasksSortOptions,
  TaskTree,
  TaskUpdate,
} from "@/core/task-management";
import type { TaskFormProps } from "@/ui/task-management";
import {
  hasFiltersApplied,
  isTaskTree,
  taskInsertSchema,
  TASKS_SORT_OPTIONS,
} from "@/core/task-management";
import { Panel } from "@/ui/components/Panel";
import { useSyncInputState } from "@/ui/hooks/useSyncState";
import { TaskForm, useTaskForm } from "@/ui/task-management";
import { cn } from "@/ui/utils";

import type { TasksQueryOptionsHookReturn } from "../tasks/useTasksQueryOptions";
import { SubtaskForm } from "../task-form/SubtaskForm";
import { TaskWrapper } from "../task-form/TaskWrapper";

dayjs.extend(relativeTime);

// MARK: Component

export interface BacklogProps {
  mode: "select" | "edit";
  tasks: (TaskTree | StandaloneTask)[];
  filters: TaskFilters;
  sort: TasksSortOptions;
  onFiltersUpdate: TasksQueryOptionsHookReturn["updateFilters"];
  onSortUpdate: TasksQueryOptionsHookReturn["updateSort"];
  projects: ProjectSelect[];
  onAddTask?: (task: TaskInsert) => void;
  onUpdateTask?: (task: TaskUpdate & Pick<TaskSelect, "uid">) => void;
  onDeleteTask?: (taskId: TaskId) => void;
  onCreateProject?: UseMutateFunction<
    ProjectSelect | undefined,
    Error,
    ProjectInsertExtended
  >;
  selectedTasks?: TaskId[];
  onToggleTaskSelection?: (task: TaskId) => void;
}

export function Backlog({
  mode,
  filters,
  sort,
  tasks,
  onFiltersUpdate,
  onSortUpdate,
  projects,
  onAddTask,
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
              <TaskWrapper
                key={task.uid}
                className={
                  mode === "select"
                    ? cn(
                        "cursor-pointer outline! transition-all [&_*]:cursor-pointer!",
                        selectedTasks?.some(
                          (selectedTask) => selectedTask === task.uid,
                        )
                          ? "outline-[var(--mantine-primary-color-filled)]!"
                          : "outline-transparent! hover:outline! hover:outline-current!",
                      )
                    : undefined
                }
                onClick={
                  mode === "select"
                    ? () => onToggleTaskSelection?.(task.uid)
                    : undefined
                }
                task={
                  <TaskItem
                    mode={mode}
                    task={task}
                    onUpdate={(updates) =>
                      onUpdateTask?.({ uid: task.uid, ...updates })
                    }
                    projects={projects}
                    onCreateProject={onCreateProject}
                    TaskActions={({ defaultActions }) => (
                      <>
                        {/* {onRefineTask && (
                          <>
                            <Button
                              fullWidth
                              variant="subtle"
                              color="gray"
                              justify="flex-start"
                              onClick={() => onRefineTask(mainTask)}
                            >
                              Refine
                            </Button>
                            <Divider />
                          </>
                        )} */}
                        {defaultActions}
                        <Divider />
                        <Button
                          fullWidth
                          color="red"
                          radius={0}
                          variant="subtle"
                          justify="flex-start"
                          leftSection={<IconTrash size={16} />}
                          onClick={() => onDeleteTask?.(task.uid)}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  />
                }
                subtasks={
                  isTaskTree(task)
                    ? task.subtasks.map((subtask) => (
                        <TaskItem
                          key={subtask.uid}
                          task={subtask}
                          mode={mode}
                          isSubtask
                          onUpdate={(updates) =>
                            onUpdateTask?.({ uid: subtask.uid, ...updates })
                          }
                          onDelete={() => onDeleteTask?.(subtask.uid)}
                          projects={projects}
                          onCreateProject={onCreateProject}
                        />
                      ))
                    : undefined
                }
                onAddSubtask={(subtask) =>
                  onAddTask?.({
                    parentTaskId: task.uid,
                    ...subtask,
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

  const resolveProject = (
    projectId: ProjectSelect["uid"],
  ): ProjectSelect | undefined =>
    projects.find((project) => project.uid === projectId);

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
                          key={project.uid}
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
                          active={filters.projectIds?.includes(project.uid)}
                          onClick={() => {
                            onFiltersUpdate({
                              projectIds: filters.projectIds?.includes(
                                project.uid,
                              )
                                ? filters.projectIds?.filter(
                                    (id) => id !== project.uid,
                                  )
                                : [...(filters.projectIds ?? []), project.uid],
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

// MARK: Task Item

interface TaskItemProps
  extends Pick<TaskFormProps, "TaskActions" | "projects" | "onCreateProject"> {
  mode: "select" | "edit";
  task: TaskInsert;
  isSubtask?: boolean;
  onUpdate: (update: TaskInsert) => void;
  onDelete?: () => void;
}

function TaskItem({
  mode,
  task,
  isSubtask,
  onUpdate,
  onDelete,
  projects,
  TaskActions,
  onCreateProject,
}: TaskItemProps) {
  const form = useTaskForm({
    defaultValues: task,
    validators: {
      onChange: taskInsertSchema,
    },
    onSubmit: ({ value }) => onUpdate(value),
    listeners: {
      onChange: ({ formApi }) => {
        if (formApi.state.isValid) return;
        onUpdate(formApi.state.values);
      },
    },
  });

  if (isSubtask) return <SubtaskForm form={form} onRemove={onDelete} />;

  return (
    <TaskForm
      form={form}
      readOnly={mode !== "edit"}
      projects={projects}
      TaskActions={TaskActions}
      onCreateProject={onCreateProject}
    />
  );

  {
    /* <form.Subscribe
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
      /> */
  }
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
