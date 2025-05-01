import type { MenuProps, PaperProps } from "@mantine/core";
import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { useDndContext, useDraggable, useDroppable } from "@dnd-kit/core";
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
  FlatTask,
  FlatTaskGroup,
  TaskReference,
} from "@/core/task-management";
import { groupFlatTasks, isTaskGroup } from "@/core/task-management";
import {
  NestedTaskItemBase,
  StandaloneTaskItemBase,
  TaskItemsGroupContainer,
  TaskItemsGroupHeader,
} from "@/ui/deep-work/sprint-builder/components";
import { useTaskSelection } from "@/ui/task-management";
import { cn } from "@/ui/utils";

export interface TaskPoolProps {
  tasks: FlatTask[];
  selectionEnabled: boolean;
  dndEnabled: boolean;
  sprintOptions: { id: string; title: string }[];
  onSubmitSelection: (tasks: TaskReference[]) => void;
  onAbortSelection: () => void;
  onAssignTasksToSprint: (options: {
    sprintId: string | null;
    tasks: TaskReference[];
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
  ...props
}: TaskPoolProps & PaperProps) {
  const {
    selection,
    clearSelection,
    isTaskSelected,
    isTaskGroupSelected,
    toggleTaskSelection,
    toggleTaskGroupSelection,
  } = useTaskSelection();

  useEffect(() => {
    if (!selectionEnabled) {
      clearSelection();
    }
  }, [selectionEnabled, clearSelection]);

  const handleTaskClick = (taskReference: TaskReference) => {
    if (!selectionEnabled) return;
    toggleTaskSelection(taskReference);
  };
  const handleTaskGroupClick = (taskReferences: TaskReference[]) => {
    if (!selectionEnabled) return;
    toggleTaskGroupSelection(taskReferences);
  };

  const handleAbortSelection = () => {
    clearSelection();
    onAbortSelection();
  };

  const handleAssignTasks = () => {
    onSubmitSelection(selection);
    clearSelection();
  };

  const items = dndEnabled ? tasks : groupFlatTasks(tasks);

  const { setNodeRef } = useDroppable({
    id: "TASK_POOL",
    disabled: !dndEnabled,
  });

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
          {items.map((taskOrGroup) => {
            if (!isTaskGroup(taskOrGroup))
              return (
                <StandaloneTaskItem
                  key={`${taskOrGroup.taskId}-${taskOrGroup.subtaskId}`}
                  item={taskOrGroup}
                  selected={isTaskSelected(taskOrGroup)}
                  sprintOptions={sprintOptions}
                  dndEnabled={dndEnabled}
                  selectionEnabled={selectionEnabled}
                  onAssignTasksToSprint={onAssignTasksToSprint}
                  onClick={() => handleTaskClick(taskOrGroup)}
                />
              );

            return (
              <TaskItemsGroup
                key={taskOrGroup.taskId}
                group={taskOrGroup}
                sprintOptions={sprintOptions}
                selectionEnabled={selectionEnabled}
                selected={isTaskGroupSelected(taskOrGroup.items)}
                isItemSelected={(item) => isTaskSelected(item)}
                onAssignTasksToSprint={onAssignTasksToSprint}
                onGroupClick={() => handleTaskGroupClick(taskOrGroup.items)}
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
  extends Pick<TaskPoolProps, "sprintOptions" | "onAssignTasksToSprint"> {
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
}: StandaloneTaskItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `${item.taskId}-${item.subtaskId}`,
    disabled: !dndEnabled,
    data: { item },
  });

  const { active } = useDndContext();

  return (
    <ActionsMenu
      tasks={[item]}
      disabled={dndEnabled || selectionEnabled}
      sprintOptions={sprintOptions}
      onAssignTasksToSprint={onAssignTasksToSprint}
    >
      <StandaloneTaskItemBase
        item={item}
        active={selected}
        className={cn("transition-opacity", {
          "pointer-events-none opacity-30": isDragging,
        })}
        rightSection={
          active && dndEnabled ? null : dndEnabled ? (
            <IconGripVertical size={12} />
          ) : (
            <IconDotsVertical size={12} />
          )
        }
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        // TODO Check if this doesn't break the dnd
        onClick={onClick}
      />
    </ActionsMenu>
  );
}

interface TaskItemsGroupProps
  extends Pick<TaskPoolProps, "sprintOptions" | "onAssignTasksToSprint"> {
  group: FlatTaskGroup;
  selectionEnabled: boolean;
  selected: boolean;
  isItemSelected: (item: TaskReference) => boolean;
  onGroupClick: () => void;
  onItemClick: (item: FlatTask) => void;
}

function TaskItemsGroup({
  group,
  sprintOptions,
  selectionEnabled,
  selected,
  isItemSelected,
  onAssignTasksToSprint,
  onGroupClick,
  onItemClick,
}: TaskItemsGroupProps) {
  return (
    <TaskItemsGroupContainer>
      <ActionsMenu
        tasks={group.items}
        sprintOptions={sprintOptions}
        disabled={selectionEnabled}
        onAssignTasksToSprint={onAssignTasksToSprint}
      >
        <TaskItemsGroupHeader
          label={group.groupLabel}
          rightSection={<IconDotsVertical size={12} />}
          active={selected}
          onClick={onGroupClick}
        />
      </ActionsMenu>

      {group.items.map((item) => (
        <ActionsMenu
          key={`${item.taskId}-${item.subtaskId}`}
          tasks={[item]}
          sprintOptions={sprintOptions}
          disabled={selectionEnabled}
          onAssignTasksToSprint={onAssignTasksToSprint}
        >
          <NestedTaskItemBase
            item={item}
            rightSection={<IconDotsVertical size={12} />}
            active={isItemSelected(item)}
            onClick={() => onItemClick(item)}
          />
        </ActionsMenu>
      ))}
    </TaskItemsGroupContainer>
  );
}

// MARK: Actions Menu

interface ActionsMenuProps
  extends Pick<TaskPoolProps, "onAssignTasksToSprint" | "sprintOptions"> {
  tasks: TaskReference[];
}

function ActionsMenu({
  tasks,
  sprintOptions,
  onAssignTasksToSprint,
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
        <Menu.Item
          onClick={() =>
            onAssignTasksToSprint({
              sprintId: null,
              tasks,
            })
          }
        >
          New Sprint
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
