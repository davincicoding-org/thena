import { Fragment } from "react";
import {
  Box,
  Button,
  Card,
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
import { IconClock } from "@tabler/icons-react";

import { SprintPlan } from "@/core/deep-work";
import { hasSubtasks } from "@/core/task-management";
import { cn } from "@/ui/utils";

import { TaskSelection } from "./types";

export interface SprintPanelProps {
  sprint: SprintPlan;
  title: string;
  disabled?: boolean;
  canAddTasks: boolean;
  sprintOptions: { id: string; title: string }[];
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
    <Paper
      key={sprint.id}
      withBorder
      display="grid"
      className={cn(
        "grid-rows-[auto_1fr] overflow-clip transition-opacity",
        {
          "opacity-50": disabled,
        },
        className,
      )}
      radius="md"
      {...props}
    >
      <Card px="sm" py="xs" radius={0} mb={4}>
        <Flex justify="space-between" align="center" gap="lg">
          <Text
            size="lg"
            className={cn("text-nowrap transition-opacity", {
              "opacity-50": disabled,
            })}
          >
            {title}
          </Text>
          <NumberInput
            className="-my-1 -mr-1 shrink-0"
            hideControls
            disabled={disabled}
            leftSection={<IconClock size={16} />}
            radius="xl"
            ff="monospace"
            value={sprint.duration}
            w={50 + sprint.duration.toString().length * 8}
            min={5}
            step={5}
            styles={{
              input: {
                fontFamily: "inherit",
              },
            }}
            onChange={(value) => {
              if (typeof value !== "number") return;
              onDurationChange(value);
            }}
          />
        </Flex>
      </Card>
      <ScrollArea scrollbars="y" scrollHideDelay={300}>
        {sprint.tasks.map((task) => (
          <Fragment key={task.id}>
            <Menu position="bottom-end">
              <Menu.Target>
                <NavLink
                  component="div"
                  label={task.title}
                  color="gray"
                  rightSection={null}
                />
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
              <Flex mb={4}>
                <Divider orientation="vertical" ml="sm" />
                <Stack gap={0} flex={1}>
                  {task.subtasks?.map((subtask) => (
                    <Menu position="bottom-end" key={subtask.id}>
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
                  ))}
                </Stack>
              </Flex>
            )}
          </Fragment>
        ))}

        <Collapse in={canAddTasks && sprint.tasks.length > 0} p="xs">
          <Button
            disabled={disabled}
            variant="default"
            fullWidth
            size="xs"
            onClick={onAddTasks}
          >
            Add Tasks
          </Button>
        </Collapse>

        {sprint.tasks.length === 0 && (
          <Box p="xs">
            {canAddTasks ? (
              <Button
                disabled={disabled}
                variant="outline"
                fullWidth
                onClick={onAddTasks}
              >
                Add Tasks
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
      </ScrollArea>
    </Paper>
  );
}
