import type { SortableData } from "@dnd-kit/sortable";
import type { PaperProps } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
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
import type { FlatTask, TaskReference } from "@/core/task-management";
import { resolveTaskReferences } from "@/core/task-management";
import { useKeyHold } from "@/ui/hooks";
import { cn } from "@/ui/utils";

import { StandaloneTaskItemBase } from "./components";
import { SprintPanel } from "./SprintPanel";
import { TaskPool } from "./TaskPool";

interface DraggingTaskData extends Partial<SortableData> {
  item: FlatTask;
}

export interface SprintBuilderProps {
  sprints: SprintPlan[];
  tasks: FlatTask[];
  unassignedTasks: TaskReference[];
  onAddSprint: (callback?: (sprintId: SprintPlan["id"]) => void) => void;
  onDropSprint: (sprintId: SprintPlan["id"]) => void;
  onSprintChange: (
    id: string,
    updates: Partial<Pick<SprintPlan, "duration">>,
  ) => void;
  onReorderSprints: (order: number[]) => void;
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
    insertIndex?: number;
  }) => void;
  onReorderSprintTasks: (options: {
    sprintId: string;
    order: number[];
  }) => void;
}

export function SprintBuilder({
  sprints,
  tasks,
  unassignedTasks,
  onAddSprint,
  onDropSprint,
  onSprintChange,
  onReorderSprints,
  onAssignTasksToSprint,
  onUnassignTasksFromSprint,
  onMoveTasks,
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

  const [dndEnabled, setDndEnabled] = useState(false);

  useKeyHold({
    trigger: (e) => e.key === "Alt",
    onStart: () => setDndEnabled(true),
    onRelease: () => setDndEnabled(false),
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

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

  const handleMoveSprint = (
    index: number,
    direction: "start" | "left" | "right" | "end",
  ) => {
    const indexes = sprints.map((_, index) => index);

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

    const order = arrayMove(indexes, index, newIndex);

    onReorderSprints(order);
  };

  const [draggedItem, setDraggedItem] = useState<FlatTask>();

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={({ active }) => {
        if (!active.data.current) return;
        const { item } = active.data.current as DraggingTaskData;
        setDraggedItem(item);
      }}
      onDragOver={(event) => {
        if (!event.active.data.current) return;
        if (!event.over) return;

        const overData = event.over.data.current as SortableData | undefined;

        const targetContainerId =
          overData?.sortable.containerId ?? event.over.id;

        const active = event.active.data.current as DraggingTaskData;

        if (active.sortable?.containerId === targetContainerId) return;

        if (active.sortable) {
          if (targetContainerId === "TASK_POOL") {
            onUnassignTasksFromSprint({
              sprintId: active.sortable.containerId.toString(),
              tasks: [active.item],
            });
            return;
          }

          onMoveTasks({
            fromSprintId: active.sortable.containerId.toString(),
            toSprintId: targetContainerId.toString(),
            tasks: [active.item],
            insertIndex: (event.over.data.current as SortableData | undefined)
              ?.sortable.index,
          });
          return;
        }

        onAssignTasksToSprint({
          sprintId: targetContainerId.toString(),
          tasks: [active.item],
        });
      }}
      onDragEnd={(event) => {
        setDraggedItem(undefined);
        if (!event.active.data.current) return;
        if (!event.over?.data.current) return;

        const active = event.active.data.current as DraggingTaskData;
        const over = event.over.data.current as DraggingTaskData;

        if (!active.sortable || !over.sortable) return;

        if (active.sortable.containerId !== over.sortable.containerId) return;

        const indexes = over.sortable.items.map((_, index) => index);
        const order = arrayMove(
          indexes,
          active.sortable.index,
          over.sortable.index,
        );
        onReorderSprintTasks({
          sprintId: over.sortable.containerId.toString(),
          order,
        });
      }}
    >
      <DragOverlay>
        {draggedItem && dndEnabled ? (
          <StandaloneTaskItemBase
            className="cursor-grabbing!"
            item={draggedItem}
          />
        ) : null}
      </DragOverlay>
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
                  tasks={resolveTaskReferences(sprint.tasks, tasks)}
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
                  canAddTasks={hasUnassignedTasks}
                  dndEnabled={dndEnabled}
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
              tasks={resolveTaskReferences(unassignedTasks, tasks)}
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
    </DndContext>
  );
}
