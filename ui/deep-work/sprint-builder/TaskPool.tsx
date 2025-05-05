import type { MenuProps, PaperProps } from "@mantine/core";
import type { PropsWithChildren } from "react";
import { useEffect, useMemo } from "react";
import {
  ActionIcon,
  Button,
  Card,
  Collapse,
  Flex,
  Menu,
  Paper,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconDotsVertical,
  IconGripVertical,
  IconX,
} from "@tabler/icons-react";

import type {
  AnyTask,
  FlatTask,
  TaskId,
  TaskTree,
} from "@/core/task-management";
import { flattenTasks, isTaskTree } from "@/core/task-management";
import { useTaskSelection } from "@/ui/task-management";
import { cn } from "@/ui/utils";

import {
  FlatTaskBase,
  NestedSubtaskBase,
  TaskTreeHeader,
  TaskTreeWrapper,
} from "./components";
import { useDraggableTask, useDroppableTaskPool } from "./dnd";

export interface TaskPoolProps {
  tasks: AnyTask[];
  selectionEnabled: boolean;
  dndEnabled: boolean;
  sprintOptions: { id: string; title: string }[];
  onSubmitSelection: (tasks: TaskId[]) => void;
  onAbortSelection: () => void;
  onAssignTasksToNewSprint: (tasks: TaskId[]) => void;
  onAssignTasksToSprint: (options: {
    sprintId: string;
    tasks: TaskId[];
  }) => void;
}

export function TaskPool({
  tasks,
  sprintOptions,
  selectionEnabled,
  dndEnabled,
  onSubmitSelection,
  onAbortSelection,
  onAssignTasksToSprint,
  onAssignTasksToNewSprint,
  ...props
}: TaskPoolProps & PaperProps) {
  const {
    selection,
    clearSelection,
    isTaskSelected,
    areAllTasksSelected,
    toggleTaskSelection,
    toggleTasksSelection,
  } = useTaskSelection();

  useEffect(() => {
    if (!selectionEnabled) {
      clearSelection();
    }
  }, [selectionEnabled, clearSelection]);

  const handleTaskClick = (taskId: TaskId) => {
    if (!selectionEnabled) return;
    toggleTaskSelection(taskId);
  };
  const handleTaskGroupClick = (taskIds: TaskId[]) => {
    if (!selectionEnabled) return;
    toggleTasksSelection(taskIds);
  };

  const handleAbortSelection = () => {
    clearSelection();
    onAbortSelection();
  };

  const handleAssignTasks = () => {
    onSubmitSelection(selection);
    clearSelection();
  };

  const items = useMemo((): AnyTask[] => {
    if (!dndEnabled) return tasks;
    return flattenTasks(tasks);
  }, [dndEnabled, tasks]);

  const { setNodeRef } = useDroppableTaskPool(dndEnabled);

  return (
    <Paper
      withBorder
      display="grid"
      bg="neutral.8"
      radius="md"
      ref={setNodeRef}
      className={cn(
        "h-full min-w-48 grid-rows-[auto_1fr] overflow-clip",
        props.className,
      )}
      {...props}
    >
      <Collapse in={selectionEnabled} pos="sticky" top={0}>
        <Card p="xs">
          <Flex justify="space-between" align="center" gap="xs" h={30}>
            {selection.length > 0 ? (
              <Button
                size="xs"
                leftSection={<IconArrowLeft size={16} />}
                onClick={handleAssignTasks}
              >
                Add to Sprint
              </Button>
            ) : (
              <Text flex={1} opacity={0.5}>
                Select Tasks
              </Text>
            )}
            <ActionIcon
              aria-label="Abort Selection"
              size="lg"
              variant="subtle"
              color="gray"
              className="-my-2 -mr-1"
              onClick={(e) => {
                e.currentTarget.blur();
                handleAbortSelection();
              }}
            >
              <IconX size={20} />
            </ActionIcon>
          </Flex>
        </Card>
      </Collapse>
      <ScrollArea
        scrollbars="y"
        classNames={{
          viewport: cn("pb-2 *:flex! *:w-full *:min-w-0! *:flex-col"),
        }}
        scrollHideDelay={300}
      >
        <Stack gap="sm" p="sm" bg="neutral.8">
          {items.map((task) => {
            if (!isTaskTree(task))
              return (
                <StandaloneTaskItem
                  key={task.uid}
                  item={task}
                  selected={isTaskSelected(task.uid)}
                  sprintOptions={sprintOptions}
                  dndEnabled={dndEnabled}
                  selectionEnabled={selectionEnabled}
                  onAssignTasksToSprint={onAssignTasksToSprint}
                  onAssignTasksToNewSprint={onAssignTasksToNewSprint}
                  onClick={() => handleTaskClick(task.uid)}
                />
              );

            return (
              <TaskTreeItem
                key={task.uid}
                task={task}
                sprintOptions={sprintOptions}
                selectionEnabled={selectionEnabled}
                selected={areAllTasksSelected(
                  task.subtasks?.map((subtask) => subtask.uid) ?? [],
                )}
                isItemSelected={(item) => isTaskSelected(item)}
                onAssignTasksToSprint={onAssignTasksToSprint}
                onAssignTasksToNewSprint={onAssignTasksToNewSprint}
                onGroupClick={() =>
                  handleTaskGroupClick(
                    task.subtasks?.map((subtask) => subtask.uid) ?? [],
                  )
                }
                onItemClick={(item) => handleTaskClick(item)}
              />
            );
          })}
        </Stack>
      </ScrollArea>
    </Paper>
  );
}

