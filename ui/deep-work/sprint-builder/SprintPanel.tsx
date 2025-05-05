/* eslint-disable max-lines */
import type { MenuProps, PaperProps } from "@mantine/core";
import type { PropsWithChildren } from "react";
import { useMemo, useRef } from "react";
import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Menu,
  NumberInput,
  ScrollArea,
  Text,
} from "@mantine/core";
import {
  IconArrowBarToLeft,
  IconArrowBarToRight,
  IconArrowLeft,
  IconArrowRight,
  IconClock,
  IconDotsVertical,
  IconGripVertical,
  IconX,
} from "@tabler/icons-react";

import type { Duration, SprintPlan } from "@/core/deep-work";
import type {
  AnyTask,
  FlatTask,
  TaskId,
  TaskTree,
} from "@/core/task-management";
import { resolveDuration } from "@/core/deep-work";
import { flattenTasks, isTaskTree } from "@/core/task-management";
import { Panel } from "@/ui/components/Panel";
import { cn } from "@/ui/utils";

import {
  FlatTaskBase,
  NestedSubtaskBase,
  TaskTreeHeader,
  TaskTreeWrapper,
} from "./components";
import { SortableTasksContainer, useSortableTask } from "./dnd";

export interface SprintPanelProps {
  sprintId: SprintPlan["id"];
  title: string;
  duration: Duration;
  tasks: AnyTask[];
  disabled?: boolean;
  isTargeted?: boolean;
  canAddTasks: boolean;
  otherSprints: { id: string; title: string }[];
  dndEnabled?: boolean;
  moveOptions: {
    start: boolean;
    left: boolean;
    right: boolean;
    end: boolean;
  };
  onMove: (direction: "start" | "left" | "right" | "end") => void;
  onDrop: () => void;
  onDurationChange: (duration: Duration) => void;
  onAddTasks: (el: HTMLDivElement) => void;
  onUnassignTasks: (tasks: TaskId[]) => void;
  onMoveTasks: (options: { targetSprint: string; tasks: TaskId[] }) => void;
}

export function SprintPanel({
  sprintId,
  title,
  duration,
  tasks,
  otherSprints,
  disabled,
  isTargeted,
  moveOptions,
  onMove,
  canAddTasks,
  dndEnabled = false,
  onDrop,
  onDurationChange,
  onAddTasks,
  onUnassignTasks,
  onMoveTasks,
  className,
  ...props
}: SprintPanelProps & PaperProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  const items = useMemo((): AnyTask[] => {
    if (!dndEnabled) return tasks;
    return flattenTasks(tasks);
  }, [dndEnabled, tasks]);

  const durationMinutes = resolveDuration(duration).asMinutes();

  return (
    <Panel
      ref={panelRef}
      header={
        <Menu position="bottom-end">
          <Flex align="center" gap={4} pl="sm" pr={4} py={4}>
            <Text
              size="md"
              className={cn("text-nowrap transition-opacity", {
                "opacity-50": disabled,
              })}
            >
              {title}
            </Text>

            <NumberInput
              ml="auto"
              className="-my-1 -mr-1 shrink-0 not-focus-within:cursor-pointer"
              classNames={{
                input: cn("not-focus:cursor-pointer!"),
              }}
              hideControls
              disabled={disabled}
              leftSection={<IconClock size={16} />}
              radius="xl"
              size="xs"
              ff="monospace"
              value={durationMinutes}
              w={40 + durationMinutes.toString().length * 8}
              min={5}
              max={90}
              step={5}
              styles={{
                input: {
                  fontFamily: "inherit",
                  textAlign: "center",
                },
              }}
              onChange={(value) => {
                if (typeof value !== "number") return;
                onDurationChange({ minutes: Math.min(value, 90) });
              }}
            />

            <Menu.Target>
              <ActionIcon
                className="ml-1"
                aria-label="Sprint Options"
                variant="subtle"
                color="gray"
              >
                <IconDotsVertical size={16} />
              </ActionIcon>
            </Menu.Target>
          </Flex>
          <Menu.Dropdown>
            {moveOptions.start && (
              <Menu.Item
                leftSection={<IconArrowBarToLeft size={16} />}
                onClick={() => onMove("start")}
              >
                Move to Start
              </Menu.Item>
            )}
            {moveOptions.left && (
              <Menu.Item
                leftSection={<IconArrowLeft size={16} />}
                onClick={() => onMove("left")}
              >
                Move to Left
              </Menu.Item>
            )}
            {moveOptions.right && (
              <Menu.Item
                leftSection={<IconArrowRight size={16} />}
                onClick={() => onMove("right")}
              >
                Move to Right
              </Menu.Item>
            )}
            {moveOptions.end && (
              <Menu.Item
                leftSection={<IconArrowBarToRight size={16} />}
                onClick={() => onMove("end")}
              >
                Move to End
              </Menu.Item>
            )}
            <Menu.Divider className="first:hidden" />
            <Menu.Item
              color="red"
              leftSection={<IconX size={16} />}
              onClick={onDrop}
            >
              Drop Sprint
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      }
      className={cn(
        "min-w-64 transition-opacity",
        {
          "opacity-50": disabled,
        },
        className,
      )}
      {...props}
    >
      <ScrollArea scrollbars="y" scrollHideDelay={300}>
        <SortableTasksContainer
          id={sprintId}
          items={items.map((task) => task.uid)}
          enabled={dndEnabled}
        >
          {items.map((task) => {
            if (!isTaskTree(task))
              return (
                <FlatTaskItem
                  key={task.uid}
                  item={task}
                  otherSprints={otherSprints}
                  dndEnabled={dndEnabled}
                  onMoveTasks={onMoveTasks}
                  onUnassignTasks={onUnassignTasks}
                />
              );

            return (
              <TaskTreeItem
                key={task.uid}
                task={task}
                otherSprints={otherSprints}
                onMoveTasks={onMoveTasks}
                onUnassignTasks={onUnassignTasks}
              />
            );
          })}
          {!dndEnabled && (
            <Box className="empty:hidden">
              {canAddTasks && !disabled && !isTargeted && (
                <Button
                  variant="outline"
                  size="xs"
                  fullWidth
                  onClick={() => {
                    if (!panelRef.current) return;
                    onAddTasks(panelRef.current);
                  }}
                >
                  Assign Tasks
                </Button>
              )}
              {tasks.length === 0 && (
                <Text
                  c={isTargeted ? "primary" : undefined}
                  opacity={isTargeted ? 0.7 : 0.3}
                  className={cn(
                    "flex items-center justify-center transition-all not-first:hidden",
                  )}
                  h={30}
                >
                  {isTargeted
                    ? "Tasks will be added here"
                    : "No tasks assigned"}
                </Text>
              )}
            </Box>
          )}
        </SortableTasksContainer>
      </ScrollArea>
    </Panel>
  );
}

