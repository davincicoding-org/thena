import type { MenuProps, PaperProps } from "@mantine/core";
import type { PropsWithChildren } from "react";
import { Fragment, useRef } from "react";
import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Flex,
  Menu,
  MenuDivider,
  NavLink,
  NumberInput,
  Paper,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { IconClock, IconDotsVertical, IconX } from "@tabler/icons-react";

import type { FlatTask, TaskReference } from "@/core/task-management";
import { groupFlatTasks } from "@/core/task-management";
import { Panel } from "@/ui/components/Panel";
import { cn } from "@/ui/utils";

export interface SprintPanelProps {
  title: string;
  duration: number;
  tasks: FlatTask[];
  disabled?: boolean;
  canAddTasks: boolean;
  otherSprints: { id: string; title: string }[];
  onDrop: () => void;
  onDurationChange: (duration: number) => void;
  onAddTasks: (el: HTMLDivElement) => void;
  onUnassignTasks: (tasks: TaskReference[]) => void;
  onMoveTasks: (options: {
    toSprintId: string;
    tasks: TaskReference[];
  }) => void;
}

export function SprintPanel({
  title,
  duration,
  tasks,
  otherSprints,
  disabled,
  canAddTasks,
  onDrop,
  onDurationChange,
  onAddTasks,
  onUnassignTasks,
  onMoveTasks,
  className,
  ...props
}: SprintPanelProps & PaperProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  const items = groupFlatTasks(tasks);

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
              value={duration}
              w={40 + duration.toString().length * 8}
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
                onDurationChange(Math.min(value, 90));
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
        <Stack gap="sm" p="sm" bg="neutral.8">
          {items.map((taskOrGroup) => {
            if (!("groupLabel" in taskOrGroup))
              return (
                <ActionsMenu
                  key={`${taskOrGroup.taskId}-${taskOrGroup.subtaskId}`}
                  tasks={[taskOrGroup]}
                  otherSprints={otherSprints}
                  onMoveTasks={onMoveTasks}
                  onUnassignTasks={onUnassignTasks}
                >
                  <Paper
                    key={`${taskOrGroup.taskId}-${taskOrGroup.subtaskId}`}
                    className={cn(
                      "cursor-pointer px-3",
                      taskOrGroup.parentTitle ? "py-1.5" : "py-2",
                    )}
                    withBorder
                  >
                    {taskOrGroup.parentTitle ? (
                      <Text size="xs" opacity={0.5}>
                        {taskOrGroup.parentTitle}
                      </Text>
                    ) : null}
                    <Text size="sm">{taskOrGroup.title}</Text>
                  </Paper>
                </ActionsMenu>
              );

            return (
              <Paper
                key={taskOrGroup.taskId}
                withBorder
                className="overflow-clip"
              >
                <ActionsMenu
                  tasks={taskOrGroup.items}
                  otherSprints={otherSprints}
                  onMoveTasks={onMoveTasks}
                  onUnassignTasks={onUnassignTasks}
                >
                  <Text
                    size="xs"
                    opacity={0.5}
                    className="cursor-pointer px-1.5! py-1!"
                  >
                    {taskOrGroup.groupLabel}
                  </Text>
                </ActionsMenu>
                {taskOrGroup.items.map((item) => (
                  <Fragment key={`${item.taskId}-${item.subtaskId}`}>
                    <Divider />
                    <ActionsMenu
                      tasks={[item]}
                      otherSprints={otherSprints}
                      onMoveTasks={onMoveTasks}
                      onUnassignTasks={onUnassignTasks}
                    >
                      <NavLink className="px-2! py-1!" label={item.title} />
                    </ActionsMenu>
                  </Fragment>
                ))}
              </Paper>
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
        </Stack>
      </ScrollArea>
    </Panel>
  );
}

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
        mainAxis: -20,
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
