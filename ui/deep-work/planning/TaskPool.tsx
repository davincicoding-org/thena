import type { MenuProps, PaperProps } from "@mantine/core";
import type { PropsWithChildren } from "react";
import { Fragment, useEffect } from "react";
import {
  ActionIcon,
  Button,
  Card,
  Collapse,
  Divider,
  Flex,
  Menu,
  NavLink,
  Paper,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { IconArrowLeft, IconDotsVertical, IconX } from "@tabler/icons-react";

import type { FlatTask, TaskReference } from "@/core/task-management";
import { groupFlatTasks, isTaskGroup } from "@/core/task-management";
import { useTaskSelection } from "@/ui/task-management";
import { cn } from "@/ui/utils";

export interface TaskPoolProps {
  tasks: FlatTask[];
  selectionEnabled: boolean;
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

  const items = groupFlatTasks(tasks);

  return (
    <Paper
      withBorder
      display="grid"
      bg="neutral.8"
      radius="md"
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
        classNames={{ viewport: "pb-2" }}
        scrollHideDelay={300}
      >
        <Stack gap="sm" p="sm">
          {items.map((taskOrGroup) => {
            if (!isTaskGroup(taskOrGroup))
              return (
                <ActionsMenu
                  key={`${taskOrGroup.taskId}-${taskOrGroup.subtaskId}`}
                  disabled={selectionEnabled}
                  tasks={[taskOrGroup]}
                  sprintOptions={sprintOptions}
                  onAssignTasksToSprint={onAssignTasksToSprint}
                >
                  <Paper withBorder className="overflow-clip">
                    <NavLink
                      component="button"
                      classNames={{ body: cn("flex flex-col-reverse") }}
                      className="truncate px-2! py-1! text-nowrap"
                      description={taskOrGroup.parentTitle}
                      label={taskOrGroup.title}
                      active={isTaskSelected(taskOrGroup)}
                      onClick={() => handleTaskClick(taskOrGroup)}
                    />
                  </Paper>
                </ActionsMenu>
              );

            return (
              <Paper key={taskOrGroup.taskId} withBorder>
                <ActionsMenu
                  disabled={selectionEnabled}
                  tasks={taskOrGroup.items}
                  sprintOptions={sprintOptions}
                  onAssignTasksToSprint={onAssignTasksToSprint}
                >
                  <NavLink
                    component="button"
                    description={taskOrGroup.groupLabel}
                    className="cursor-pointer truncate px-1.5! py-1! text-nowrap"
                    active={isTaskGroupSelected(taskOrGroup.items)}
                    rightSection={
                      selectionEnabled ? undefined : (
                        <IconDotsVertical size={12} />
                      )
                    }
                    onClick={() => handleTaskGroupClick(taskOrGroup.items)}
                  />
                </ActionsMenu>

                {taskOrGroup.items.map((item) => (
                  <Fragment key={`${item.taskId}-${item.subtaskId}`}>
                    <Divider />
                    <ActionsMenu
                      disabled={selectionEnabled}
                      tasks={[item]}
                      sprintOptions={sprintOptions}
                      onAssignTasksToSprint={onAssignTasksToSprint}
                    >
                      <NavLink
                        component="button"
                        className="truncate px-2! py-1! text-nowrap"
                        label={item.title}
                        active={isTaskSelected(item)}
                        rightSection={
                          selectionEnabled ? undefined : (
                            <IconDotsVertical size={12} />
                          )
                        }
                        onClick={() => handleTaskClick(item)}
                      />
                    </ActionsMenu>
                  </Fragment>
                ))}
              </Paper>
            );
          })}
        </Stack>
      </ScrollArea>
    </Paper>
  );
}

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
