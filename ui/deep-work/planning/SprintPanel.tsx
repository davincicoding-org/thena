import { Fragment } from "react";
import {
  ActionIcon,
  Box,
  Button,
  Collapse,
  Divider,
  Flex,
  Menu,
  MenuDivider,
  NavLink,
  NumberInput,
  Paper,
  PaperProps,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { IconClock, IconDotsVertical } from "@tabler/icons-react";

import { SprintPlan, TaskSelection } from "@/core/deep-work";
import { hasSubtasks } from "@/core/task-management";
import { BoundOverlay } from "@/ui/components/BoundOverlay";
import { Panel } from "@/ui/components/Panel";
import { cn } from "@/ui/utils";

export interface SprintPanelProps {
  sprint: SprintPlan;
  title: string;
  disabled?: boolean;
  canAddTasks: boolean;
  sprintOptions: { id: string; title: string }[];
  onDrop: () => void;
  onDurationChange: (duration: number) => void;
  onAddTasks: () => void;
  onUnassignTask: (task: TaskSelection) => void;
  onMoveTasks: (options: {
    toSprintId: string;
    tasks: TaskSelection[];
  }) => void;
}

export function SprintPanel({
  sprint,
  title,
  sprintOptions,
  disabled,
  canAddTasks,
  onDrop,
  onDurationChange,
  onAddTasks,
  onUnassignTask,
  onMoveTasks,
  className,
  ...props
}: SprintPanelProps & PaperProps) {
  const otherSprints = sprintOptions.filter(
    (option) => option.id !== sprint.id,
  );
  return (
    <Panel
      key={sprint.id}
      header={
        <BoundOverlay
          overlayProps={{
            className: "backdrop-blur-xs",
          }}
          content={
            <Flex className="h-full" align="center" justify="end" px="sm">
              <Button
                variant="outline"
                color="red"
                size="compact-sm"
                onClick={onDrop}
              >
                Drop Sprint
              </Button>
            </Flex>
          }
        >
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
              className="-my-1 -mr-1 shrink-0"
              hideControls
              disabled={disabled}
              leftSection={<IconClock size={16} />}
              radius="xl"
              size="xs"
              ff="monospace"
              value={sprint.duration}
              w={40 + sprint.duration.toString().length * 8}
              min={5}
              step={5}
              styles={{
                input: {
                  fontFamily: "inherit",
                  textAlign: "center",
                },
              }}
              onChange={(value) => {
                if (typeof value !== "number") return;
                onDurationChange(value);
              }}
            />

            <BoundOverlay.Trigger>
              <ActionIcon
                aria-label="Sprint Options"
                variant="transparent"
                color="gray"
              >
                <IconDotsVertical size={16} />
              </ActionIcon>
            </BoundOverlay.Trigger>
          </Flex>
        </BoundOverlay>
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
          {sprint.tasks.map((task) => (
            <Paper
              key={task.id}
              withBorder
              className="overflow-clip"
              radius="md"
            >
              <Menu position="bottom-end">
                <Menu.Target>
                  <Paper
                    {...(hasSubtasks(task)
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
                      label={task.title}
                      color="gray"
                      rightSection={null}
                    />
                  </Paper>
                </Menu.Target>
                <Menu.Dropdown>
                  {otherSprints.length > 0 && (
                    <>
                      <Menu.Label>Move to</Menu.Label>

                      {otherSprints.map((option) => (
                        <Menu.Item
                          key={option.id}
                          onClick={() => {
                            onMoveTasks({
                              toSprintId: option.id,
                              tasks: [{ taskId: task.id }],
                            });
                          }}
                        >
                          {option.title}
                        </Menu.Item>
                      ))}
                    </>
                  )}
                  <MenuDivider className="first:hidden" />
                  <Menu.Item
                    color="red"
                    onClick={() => onUnassignTask({ taskId: task.id })}
                  >
                    Unassign
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>

              {hasSubtasks(task) && (
                <Stack gap={0} flex={1}>
                  {task.subtasks.map((subtask) => (
                    <Fragment key={subtask.id}>
                      <Menu position="bottom-end">
                        <Menu.Target>
                          <NavLink
                            component="div"
                            color="gray"
                            label={subtask.title}
                            rightSection={null}
                          />
                        </Menu.Target>
                        <Menu.Dropdown>
                          {otherSprints.length > 0 && (
                            <>
                              <Menu.Label>Assign to</Menu.Label>
                              {otherSprints.map((option) => (
                                <Menu.Item
                                  key={option.id}
                                  onClick={() =>
                                    onMoveTasks({
                                      toSprintId: option.id,
                                      tasks: [
                                        {
                                          taskId: task.id,
                                          subtasks: [subtask.id],
                                        },
                                      ],
                                    })
                                  }
                                >
                                  {option.title}
                                </Menu.Item>
                              ))}
                            </>
                          )}
                          <MenuDivider className="first:hidden" />
                          <Menu.Item
                            color="red"
                            onClick={() =>
                              onUnassignTask({
                                taskId: task.id,
                                subtasks: [subtask.id],
                              })
                            }
                          >
                            Unassign
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                      <Divider className="last:hidden" />
                    </Fragment>
                  ))}
                </Stack>
              )}
            </Paper>
          ))}

          <Collapse in={canAddTasks && sprint.tasks.length > 0}>
            <Button
              disabled={disabled}
              variant="default"
              fullWidth
              size="xs"
              onClick={onAddTasks}
            >
              Assign Tasks
            </Button>
          </Collapse>

          {sprint.tasks.length === 0 && (
            <Box>
              {canAddTasks ? (
                <Button
                  disabled={disabled}
                  variant="outline"
                  fullWidth
                  onClick={onAddTasks}
                >
                  Assign Tasks
                </Button>
              ) : (
                <Text
                  className="flex items-center justify-center opacity-30"
                  h={36}
                >
                  No tasks assigned
                </Text>
              )}
            </Box>
          )}
        </Stack>
      </ScrollArea>
    </Panel>
  );
}
