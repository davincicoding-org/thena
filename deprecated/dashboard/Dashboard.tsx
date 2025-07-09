import type { UseMutateAsyncFunction } from "@tanstack/react-query";
import type { SetRequired } from "type-fest";
import { useState } from "react";
import {
  ActionIcon,
  Button,
  Card,
  Divider,
  Flex,
  HoverCard,
  Menu,
  ScrollArea,
  Skeleton,
  Text,
} from "@mantine/core";
import { IconEye, IconSortDescending, IconX } from "@tabler/icons-react";

import type {
  ProjectSelect,
  TaskFormValues,
  TaskSelect,
  TaskTree,
  TaskUpdate,
} from "@/core/task-management";
import { ProjectAvatar, TaskListEditor } from "@/ui/task-management";
import { TaskListFilter } from "@/ui/task-management/task-list/TaskListFilter";
import { cn, derive } from "@/ui/utils";

const PROJECT_SKELETONS = Array.from({ length: 5 }, (_, i) => (
  <Skeleton key={i} height={48} width={48} radius="md" />
));

export interface TaskFilters {
  project: ProjectSelect["id"] | null;
  sort: "default" | "priority";
}

export interface DashboardProps {
  todos: TaskTree[];
  onUpdateTask: (task: SetRequired<TaskUpdate, "id" | "parentId">) => void;
  onDeleteTasks: (tasks: TaskSelect[]) => void;
  onCreateTasks: (tasks: TaskFormValues[]) => void;
  onBulkCreateTasks: UseMutateAsyncFunction<
    TaskTree[],
    Error,
    { title: string; subtasks: string[] }[]
  >;
  filters: TaskFilters;
  onUpdateFilters: (filters: Partial<TaskFilters>) => void;
  projects: ProjectSelect[];
  loadingProjects: boolean;
  onCreateProject: (callback: (projectId: ProjectSelect["id"]) => void) => void;
  onViewProject: (project: ProjectSelect) => void;
}

export function Dashboard({
  todos,
  onUpdateTask,
  onDeleteTasks,
  onCreateTasks,
  onBulkCreateTasks,
  projects,
  filters,
  loadingProjects,
  onUpdateFilters,
  onViewProject,
  onCreateProject,
}: DashboardProps) {
  const todosCount = derive(() => {
    if (todos.length === 0) return "-";
    if (todos.length <= 100) return todos.length.toString();
    return "100+";
  });

  return (
    <div className="grid items-start gap-8">
      <TaskListFilter
        filters={filters}
        onUpdateFilters={onUpdateFilters}
        projects={projects}
        onViewProject={onViewProject}
      />
      <Card
        p={0}
        radius="md"
        component="header"
        display="flex"
        className="min-w-0 !flex-row items-center"
      >
        <div className="flex flex-col px-6">
          <span className="my-auto text-center text-4xl font-light">
            {todosCount}
          </span>
          <Text size="lg" c="dimmed">
            TODOS
          </Text>
        </div>
        <Divider orientation="vertical" />
        <ScrollArea
          scrollbars="x"
          flex={1}
          classNames={{
            scrollbar: "mx-6",
          }}
        >
          <div className="flex items-stretch">
            <div className="sticky left-0 z-10 w-6 shrink-0 bg-gradient-to-r from-[var(--mantine-color-dark-6)] to-transparent to-90%" />

            <Flex gap="md" py="sm">
              {loadingProjects
                ? PROJECT_SKELETONS
                : projects.map((project) => (
                    <ProjectTile
                      key={project.id}
                      className="shrink-0"
                      project={project}
                      selected={filters.project === project.id}
                      opaque={
                        filters.project ? filters.project !== project.id : false
                      }
                      onSelect={() => onUpdateFilters({ project: project.id })}
                      onDeselect={() => onUpdateFilters({ project: null })}
                      onView={() => onViewProject(project)}
                    />
                  ))}
            </Flex>
            <div className="sticky right-0 z-10 w-6 shrink-0 bg-gradient-to-l from-[var(--mantine-color-dark-6)] to-transparent to-90%" />
          </div>
        </ScrollArea>

        <Menu
          position="bottom-start"
          offset={{
            mainAxis: 4,
          }}
          classNames={{
            itemLabel: "font-medium",
          }}
          transitionProps={{
            transition: "pop-top-left",
          }}
        >
          <Menu.Target>
            <Button
              variant="default"
              radius="md"
              className="mx-6 shrink-0"
              leftSection={<IconSortDescending size={16} />}
            >
              {filters.sort}
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              color={filters.sort === "default" ? "primary" : undefined}
              onClick={() => onUpdateFilters({ sort: "default" })}
            >
              Default
            </Menu.Item>
            <Menu.Item
              color={filters.sort === "priority" ? "primary" : undefined}
              onClick={() => onUpdateFilters({ sort: "priority" })}
            >
              Priority
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Card>

      <TaskListEditor
        tasks={todos}
        reorderingDisabled={filters.sort !== "default"}
        onUpdateTask={onUpdateTask}
        onDeleteTasks={onDeleteTasks}
        onCreateTasks={onCreateTasks}
        onBulkCreateTasks={onBulkCreateTasks}
        projects={projects}
        hideProject={filters.project !== null}
        onCreateProject={onCreateProject}
      />
    </div>
  );
}

interface ProjectTileProps {
  project: ProjectSelect;
  selected: boolean;
  opaque: boolean;
  onSelect: () => void;
  onDeselect: () => void;
  onView: () => void;
  className?: string;
}

function ProjectTile({
  project,
  selected,
  opaque,
  className,
  onSelect,
  onDeselect,
  onView,
}: ProjectTileProps) {
  const [lockDeselect, setLockDeselect] = useState(true);

  const handleSelect = () => {
    setLockDeselect(true);
    onSelect();
  };

  const handleView = () => {
    onView();
  };

  return (
    <HoverCard
      withArrow
      arrowPosition="center"
      offset={{ mainAxis: 6 }}
      transitionProps={{
        transition: "fade-down",
        duration: 250,
      }}
    >
      <HoverCard.Target>
        <div
          className={cn("group relative", className)}
          onMouseLeave={() => {
            setLockDeselect(false);
          }}
        >
          <ProjectAvatar
            project={project}
            size={48}
            radius="md"
            className={cn(
              "outline-0 outline-[var(--mantine-color-primary-filled)] transition-all",
              {
                "outline-2": selected,
                "opacity-30 hover:opacity-80": opaque,
                "cursor-pointer": !selected,
              },
            )}
            onClick={handleSelect}
          />
          <button
            className={cn(
              "absolute inset-0 flex cursor-pointer items-center justify-center rounded-[var(--mantine-radius-md)] border-none bg-black/10 opacity-0 backdrop-blur-xs transition-opacity group-hover:opacity-100",
              {
                "pointer-events-none !opacity-0": !selected || lockDeselect,
              },
            )}
            onClick={onDeselect}
          >
            <IconX size={36} />
          </button>
        </div>
      </HoverCard.Target>
      <HoverCard.Dropdown p={0} className="!z-[100]">
        <div className="flex items-center">
          <Text px="xs">{project.title}</Text>
          <Divider orientation="vertical" />
          <ActionIcon
            variant="subtle"
            radius={0}
            color="gray"
            className="!rounded-r-[0.19rem]"
            onClick={handleView}
          >
            <IconEye size={16} />
          </ActionIcon>
        </div>
      </HoverCard.Dropdown>
    </HoverCard>
  );
}
