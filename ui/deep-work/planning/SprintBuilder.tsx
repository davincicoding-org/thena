import type { PaperProps } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Paper,
  ScrollArea,
  Space,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import type { SprintPlan } from "@/core/deep-work";
import type { Task, TaskReference } from "@/core/task-management";
import {
  resolveTaskReferences,
  resolveTaskReferencesFlat,
} from "@/core/task-management";
import { cn } from "@/ui/utils";

import { SprintPanel } from "./SprintPanel";
import { TaskPool } from "./TaskPool";

export interface SprintBuilderProps {
  sprints: SprintPlan[];
  tasks: Task[];
  unassignedTasks: TaskReference[];
  onAddSprint: (callback?: (sprintId: SprintPlan["id"]) => void) => void;
  onDropSprint: (sprintId: SprintPlan["id"]) => void;
  onSprintChange: (
    id: string,
    updates: Partial<Pick<SprintPlan, "duration">>,
  ) => void;
  onAssignTasksToSprint: (options: {
    sprintId: string | null;
    tasks: TaskReference[];
  }) => void;
  onUnassignTasksFromSprint: (options: {
    sprintId: string;
    tasks: TaskReference[];
  }) => void;
  onMoveTasks: (options: {
    fromSprintId: string;
    toSprintId: string;
    tasks: TaskReference[];
  }) => void;
}

export function SprintBuilder({
  sprints,
  tasks,
  unassignedTasks,
  onAddSprint,
  onDropSprint,
  onSprintChange,
  onAssignTasksToSprint,
  onUnassignTasksFromSprint,
  onMoveTasks,
  className,
  ...paperProps
}: SprintBuilderProps & PaperProps) {
  const [
    isShowingUnassignedTasks,
    { close: closeTaskPool, open: openTaskPool, toggle: toggleTaskPool },
  ] = useDisclosure(false);
  const [sprintToAddTaskTo, setSprintToAddTaskTo] =
    useState<SprintPlan["id"]>();

  const viewport = useRef<HTMLDivElement>(null);

  const sprintOptions = sprints.map((sprint, index) => ({
    id: sprint.id,
    title: `Sprint ${index + 1}`,
  }));

  const hasUnassignedTasks = unassignedTasks.length > 0;

  useEffect(() => {
    if (hasUnassignedTasks) return;
    closeTaskPool();
  }, [hasUnassignedTasks, closeTaskPool]);

  const handleAddSprint = () => {
    onAddSprint((sprintId) => {
      setTimeout(() => {
        setSprintToAddTaskTo(sprintId);
        openTaskPool();

        setTimeout(() => {
          viewport.current!.scrollTo({
            left: viewport.current!.scrollWidth,
            behavior: "smooth",
          });
        }, 300);
      }, 100);
    });
  };

  const handleDropSprint = (sprintId: SprintPlan["id"]) => {
    onDropSprint(sprintId);
    setSprintToAddTaskTo((current) =>
      current !== sprintId ? current : undefined,
    );
  };

  return (
    <Paper
      withBorder
      radius="md"
      display="grid"
      className={cn("grid-rows-[1fr_auto_auto]", className)}
      {...paperProps}
    >
      <Flex className="min-h-0 min-w-0 overflow-clip">
        <ScrollArea
          scrollbars="x"
          className="w-full grow-0"
          classNames={{
            viewport: "[&>div]:block! [&>div]:h-full",
          }}
          scrollHideDelay={300}
          viewportRef={viewport}
        >
          <Flex
            py="xl"
            gap="lg"
            align="start"
            justify="space-evenly"
            className="h-full"
          >
            <Space className="invisible w-4">-</Space>
            {sprints.map((sprint, index) => (
              <SprintPanel
                key={sprint.id}
                duration={sprint.duration}
                tasks={resolveTaskReferencesFlat(sprint.tasks, tasks)}
                className="max-h-full"
                otherSprints={sprintOptions.filter(
                  (option) => option.id !== sprint.id,
                )}
                title={`Sprint ${index + 1}`}
                canAddTasks={hasUnassignedTasks}
                disabled={
                  sprintToAddTaskTo !== undefined &&
                  sprintToAddTaskTo !== sprint.id
                }
                onDrop={() => handleDropSprint(sprint.id)}
                onDurationChange={(duration) =>
                  onSprintChange(sprint.id, { duration })
                }
                onAddTasks={(el) => {
                  setSprintToAddTaskTo(sprint.id);
                  openTaskPool();

                  setTimeout(() => {
                    el.scrollIntoView({
                      behavior: "smooth",
                      inline: "center",
                    });
                  }, 300);
                }}
                onUnassignTasks={(tasks) =>
                  onUnassignTasksFromSprint({ sprintId: sprint.id, tasks })
                }
                onMoveTasks={(options) =>
                  onMoveTasks({
                    ...options,
                    fromSprintId: sprint.id,
                  })
                }
              />
            ))}

            <Space className="invisible w-0">-</Space>
          </Flex>
        </ScrollArea>
        <Box
          className={cn("pl-0! transition-all", {
            "-mr-[100%]": !isShowingUnassignedTasks,
          })}
          p="sm"
        >
          <TaskPool
            items={resolveTaskReferences(unassignedTasks, tasks)}
            sprintOptions={sprintOptions}
            selectionEnabled={sprintToAddTaskTo !== undefined}
            onSubmitSelection={(tasks) => {
              if (!sprintToAddTaskTo) return;
              onAssignTasksToSprint({ sprintId: sprintToAddTaskTo, tasks });
              setSprintToAddTaskTo(undefined);
              closeTaskPool();
              setSprintToAddTaskTo(undefined);
            }}
            onAbortSelection={() => {
              setSprintToAddTaskTo(undefined);
              closeTaskPool();
            }}
            onAssignTasksToSprint={({ sprintId, tasks }) =>
              onAssignTasksToSprint({
                sprintId,
                tasks,
              })
            }
          />
        </Box>
      </Flex>
      <Divider />
      <Flex align="center" gap="md" px="sm" py="xs">
        <Button variant="light" onClick={handleAddSprint}>
          Add Sprint
        </Button>
        <Button
          ml="auto"
          radius="xl"
          variant="light"
          color={unassignedTasks.length ? "orange" : "green"}
          className={cn({
            "pointer-events-none":
              sprintToAddTaskTo !== undefined || !hasUnassignedTasks,
          })}
          leftSection={
            unassignedTasks.length ? (
              <Badge px={4} miw={20} color="orange">
                {unassignedTasks.length}
              </Badge>
            ) : undefined
          }
          onClick={toggleTaskPool}
        >
          {unassignedTasks.length ? "Unassigned Tasks" : "All Tasks assigned"}
        </Button>
      </Flex>
    </Paper>
  );
}
