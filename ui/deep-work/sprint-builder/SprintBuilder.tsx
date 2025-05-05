/* eslint-disable max-lines */
import type { PaperProps } from "@mantine/core";
import type { OS } from "@mantine/hooks";
import { useMemo, useRef, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Kbd,
  Paper,
  ScrollArea,
  Space,
  Switch,
  Text,
  Tooltip,
} from "@mantine/core";
import { useDisclosure, useOs } from "@mantine/hooks";

import type { SprintPlan } from "@/core/deep-work";
import type { StandaloneTask, TaskId, TaskTree } from "@/core/task-management";
import {
  countTasks,
  excludeTasksAndCompact,
  includeTasksAndCompact,
} from "@/core/task-management";
import { useKeyHold } from "@/ui/hooks";
import { cn } from "@/ui/utils";

import { DndWrapper } from "./dnd";
import { SprintPanel } from "./SprintPanel";
import { TaskPool } from "./TaskPool";

export interface SprintBuilderProps {
  sprints: SprintPlan[];
  taskPool: (TaskTree | StandaloneTask)[];
  onAddSprint: (
    tasks: TaskId[],
    callback?: (sprintId: SprintPlan["id"]) => void,
  ) => void;
  onDropSprint: (sprint: SprintPlan) => void;
  onUpdateSprint: (
    id: string,
    updates: Partial<
      Pick<SprintPlan, "duration" | "scheduledStart" | "recoveryTime">
    >,
  ) => void;
  onReorderSprints: (from: number, to: number) => void;
  onAssignTasksToSprint: (options: {
    sprintId: string;
    tasks: TaskId[];
  }) => void;
  onUnassignTasksFromSprint: (options: {
    sprintId: string;
    tasks: TaskId[];
  }) => void;
  onMoveTask: (options: {
    sourceSprint: string;
    targetSprint: string;
    tasks: TaskId[];
    targetIndex?: number;
  }) => void;
  onReorderSprintTasks: (options: {
    sprintId: SprintPlan["id"];
    from: number;
    to: number;
  }) => void;
}

export function SprintBuilder({
  sprints,
  taskPool,
  onAddSprint,
  onDropSprint,
  onUpdateSprint,
  onReorderSprints,
  onAssignTasksToSprint,
  onUnassignTasksFromSprint,
  onMoveTask,
  onReorderSprintTasks,
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

  const os = useOs();
  const [dndEnabled, setDndEnabled] = useState(false);

  useKeyHold({
    trigger: (e) => e.key === "Alt",
    onStart: () => setDndEnabled(true),
    onRelease: () => setDndEnabled(false),
  });

  const sprintOptions = sprints.map((sprint, index) => ({
    id: sprint.id,
    title: `Sprint ${index + 1}`,
  }));

  const unassignedTasks = useMemo(() => {
    const assignedTasks = sprints.flatMap((sprint) => sprint.tasks);
    return excludeTasksAndCompact(taskPool, assignedTasks);
  }, [taskPool, sprints]);

  const unassignedTasksCount = countTasks(unassignedTasks);

  // useEffect(() => {
  //   if (hasUnassignedTasks) return;
  //   closeTaskPool();
  // }, [hasUnassignedTasks, closeTaskPool]);

  const handleAddSprint = () => {
    onAddSprint([], (sprintId) => {
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

  const handleDropSprint = (sprint: SprintPlan) => {
    onDropSprint(sprint);
    setSprintToAddTaskTo((current) =>
      current !== sprint.id ? current : undefined,
    );
  };

  const handleMoveSprint = (
    index: number,
    direction: "start" | "left" | "right" | "end",
  ) => {
    const newIndex = (() => {
      switch (direction) {
        case "start":
          return 0;
        case "left":
          return index - 1;
        case "right":
          return index + 1;
        case "end":
          return sprints.length - 1;
      }
    })();

    onReorderSprints(index, newIndex);
  };

  return (
    <DndWrapper
      enabled={dndEnabled}
      onAssignTasksToSprint={onAssignTasksToSprint}
      onUnassignTasksFromSprint={onUnassignTasksFromSprint}
      onMoveTask={onMoveTask}
      onReorderSprintTasks={onReorderSprintTasks}
    >
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
                  sprintId={sprint.id}
                  duration={sprint.duration}
                  tasks={includeTasksAndCompact(taskPool, sprint.tasks)}
                  className="max-h-full"
                  otherSprints={sprintOptions.filter(
                    (option) => option.id !== sprint.id,
                  )}
                  title={`Sprint ${index + 1}`}
                  moveOptions={{
                    start: index > 1,
                    end: index < sprints.length - 2,
                    left: index > 0,
                    right: index < sprints.length - 1,
                  }}
                  onMove={(direction) => handleMoveSprint(index, direction)}
                  isTargeted={sprintToAddTaskTo === sprint.id}
                  canAddTasks={unassignedTasksCount > 0}
                  dndEnabled={dndEnabled}
                  disabled={
                    sprintToAddTaskTo !== undefined &&
                    sprintToAddTaskTo !== sprint.id
                  }
                  onDrop={() => handleDropSprint(sprint)}
                  onDurationChange={(duration) =>
                    onUpdateSprint(sprint.id, { duration })
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
                    onMoveTask({
                      ...options,
                      sourceSprint: sprint.id,
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
              tasks={unassignedTasks}
              sprintOptions={sprintOptions}
              selectionEnabled={sprintToAddTaskTo !== undefined}
              dndEnabled={dndEnabled}
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
              onAssignTasksToNewSprint={(tasks) =>
                onAddSprint(tasks, (sprintId) => {
                  onAssignTasksToSprint({
                    sprintId,
                    tasks,
                  });
                })
              }
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
          <Tooltip
            label={
              <Text>
                Pro Tip: Hold{" "}
                <Kbd className="align-text-bottom">
                  {os === "macos" ? "⌥ option" : "Alt"}
                </Kbd>{" "}
                to drag&drop
              </Text>
            }
            disabled={!(["macos", "linux", "windows"] as OS[]).includes(os)}
            openDelay={500}
          >
            <Badge
              size="xl"
              pr={4}
              classNames={{
                label: "normal-case font-normal",
                section: "pl-1.5",
              }}
              variant="default"
              rightSection={
                <Switch
                  checked={dndEnabled}
                  onChange={(event) =>
                    setDndEnabled(event.currentTarget.checked)
                  }
                  size="md"
                  my={-1}
                  mr={-1}
                />
              }
            >
              Drag&Drop
            </Badge>
          </Tooltip>

          <Button
            ml="auto"
            radius="xl"
            variant="light"
            color={unassignedTasks.length ? "orange" : "green"}
            className={cn({
              "pointer-events-none":
                sprintToAddTaskTo !== undefined || unassignedTasksCount === 0,
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
    </DndWrapper>
  );
}