// MARK: Items

interface StandaloneTaskItemProps
  extends Pick<
    TaskPoolProps,
    "sprintOptions" | "onAssignTasksToSprint" | "onAssignTasksToNewSprint"
  > {
  item: FlatTask;
  dndEnabled: boolean;
  selectionEnabled: boolean;
  selected: boolean;
  onClick: () => void;
}

function StandaloneTaskItem({
  item,
  sprintOptions,
  dndEnabled,
  selectionEnabled,
  selected,
  onClick,
  onAssignTasksToSprint,
  onAssignTasksToNewSprint,
}: StandaloneTaskItemProps) {
  const { attributes, listeners, setNodeRef, isDragging, active } =
    useDraggableTask(item, dndEnabled);

  return (
    <ActionsMenu
      tasks={[item.uid]}
      disabled={dndEnabled || selectionEnabled}
      sprintOptions={sprintOptions}
      onAssignTasksToSprint={onAssignTasksToSprint}
      onAssignTasksToNewSprint={onAssignTasksToNewSprint}
    >
      <FlatTaskBase
        group={"parent" in item ? item.parent.title : undefined}
        label={item.title}
        active={selected}
        clickable={!active}
        className={cn("transition-opacity", {
          "opacity-30": isDragging,
          "cursor-grab!": dndEnabled,
        })}
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        rightSection={
          active && dndEnabled ? null : dndEnabled ? (
            <IconGripVertical className="cursor-grab" size={12} />
          ) : (
            <IconDotsVertical size={12} />
          )
        }
        onClick={onClick}
      />
    </ActionsMenu>
  );
}

interface TaskTreeItemProps
  extends Pick<
    TaskPoolProps,
    "sprintOptions" | "onAssignTasksToSprint" | "onAssignTasksToNewSprint"
  > {
  task: TaskTree;
  selectionEnabled: boolean;
  selected: boolean;
  isItemSelected: (taskId: TaskId) => boolean;
  onGroupClick: () => void;
  onItemClick: (taskId: TaskId) => void;
}

function TaskTreeItem({
  task,
  sprintOptions,
  selectionEnabled,
  selected,
  isItemSelected,
  onAssignTasksToSprint,
  onAssignTasksToNewSprint,
  onGroupClick,
  onItemClick,
}: TaskTreeItemProps) {
  return (
    <TaskTreeWrapper>
      <ActionsMenu
        tasks={task.subtasks?.map((subtask) => subtask.uid) ?? []}
        sprintOptions={sprintOptions}
        disabled={selectionEnabled}
        onAssignTasksToSprint={onAssignTasksToSprint}
        onAssignTasksToNewSprint={onAssignTasksToNewSprint}
      >
        <TaskTreeHeader
          label={task.title}
          rightSection={<IconDotsVertical size={12} />}
          active={selected}
          onClick={onGroupClick}
        />
      </ActionsMenu>

      {task.subtasks?.map((subtask) => (
        <ActionsMenu
          key={subtask.uid}
          tasks={[subtask.uid]}
          sprintOptions={sprintOptions}
          disabled={selectionEnabled}
          onAssignTasksToSprint={onAssignTasksToSprint}
          onAssignTasksToNewSprint={onAssignTasksToNewSprint}
        >
          <NestedSubtaskBase
            label={subtask.title}
            rightSection={<IconDotsVertical size={12} />}
            active={isItemSelected(subtask.uid)}
            onClick={() => onItemClick(subtask.uid)}
          />
        </ActionsMenu>
      ))}
    </TaskTreeWrapper>
  );
}

// MARK: Actions Menu

interface ActionsMenuProps
  extends Pick<
    TaskPoolProps,
    "sprintOptions" | "onAssignTasksToSprint" | "onAssignTasksToNewSprint"
  > {
  tasks: TaskId[];
}

function ActionsMenu({
  tasks,
  sprintOptions,
  onAssignTasksToSprint,
  onAssignTasksToNewSprint,
  children,
  ...props
}: PropsWithChildren<ActionsMenuProps> & MenuProps) {
  return (
    <Menu
      position="bottom-end"
      offset={{
        mainAxis: 0,
      }}
      {...props}
    >
      <Menu.Target>{children}</Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Assign to</Menu.Label>
        {sprintOptions.map((option) => (
          <Menu.Item
            key={option.id}
            onClick={() =>
              onAssignTasksToSprint({
                sprintId: option.id,
                tasks,
              })
            }
          >
            {option.title}
          </Menu.Item>
        ))}
        <Menu.Item onClick={() => onAssignTasksToNewSprint(tasks)}>
          New Sprint
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