// MARK: Items

interface FlatTaskItemProps
  extends Pick<
    SprintPanelProps,
    "otherSprints" | "onMoveTasks" | "onUnassignTasks"
  > {
  item: FlatTask;
  dndEnabled: boolean;
}

function FlatTaskItem({
  item,
  otherSprints,
  dndEnabled,
  onMoveTasks,
  onUnassignTasks,
}: FlatTaskItemProps) {
  const { attributes, listeners, setNodeRef, style, isDragging, active } =
    useSortableTask(item, dndEnabled);

  return (
    <ActionsMenu
      tasks={[item.uid]}
      disabled={dndEnabled}
      otherSprints={otherSprints}
      onMoveTasks={onMoveTasks}
      onUnassignTasks={onUnassignTasks}
    >
      <FlatTaskBase
        group={"parent" in item ? item.parent.title : undefined}
        label={item.title}
        className={cn("transition-opacity", {
          "cursor-grab!": dndEnabled,
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
        style={style}
        {...attributes}
        {...listeners}
      />
    </ActionsMenu>
  );
}

interface TaskTreeItemProps
  extends Pick<
    SprintPanelProps,
    "otherSprints" | "onMoveTasks" | "onUnassignTasks"
  > {
  task: TaskTree;
}

function TaskTreeItem({
  task,
  otherSprints,
  onMoveTasks,
  onUnassignTasks,
}: TaskTreeItemProps) {
  return (
    <TaskTreeWrapper>
      <ActionsMenu
        tasks={task.subtasks.map((subtask) => subtask.uid)}
        otherSprints={otherSprints}
        onMoveTasks={onMoveTasks}
        onUnassignTasks={onUnassignTasks}
      >
        <TaskTreeHeader
          label={task.title}
          rightSection={<IconDotsVertical size={12} />}
        />
      </ActionsMenu>

      {task.subtasks.map((subtask) => (
        <ActionsMenu
          key={subtask.uid}
          tasks={[subtask.uid]}
          otherSprints={otherSprints}
          onMoveTasks={onMoveTasks}
          onUnassignTasks={onUnassignTasks}
        >
          <NestedSubtaskBase
            label={subtask.title}
            rightSection={<IconDotsVertical size={12} />}
          />
        </ActionsMenu>
      ))}
    </TaskTreeWrapper>
  );
}

// MARK: Actions Menu

interface ActionsMenuProps
  extends Pick<
    SprintPanelProps,
    "onMoveTasks" | "onUnassignTasks" | "otherSprints"
  > {
  tasks: TaskId[];
}

function ActionsMenu({
  tasks,
  otherSprints,
  onMoveTasks,
  onUnassignTasks,
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
        {otherSprints.length > 0 && (
          <>
            <Menu.Label>Move to</Menu.Label>
            {otherSprints.map((option) => (
              <Menu.Item
                key={option.id}
                onClick={() =>
                  onMoveTasks({
                    targetSprint: option.id,
                    tasks,
                  })
                }
              >
                {option.title}
              </Menu.Item>
            ))}
            <Menu.Divider />
          </>
        )}
        <Menu.Item
          color="red"
          leftSection={<IconX size={16} />}
          onClick={() => onUnassignTasks(tasks)}
        >
          Unassign
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
