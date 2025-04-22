"use client";

import { Fragment, useCallback } from "react";
import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Collapse,
  ColorSwatch,
  Divider,
  Fieldset,
  Flex,
  Group,
  HoverCard,
  Menu,
  MultiSelect,
  NavLink,
  Paper,
  PaperProps,
  Pill,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import {
  IconAbc,
  IconCalendar,
  IconFilter,
  IconProps,
  IconSearch,
  IconSortAscending,
  IconSortDescending,
  IconTag,
  IconX,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import {
  BACKLOG_SORT_OPTIONS,
  BacklogFilters,
  BacklogSortOptions,
  BacklogTask,
  hasSubtasks,
  Project,
  Subtask,
  Tag,
} from "@/core/task-management";
import { Panel } from "@/ui/components/Panel";
import { useSyncInputState } from "@/ui/hooks/useSyncState";

import { BacklogHookReturn } from "./useBacklog";

dayjs.extend(relativeTime);

export interface BacklogProps {
  tasks: BacklogTask[];
  filters: BacklogFilters;
  sort: BacklogSortOptions;
  onFiltersUpdate: BacklogHookReturn["updateFilters"];
  onSortUpdate: BacklogHookReturn["updateSort"];
  projects: Project[];
  tags: Tag[];
}

export function Backlog({
  filters,
  sort,
  tasks,
  onFiltersUpdate,
  onSortUpdate,
  projects,
  tags,
  ...paperProps
}: BacklogProps & PaperProps) {
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
    <Panel
      header={
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
                  <ActionIcon size="36" color="gray" variant="subtle">
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
                                    : [
                                        ...(filters.projectIds || []),
                                        project.id,
                                      ],
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
                                    ? filters.tags?.filter(
                                        (id) => id !== tag.id,
                                      )
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
                  {getSortByLabel(sort.sortBy)}
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
                    {getSortByLabel(sortBy)}
                  </Menu.Item>
                ))}
                <Menu.Divider />
                {BACKLOG_SORT_OPTIONS.direction.map((direction) => (
                  <Menu.Item
                    key={direction}
                    color={sort.direction === direction ? "primary" : undefined}
                    leftSection={
                      <SortDirectionIcon sort={direction} size={20} />
                    }
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
              Boolean(filters.projectIds?.length) ||
              Boolean(filters.tags?.length)
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
                      className="cursor-pointer!"
                      color={project.color || "gray"}
                      size="md"
                      variant="light"
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
                      className="cursor-pointer!"
                      color={tag.color || "gray"}
                      size="md"
                      variant="light"
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
              </Flex>
            </ScrollArea>
          </Collapse>
        </>
      }
      {...paperProps}
    >
      <ScrollArea bg="neutral.8">
        <Stack px="md" py="lg">
          {tasks.map((task) => {
            const project = task.projectId && resolveProject(task.projectId);
            const tags = task.tags && task.tags.map(resolveTag);

            return (
              <Paper
                key={task.id}
                withBorder
                className="overflow-clip"
                radius="md"
              >
                <Paper
                  {...(hasSubtasks(task)
                    ? {
                        withBorder: true,
                        mt: -1,
                        mx: -1,
                        bg: "neutral.6",
                        radius: "md",
                      }
                    : { radius: 0 })}
                >
                  <NavLink
                    label={task.title}
                    component="div"
                    className="pointer-events-none"
                    color="gray"
                    leftSection={
                      project && (
                        <Tooltip label={project.name} position="bottom-start">
                          <Avatar
                            className="pointer-events-auto"
                            color={project.color}
                            src={project.image}
                            size="sm"
                            name={project.name}
                          />
                        </Tooltip>
                      )
                    }
                    rightSection={
                      tags && (
                        <Flex gap={4}>
                          {tags.map((tag) => (
                            <Badge
                              key={tag.id}
                              color={tag.color || "gray"}
                              variant="light"
                              size="xs"
                            >
                              {tag.name}
                            </Badge>
                          ))}
                        </Flex>
                      )
                    }
                  />
                </Paper>

                {hasSubtasks(task) && (
                  <Stack gap={0} flex={1}>
                    {task.subtasks.map((subtask) => {
                      const tags = subtask.tags && subtask.tags.map(resolveTag);
                      return (
                        <Fragment key={subtask.id}>
                          <NavLink
                            label={subtask.title}
                            component="div"
                            className="pointer-events-none"
                            color="gray"
                            rightSection={
                              tags && (
                                <Flex gap={4}>
                                  {tags.map((tag) => (
                                    <Badge
                                      key={tag.id}
                                      color={tag.color || "gray"}
                                      variant="light"
                                      size="xs"
                                    >
                                      {tag.name}
                                    </Badge>
                                  ))}
                                </Flex>
                              )
                            }
                          />
                          <Divider className="last:hidden" />
                        </Fragment>
                      );
                    })}
                  </Stack>
                )}
              </Paper>
            );
          })}
        </Stack>
      </ScrollArea>
    </Panel>
  );
}

// --------- Utility Functions ---------

const getSortByLabel = (sort: BacklogSortOptions["sortBy"]) => {
  switch (sort) {
    case "title":
      return "Title";
    case "addedAt":
      return "Date added";
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
