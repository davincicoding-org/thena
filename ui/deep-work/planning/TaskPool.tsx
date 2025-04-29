import type { PaperProps } from "@mantine/core";
import {
  ActionIcon,
  Button,
  Card,
  Collapse,
  Flex,
  Menu,
  NavLink,
  Paper,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { IconArrowLeft, IconX } from "@tabler/icons-react";

import type { Task, TaskReference } from "@/core/task-management";
import { useTaskSelection } from "@/ui/task-management";
import { cn } from "@/ui/utils";

export interface TaskPoolProps {
  items: Task[];
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
  items,
  sprintOptions,
  selectionEnabled,
  onSubmitSelection,
  onAbortSelection,
  onAssignTasksToSprint,
  ...props
}: TaskPoolProps & PaperProps) {
  console.log(items);
  const {
    selection,
    clearSelection,
    isTaskSelected,
    isSubtaskSelected,
    toggleTaskSelection,
    toggleSubtaskSelection,
  } = useTaskSelection();

  const handleTaskClick = (task: Task) => {
    if (!selectionEnabled) return;
    toggleTaskSelection(task);
  };

  const handleSubtaskClick = (taskReference: TaskReference) => {
    if (!selectionEnabled) return;
    toggleSubtaskSelection(taskReference);
  };

  const handleAbortSelection = () => {
    clearSelection();
    onAbortSelection();
  };

  const handleAssignTasks = () => {
    onSubmitSelection(selection);
    clearSelection();
  };

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
        <Stack gap="sm" p="md">
          {items.map((task) => (
            <Paper
              key={task.id}
              withBorder
              className="overflow-clip"
              radius="md"
            >
              <Menu
                position="bottom-end"
                key={task.id}
                disabled={selectionEnabled}
              >
                <Menu.Target>
                  <Paper
                    {...(task.subtasks?.length
                      ? {
                          withBorder: true,
                          mt: -1,
                          mx: -1,
                          bg: "neutral.6",
                          radius: "md",
                        }
                      : { radius: 0 })}
                  >
                    <NavLink
                      component="div"
                      color="gray"
                      active={isTaskSelected(task)}
                      label={task.title}
                      rightSection={null}
                      onClick={() => handleTaskClick(task)}
                    />
                  </Paper>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Assign to</Menu.Label>
                  {sprintOptions.map((option) => (
                    <Menu.Item
                      key={option.id}
                      onClick={() =>
                        onAssignTasksToSprint({
                          sprintId: option.id,
                          tasks: task.subtasks?.length
                            ? task.subtasks.map((subtask) => ({
                                taskId: task.id,
                                subtaskId: subtask.id,
                              }))
                            : [{ taskId: task.id, subtaskId: null }],
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
                        tasks: task.subtasks?.length
                          ? task.subtasks.map((subtask) => ({
                              taskId: task.id,
                              subtaskId: subtask.id,
                            }))
                          : [{ taskId: task.id, subtaskId: null }],
                      })
                    }
                  >
                    New Sprint
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
              {task.subtasks?.length ? (
                <Stack gap={0} flex={1}>
                  {task.subtasks?.map((subtask) => (
                    <Menu
                      position="bottom-end"
                      key={subtask.id}
                      disabled={selectionEnabled}
                    >
                      <Menu.Target>
                        <NavLink
                          component="div"
                          color="gray"
                          active={isSubtaskSelected({
                            taskId: task.id,
                            subtaskId: subtask.id,
                          })}
                          label={subtask.title}
                          rightSection={null}
                          onClick={() =>
                            handleSubtaskClick({
                              taskId: task.id,
                              subtaskId: subtask.id,
                            })
                          }
                        />
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Label>Assign to</Menu.Label>
                        {sprintOptions.map((option) => (
                          <Menu.Item
                            key={option.id}
                            onClick={() =>
                              onAssignTasksToSprint({
                                sprintId: option.id,
                                tasks: [
                                  {
                                    taskId: task.id,
                                    subtaskId: subtask.id,
                                  },
                                ],
                              })
                            }
                          >
                            {option.title}
                          </Menu.Item>
                        ))}
                      </Menu.Dropdown>
                    </Menu>
                  ))}
                </Stack>
              ) : undefined}
            </Paper>
          ))}
        </Stack>
      </ScrollArea>
    </Paper>
  );
}
