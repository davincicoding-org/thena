"use client";

import { useCallback, useRef } from "react";
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
  HoverCard,
  Menu,
  Modal,
  NavLink,
  PaperProps,
  ScrollArea,
  Space,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconAbc,
  IconCalendar,
  IconFilter,
  IconProps,
  IconSearch,
  IconSortAscending,
  IconSortDescending,
  IconTag,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { isEqual } from "lodash-es";

import {
  BACKLOG_SORT_OPTIONS,
  BacklogFilters,
  BacklogSortOptions,
  BacklogTask,
  Project,
  ProjectInput,
  Tag,
  TagInput,
  TaskInput,
} from "@/core/task-management";
import { Panel } from "@/ui/components/Panel";
import { useSyncInputState } from "@/ui/hooks/useSyncState";
import {
  hasFiltersApplied,
  ProjectCreator,
  TagCreator,
  TaskForm,
  taskFormOpts,
  TaskFormProps,
  useTaskForm,
} from "@/ui/task-management";
import { cn } from "@/ui/utils";

import { BacklogQueryOptionsHookReturn } from "./useBacklogQueryOptions";

dayjs.extend(relativeTime);

// MARK: Component

export interface BacklogProps {
  mode: "select" | "edit";
  tasks: BacklogTask[];
  filters: BacklogFilters;
  sort: BacklogSortOptions;
  onFiltersUpdate: BacklogQueryOptionsHookReturn["updateFilters"];
  onSortUpdate: BacklogQueryOptionsHookReturn["updateSort"];
  projects: Project[];
  tags: Tag[];
  onUpdateTask?: (
    taskId: BacklogTask["id"],
    values: Partial<BacklogTask>,
  ) => void;
  onDeleteTask?: (taskId: BacklogTask["id"]) => void;
  onCreateProject?: (
    project: ProjectInput,
    onCreate: (project: Project) => void,
  ) => void;
  onCreateTag?: (tag: TagInput, onCreate: (tag: Tag) => void) => void;
  selectedTasks?: BacklogTask["id"][];
  onToggleTaskSelection?: (task: BacklogTask["id"]) => void;
}

