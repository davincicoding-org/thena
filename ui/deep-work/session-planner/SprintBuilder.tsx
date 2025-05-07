import { useRef } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  Paper,
  ScrollArea,
  Space,
  Text,
} from "@mantine/core";

import type { SprintPlan } from "@/core/deep-work";
import type { FlatTask, TaskId } from "@/core/task-management";
import { pickTasks } from "@/core/task-management";
import { cn } from "@/ui/utils";

import { SprintPanel } from "./SprintPanel";

export interface SprintBuilderProps {
  dndEnabled: boolean;
  sprints: SprintPlan[];
  taskPool: FlatTask[];
  className?: string;
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
  onReorderSprintTasks: (options: {
    sprintId: SprintPlan["id"];
    from: number;
    to: number;
  }) => void;
}

export function SprintBuilder({
  sprints,
  taskPool,
  dndEnabled,
  onAddSprint,
  onDropSprint,
  onUpdateSprint,
  onReorderSprints,
  onUnassignTasksFromSprint,
  className,
}: SprintBuilderProps) {
  const viewport = useRef<HTMLDivElement>(null);

  const handleAddSprint = () => {
    onAddSprint([], () => {
      setTimeout(() => {
        viewport.current!.scrollTo({
          left: viewport.current!.scrollWidth,
          behavior: "smooth",
        });
      }, 300);
    });
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
    <Paper
      withBorder
      radius="md"
      display="grid"
      className={cn("grid-rows-[auto_1fr] overflow-clip", className)}
    >
      <Box className="sticky top-0 z-10 h-12 bg-black/20 backdrop-blur-xs">
        <Flex justify="space-between" align="center" className="h-12 pr-2">
          <Text size="lg" px="sm" fw={500}>
            SPRINTS
          </Text>
          <Button
            variant="light"
            size="xs"
            disabled={sprints.some(({ tasks }) => tasks.length === 0)}
            onClick={handleAddSprint}
          >
            Add Sprint
          </Button>
        </Flex>

        <Divider />
      </Box>
      <Flex className="min-h-0 min-w-0 overflow-clip">
        <ScrollArea
          scrollbars="x"
          type="never"
          className="w-full grow-0"
          classNames={{
            viewport: "[&>div]:block! [&>div]:h-full",
          }}
          scrollHideDelay={300}
          viewportRef={viewport}
        >
          <Flex
            py="lg"
            align="start"
            justify="space-evenly"
            className="h-full space-x-6"
          >
            <Space className="mr-3 h-1 w-2 shrink-0" />

            {sprints.map((sprint, index) => (
              <SprintPanel
                key={sprint.id}
                dndEnabled={dndEnabled}
                sprintId={sprint.id}
                duration={sprint.duration}
                tasks={pickTasks(taskPool, sprint.tasks)}
                className="max-h-full shrink-0"
                title={`Sprint ${index + 1}`}
                moveOptions={{
                  start: index > 1,
                  end: index < sprints.length - 2,
                  left: index > 0,
                  right: index < sprints.length - 1,
                }}
                onMove={(direction) => handleMoveSprint(index, direction)}
                onDrop={() => onDropSprint(sprint)}
                onDurationChange={(duration) =>
                  onUpdateSprint(sprint.id, { duration })
                }
                onUnassignTasks={(tasks) =>
                  onUnassignTasksFromSprint({
                    sprintId: sprint.id,
                    tasks,
                  })
                }
              />
            ))}
            <Space className="-ml-3 h-1 w-2 shrink-0" />
          </Flex>
        </ScrollArea>
      </Flex>
    </Paper>
  );
}

/*
<TaskPool
    className="min-h-0 w-xs"
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
</Flex>
<Flex align="center" justify="space-between" gap="md">
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
</Flex>
</Stack>



*/
