/* eslint-disable max-lines */
import type { MenuProps, PaperProps } from "@mantine/core";
import type { PropsWithChildren } from "react";
import { useRef } from "react";
import { useDndContext, useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Menu,
  MenuDivider,
  NumberInput,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import {
  IconClock,
  IconDotsVertical,
  IconGripVertical,
  IconX,
} from "@tabler/icons-react";

import type { Duration, SprintPlan } from "@/core/deep-work";
import type {
  FlatTask,
  FlatTaskGroup,
  TaskReference,
} from "@/core/task-management";
import { resolveDuration } from "@/core/deep-work";
import { groupFlatTasks, isTaskGroup } from "@/core/task-management";
import { Panel } from "@/ui/components/Panel";
import { cn } from "@/ui/utils";

import {
  NestedTaskItemBase,
  StandaloneTaskItemBase,
  TaskItemsGroupContainer,
  TaskItemsGroupHeader,
} from "./components";

export interface SprintPanelProps {
  sprintId: SprintPlan["id"];
  title: string;
  duration: Duration;
  tasks: FlatTask[];
  disabled?: boolean;
  canAddTasks: boolean;
  otherSprints: { id: string; title: string }[];
  dndEnabled?: boolean;
  onDrop: () => void;
  onDurationChange: (duration: Duration) => void;
  onAddTasks: (el: HTMLDivElement) => void;
  onUnassignTasks: (tasks: TaskReference[]) => void;
  onMoveTasks: (options: {
    toSprintId: string;
    tasks: TaskReference[];
  }) => void;
}

export function SprintPanel({
  sprintId,
  title,
  duration,
  tasks,
  otherSprints,
  disabled,
  canAddTasks,
  dndEnabled,
  onDrop,
  onDurationChange,
  onAddTasks,
  onUnassignTasks,
  onMoveTasks,
  className,
  ...props
}: SprintPanelProps & PaperProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  const items = dndEnabled ? tasks : groupFlatTasks(tasks);

  const durationMinutes = resolveDuration(duration).asMinutes();

  return (
    <Panel
      ref={panelRef}
      header={
        <Menu position="bottom-end">
          <Flex align="center" gap={4} pl="sm" pr={4} py={4}>
            <Text
              size="lg"
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
            <Menu.Item color="red" onClick={onDrop}>
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
        <TasksContainer id={sprintId} items={tasks}>
          {items.map((taskOrGroup) => {
            if (!isTaskGroup(taskOrGroup))
              return (
                <StandaloneTaskItem
                  key={`${taskOrGroup.taskId}-${taskOrGroup.subtaskId}`}
                  item={taskOrGroup}
                  otherSprints={otherSprints}
                  dndEnabled={dndEnabled}
                  onMoveTasks={onMoveTasks}
                  onUnassignTasks={onUnassignTasks}
                />
              );

            return (
              <TaskItemsGroup
                key={taskOrGroup.taskId}
                group={taskOrGroup}
                otherSprints={otherSprints}
                onMoveTasks={onMoveTasks}
                onUnassignTasks={onUnassignTasks}
              />
            );
          })}
          <Box className="empty:hidden">
            {canAddTasks ? (
              <Button
                disabled={disabled}
                variant="outline"
                fullWidth
                onClick={() => {
                  if (!panelRef.current) return;
                  onAddTasks(panelRef.current);
                }}
              >
                Assign Tasks
              </Button>
            ) : tasks.length === 0 ? (
              <Text
                className="flex items-center justify-center opacity-30"
                h={36}
              >
                No tasks assigned
              </Text>
            ) : null}
          </Box>
        </TasksContainer>
      </ScrollArea>
    </Panel>
  );
}

function TasksContainer({
  id,
  items,
  children,
}: PropsWithChildren<{ id: string; items: TaskReference[] }>) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <SortableContext
      id={id}
      items={items.map(({ taskId, subtaskId }) => `${taskId}-${subtaskId}`)}
      strategy={verticalListSortingStrategy}
    >
      <Stack gap="sm" p="sm" bg="neutral.8" ref={setNodeRef}>
        {children}
      </Stack>
    </SortableContext>
  );
}

// MARK: Items

interface StandaloneTaskItemProps
  extends Pick<
    SprintPanelProps,
    "otherSprints" | "onMoveTasks" | "onUnassignTasks"
  > {
  item: FlatTask;
  dndEnabled?: boolean;
}

function StandaloneTaskItem({
  item,
  otherSprints,
  dndEnabled,
  onMoveTasks,
  onUnassignTasks,
}: StandaloneTaskItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: `${item.taskId}-${item.subtaskId}`,
      disabled: !dndEnabled,
      data: { item },
    });

  const { active } = useDndContext();

  return (
    <ActionsMenu
      tasks={[item]}
      disabled={dndEnabled}
      otherSprints={otherSprints}
      onMoveTasks={onMoveTasks}
      onUnassignTasks={onUnassignTasks}
    >
      <StandaloneTaskItemBase
        item={item}
        rightSection={
          active ? null : dndEnabled ? (
            <IconGripVertical size={12} />
          ) : (
            <IconDotsVertical size={12} />
          )
        }
        ref={setNodeRef}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
        }}
        {...attributes}
        {...listeners}
      />
    </ActionsMenu>
  );
}

interface TaskItemsGroupProps
  extends Pick<
    SprintPanelProps,
    "otherSprints" | "onMoveTasks" | "onUnassignTasks"
  > {
  group: FlatTaskGroup;
}

function TaskItemsGroup({
  group,
  otherSprints,
  onMoveTasks,
  onUnassignTasks,
}: TaskItemsGroupProps) {
  return (
    <TaskItemsGroupContainer>
      <ActionsMenu
        tasks={group.items}
        otherSprints={otherSprints}
        onMoveTasks={onMoveTasks}
        onUnassignTasks={onUnassignTasks}
      >
        <TaskItemsGroupHeader
          label={group.groupLabel}
          rightSection={<IconDotsVertical size={12} />}
        />
      </ActionsMenu>

      {group.items.map((item) => (
        <ActionsMenu
          key={`${item.taskId}-${item.subtaskId}`}
          tasks={[item]}
          otherSprints={otherSprints}
          onMoveTasks={onMoveTasks}
          onUnassignTasks={onUnassignTasks}
        >
          <NestedTaskItemBase
            item={item}
            rightSection={<IconDotsVertical size={12} />}
          />
        </ActionsMenu>
      ))}
    </TaskItemsGroupContainer>
  );
}

// MARK: Actions Menu

interface ActionsMenuProps
  extends Pick<
    SprintPanelProps,
    "onMoveTasks" | "onUnassignTasks" | "otherSprints"
  > {
  tasks: TaskReference[];
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
                    toSprintId: option.id,
                    tasks,
                  })
                }
              >
                {option.title}
              </Menu.Item>
            ))}
            <MenuDivider />
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