export function Backlog({
  mode,
  filters,
  sort,
  tasks,
  onFiltersUpdate,
  onSortUpdate,
  projects,
  tags,
  onUpdateTask,
  onDeleteTask,
  onCreateProject,
  onCreateTag,
  selectedTasks,
  onToggleTaskSelection,
  ...paperProps
}: BacklogProps & PaperProps) {
  const [isCreatingProject, projectAdder] = useDisclosure(false);
  const createProjectCallback = useRef<(project: Project) => void>(null);

  const [isCreatingTag, tagAdder] = useDisclosure(false);
  const createTagCallback = useRef<(tag: Tag) => void>(null);

  return (
    <>
      <Panel
        header={
          <BacklogHeader
            filters={filters}
            onFiltersUpdate={onFiltersUpdate}
            projects={projects}
            tags={tags}
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
                  tags={tags}
                  onUpdate={(values) => onUpdateTask?.(task.id, values)}
                  onDelete={() => onDeleteTask?.(task.id)}
                  onAssignToNewProject={(callback) => {
                    createProjectCallback.current = callback;
                    projectAdder.open();
                  }}
                  onAttachNewTag={(callback) => {
                    createTagCallback.current = callback;
                    tagAdder.open();
                  }}
                  selected={selectedTasks?.includes(task.id)}
                  onToggleSelection={() => onToggleTaskSelection?.(task.id)}
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
      <Modal
        opened={isCreatingProject}
        centered
        withCloseButton={false}
        transitionProps={{ transition: "pop" }}
        onClose={() => {
          projectAdder.close();
          createProjectCallback.current = null;
        }}
      >
        <ProjectCreator
          onCreate={(values) => {
            projectAdder.close();
            onCreateProject?.(values, (project) => {
              if (createProjectCallback.current === null) return;
              createProjectCallback.current(project);
              createProjectCallback.current = null;
            });
          }}
        />
      </Modal>
      <Modal
        opened={isCreatingTag}
        centered
        withCloseButton={false}
        transitionProps={{ transition: "pop" }}
        onClose={() => {
          tagAdder.close();
          createTagCallback.current = null;
        }}
      >
        <TagCreator
          onCreate={(values) => {
            tagAdder.close();
            onCreateTag?.(values, (tag) => {
              if (createTagCallback.current === null) return;
              createTagCallback.current(tag);
              createTagCallback.current = null;
            });
          }}
        />
      </Modal>
    </>
  );
}

// MARK: Header

interface BacklogHeaderProps
  extends Pick<
    BacklogProps,
    | "filters"
    | "onFiltersUpdate"
    | "projects"
    | "tags"
    | "sort"
    | "onSortUpdate"
  > {}
function BacklogHeader({
  filters,
  onFiltersUpdate,
  projects,
  tags,
  sort,
  onSortUpdate,
}: BacklogHeaderProps) {
  const [searchValue, setSearchValue] = useSyncInputState(filters.search || "");

  const resolveProject = useCallback(
    (projectId: string): Project =>
      projects.find((project) => project.id === projectId) || {
        id: projectId,
        name: projectId,
      },
    [projects],
  );

  const resolveTag = useCallback(
    (tagId: string): Tag =>
      tags.find((tag) => tag.id === tagId) || {
        id: tagId,
        name: tagId,
      },
    [tags],
  );

  return (
    <>
      <Flex p="xs" gap={4}>
        <TextInput
          placeholder="Search"
          leftSection={<IconSearch size={20} />}
          value={searchValue}
          mr="auto"
          onChange={(e) => {
            setSearchValue(e);
            onFiltersUpdate({ search: e.target.value });
          }}
        />
        {(projects.length > 0 || tags.length > 0) && (
          <HoverCard
            position="bottom-start"
            withArrow
            arrowPosition="center"
            arrowSize={12}
          >
            <HoverCard.Target>
              <ActionIcon
                aria-label="Filter Tasks"
                size="36"
                color="gray"
                variant="subtle"
              >
                <IconFilter size={20} />
              </ActionIcon>
            </HoverCard.Target>
            <HoverCard.Dropdown p="xs">
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
                                : [...(filters.projectIds || []), project.id],
                            });
                          }}
                        />
                      ))}
                    </ScrollArea>
                  </Fieldset>
                )}
                {tags.length > 0 && (
                  <Fieldset
                    legend="Tags"
                    p={0}
                    classNames={{ legend: "text-center" }}
                  >
                    <ScrollArea scrollbars="y" h={180}>
                      {tags.map((tag) => (
                        <NavLink
                          key={tag.id}
                          label={tag.name}
                          leftSection={
                            <Box
                              bg={tag.color || "gray"}
                              className="h-4 w-4 rounded-full"
                            />
                          }
                          component="button"
                          active={filters.tags?.includes(tag.id)}
                          onClick={() => {
                            onFiltersUpdate({
                              tags: filters.tags?.includes(tag.id)
                                ? filters.tags?.filter((id) => id !== tag.id)
                                : [...(filters.tags || []), tag.id],
                            });
                          }}
                        />
                      ))}
                    </ScrollArea>
                  </Fieldset>
                )}
              </Flex>
            </HoverCard.Dropdown>
          </HoverCard>
        )}

        <Menu>
          <Menu.Target>
            <Button
              leftSection={<SortDirectionIcon sort={sort.direction} />}
              variant="default"
              size="sm"
            >
              {getSortByLabel(sort.sortBy).short}
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            {BACKLOG_SORT_OPTIONS.sortBy.map((sortBy) => (
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
            {BACKLOG_SORT_OPTIONS.direction.map((direction) => (
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
                  color={project.color || "gray"}
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
            <Divider
              orientation="vertical"
              color="neutral.2"
              className="first:hidden last:hidden"
            />
            {filters.tags?.map((tagId) => {
              const tag = resolveTag(tagId);
              return (
                <Badge
                  key={tagId}
                  component="button"
                  className="shrink-0 cursor-pointer!"
                  color={tag.color || "gray"}
                  size="md"
                  variant="light"
                  autoContrast
                  leftSection={<IconTag size={12} />}
                  rightSection={<IconX size={12} />}
                  onClick={() => {
                    onFiltersUpdate({
                      tags: filters.tags?.filter((id) => id !== tagId),
                    });
                  }}
                >
                  {tag.name}
                </Badge>
              );
            })}
            <Space w={2} />
          </Flex>
        </ScrollArea>
      </Collapse>
    </>
  );
}

// MARK: Task Item

interface TaskItemProps
  extends Pick<
    TaskFormProps,
    "projects" | "onAssignToNewProject" | "tags" | "onAttachNewTag"
  > {
  mode: "select" | "edit";
  task: BacklogTask;
  selected?: boolean;
  onToggleSelection: () => void;
  onUpdate?: (values: Partial<BacklogTask>) => void;
  onDelete?: () => void;
}

function TaskItem({
  mode,
  task,
  onUpdate,
  onDelete,
  projects,
  tags,
  selected,
  onAssignToNewProject,
  onAttachNewTag,
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
        tags={tags}
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
        onAssignToNewProject={onAssignToNewProject}
        onAttachNewTag={onAttachNewTag}
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
                form.handleSubmit();
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
  sort: BacklogSortOptions["sortBy"],
): { full: string; short?: string } => {
  switch (sort) {
    case "title":
      return { full: "Title" };
    case "addedAt":
      return { full: "Date added", short: "Added" };
  }
};

function SortByIcon({
  sortBy,
  ...iconProps
}: { sortBy: BacklogSortOptions["sortBy"] } & IconProps) {
  switch (sortBy) {
    case "title":
      return <IconAbc {...iconProps} />;
    case "addedAt":
      return <IconCalendar {...iconProps} />;
  }
}

const getSortDirectionLabel = (direction: BacklogSortOptions["direction"]) => {
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
}: { sort: BacklogSortOptions["direction"] } & IconProps) {
  switch (sort) {
    case "asc":
      return <IconSortAscending {...iconProps} />;
    case "desc":
      return <IconSortDescending {...iconProps} />;
  }
}
