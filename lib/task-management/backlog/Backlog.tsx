import { useCallback } from "react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Flex,
  Group,
  Menu,
  MultiSelect,
  Paper,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import {
  IconAbc,
  IconCalendar,
  IconProps,
  IconSearch,
  IconSortAscending,
  IconSortDescending,
} from "@tabler/icons-react";

import { useSyncInputState } from "@/ui/useSyncState";

import {
  BACKLOG_SORT_OPTIONS,
  BacklogFilters,
  BacklogSortOptions,
  BacklogTask,
  Project,
  Subtask,
  Tag,
} from "../types";
import { hasSubtasks } from "../utils";
import { BacklogHookReturn } from "./useBacklog";

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
}: BacklogProps) {
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
    <Card withBorder>
      <Card.Section px="md" py="sm" pb="md">
        <Flex gap="sm">
          <TextInput
            placeholder="Search"
            leftSection={<IconSearch size={20} />}
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e);
              onFiltersUpdate({ search: e.target.value });
            }}
          />
          <MultiSelect
            placeholder={filters.projectIds?.length ? undefined : "Projects"}
            value={filters.projectIds || []}
            checkIconPosition="right"
            data={projects.map((project) => ({
              value: project.id,
              label: project.name,
            }))}
            onChange={(value) => onFiltersUpdate({ projectIds: value })}
            renderOption={({ option }) => (
              <Group gap="sm" wrap="nowrap">
                <Avatar
                  color={
                    filters.projectIds?.includes(option.value)
                      ? "primary"
                      : undefined
                  }
                  src={projects.find((p) => p.id === option.value)?.image}
                  size={36}
                  radius="xl"
                  name={option.label}
                />
                <Text
                  size="sm"
                  className="text-nowrap"
                  c={
                    filters.projectIds?.includes(option.value)
                      ? "primary"
                      : undefined
                  }
                >
                  {option.label}
                </Text>
              </Group>
            )}
          />
          <MultiSelect
            placeholder={filters.tags?.length ? undefined : "Tags"}
            value={filters.tags || []}
            data={tags.map((tag) => ({
              value: tag.id,
              label: tag.name,
            }))}
            onChange={(value) => onFiltersUpdate({ tags: value })}
          />
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
                  leftSection={<SortDirectionIcon sort={direction} size={20} />}
                  onClick={() => onSortUpdate({ direction })}
                >
                  {getSortDirectionLabel(direction)}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        </Flex>
      </Card.Section>
      <Stack>
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            resolveProject={resolveProject}
            resolveTag={resolveTag}
          />
        ))}
      </Stack>
    </Card>
  );
}

function TaskItem({
  task,
  resolveProject,
  resolveTag,
}: {
  task: BacklogTask;
  resolveProject: (projectId: string) => Project;
  resolveTag: (tagId: string) => Tag;
}) {
  const project = task.projectId ? resolveProject(task.projectId) : undefined;

  return (
    <Stack gap="xs">
      <Paper withBorder px="md" py="sm">
        <Flex align="center">
          {project && (
            <Tooltip label={project.name}>
              <Avatar
                className="-my-2 mr-2 -ml-2"
                src={project.image}
                name={project.name}
                color={project.color}
                size={36}
              />
            </Tooltip>
          )}
          <Text size="lg">{task.title}</Text>
          <Flex gap="xs" ml="auto" className="empty:hidden">
            {task.tags?.map((tag) => {
              const { name, color, id } = resolveTag(tag);
              return (
                <Badge key={id} color={color || "gray"}>
                  {name}
                </Badge>
              );
            })}
          </Flex>
        </Flex>
      </Paper>

      {hasSubtasks(task) && (
        <Stack pl="md" gap="xs">
          {task.subtasks.map((subtask) => (
            <SubtaskItem
              key={subtask.id}
              subtask={subtask}
              resolveTag={resolveTag}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}

function SubtaskItem({
  subtask,
  resolveTag,
}: {
  subtask: Subtask;
  resolveTag: (tagId: string) => Tag;
}) {
  return (
    <Paper withBorder px="md" py="sm">
      <Flex align="center">
        <Text>{subtask.title}</Text>
        <Flex gap="xs" ml="auto" className="empty:hidden">
          {subtask.tags?.map((tag) => {
            const { name, color, id } = resolveTag(tag);
            return (
              <Badge key={id} color={color || "gray"}>
                {name}
              </Badge>
            );
          })}
        </Flex>
      </Flex>
    </Paper>
  );
}

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
