import { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  PaperProps,
  ScrollArea,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { SprintPlan } from "@/core/deep-work";
import { Task, TaskSelection } from "@/core/task-management";
import { Panel } from "@/ui/components/Panel";
import { cn } from "@/ui/utils";

import { SprintPanel } from "./SprintPanel";
import { TaskPool } from "./TaskPool";

export interface SessionPlannerProps {
  sprints: SprintPlan[];
  unassignedTasks: Task[];
  onAddSprint: () => void;
  onDropSprint: (sprintId: SprintPlan["id"]) => void;
  onSprintChange: (
    id: string,
    updates: Partial<Pick<SprintPlan, "duration">>,
  ) => void;
  onAssignTasksToSprint: (options: {
    sprintId: string;
    tasks: TaskSelection[];
  }) => void;
  onUnassignTasksFromSprint: (options: {
    sprintId: string;
    tasks: TaskSelection[];
  }) => void;
  onMoveTasks: (options: {
    fromSprintId: string;
    toSprintId: string;
    tasks: TaskSelection[];
  }) => void;
}

export function SessionPlanner({
  sprints,
  unassignedTasks,
  onAddSprint,
  onDropSprint,
  onSprintChange: onSprintMetaChange,
  onAssignTasksToSprint,
  onUnassignTasksFromSprint: onUnassignTaskFromSprint,
  onMoveTasks,
  ...paperProps
}: SessionPlannerProps & PaperProps) {
  const [isShowingUnassignedTasks, unassignedTasksPanel] = useDisclosure(false);
  const [sprintToAddTaskTo, setSprintToAddTaskTo] =
    useState<SprintPlan["id"]>();

  const sprintOptions = sprints.map((sprint, index) => ({
    id: sprint.id,
    title: `Sprint ${index + 1}`,
  }));

  const totalUnassignedTasks = unassignedTasks.reduce(
    (acc, task) => acc + (task.subtasks?.length || 1),
    0,
  );

  useEffect(() => {
    if (unassignedTasks.length === 0) {
      unassignedTasksPanel.close();
    }
  }, [unassignedTasks.length]);

  return (
    <Panel
      {...paperProps}
      header={
        <Flex align="center" gap="md" px="sm" py="xs">
          <Text size="xl">Session Planner</Text>
          <Button variant="outline" size="compact-sm" onClick={onAddSprint}>
            Add Sprint
          </Button>
          <Button
            ml="auto"
            radius="xl"
            variant="light"
            color={unassignedTasks.length ? "orange" : "green"}
            className={cn({
              "pointer-events-none":
                sprintToAddTaskTo !== undefined || totalUnassignedTasks === 0,
            })}
            leftSection={
              unassignedTasks.length ? (
                <Badge px={4} miw={20} color="orange">
                  {totalUnassignedTasks}
                </Badge>
              ) : undefined
            }
            onClick={unassignedTasksPanel.toggle}
          >
            {unassignedTasks.length ? "Unassigned Tasks" : "All Tasks assigned"}
          </Button>
        </Flex>
      }
    >
      <Flex className="min-h-0 min-w-0 overflow-clip">
        <ScrollArea
          scrollbars="x"
          className="w-full grow-0"
          viewportRef={(ref) => {
            if (!ref) return;
            const child = ref.children.item(0) as HTMLElement;

            child.style.setProperty("display", "block");
            child.style.setProperty("height", "100%");
          }}
        >
          <Flex p="lg" gap="lg" align="start" className="h-full">
            {sprints.map((sprint, index) => (
              <SprintPanel
                key={sprint.id}
                sprint={sprint}
                className="max-h-full"
                sprintOptions={sprintOptions}
                title={`Sprint ${index + 1}`}
                canAddTasks={totalUnassignedTasks > 0}
                disabled={
                  sprintToAddTaskTo !== undefined &&
                  sprintToAddTaskTo !== sprint.id
                }
                onDrop={() => onDropSprint(sprint.id)}
                onDurationChange={(duration) =>
                  onSprintMetaChange(sprint.id, { duration })
                }
                onAddTasks={() => {
                  setSprintToAddTaskTo(sprint.id);
                  unassignedTasksPanel.open();
                }}
                onUnassignTask={(task) =>
                  onUnassignTaskFromSprint({
                    sprintId: sprint.id,
                    tasks: [task],
                  })
                }
                onMoveTasks={(options) =>
                  onMoveTasks({
                    ...options,
                    fromSprintId: sprint.id,
                  })
                }
              />
            ))}
          </Flex>
        </ScrollArea>

        <Box
          className={cn("pl-0! transition-all", {
            "-mr-[100%]": !isShowingUnassignedTasks,
          })}
          p="sm"
        >
          <TaskPool
            items={unassignedTasks}
            sprintOptions={sprintOptions}
            selectionEnabled={sprintToAddTaskTo !== undefined}
            onSubmitSelection={(tasks) => {
              if (!sprintToAddTaskTo) return;
              onAssignTasksToSprint({ sprintId: sprintToAddTaskTo, tasks });
              setSprintToAddTaskTo(undefined);
              unassignedTasksPanel.close();
              setSprintToAddTaskTo(undefined);
            }}
            onAbortSelection={() => {
              setSprintToAddTaskTo(undefined);
              unassignedTasksPanel.close();
            }}
            onAssignTasksToSprint={onAssignTasksToSprint}
          />
        </Box>
      </Flex>
    </Panel>
  );
}
