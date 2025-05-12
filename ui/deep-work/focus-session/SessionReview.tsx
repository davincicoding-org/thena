import { Fragment, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Group,
  Paper,
  ScrollArea,
  Space,
  Text,
} from "@mantine/core";

import type { RunnableSprint } from "@/core/deep-work";
import type { TaskSelect } from "@/core/task-management";
import { FlatTaskBase } from "@/ui/deep-work/session-planner/components";

export interface SessionReviewProps {
  sprints: RunnableSprint[];
  onLeave: (
    statusUpdates: Record<TaskSelect["id"], TaskSelect["status"]>,
  ) => void;
}

export function SessionReview({ sprints, onLeave }: SessionReviewProps) {
  const allTasks = sprints.flatMap((sprint) => sprint.tasks);
  const incompleteTasks = allTasks.filter(
    (task) => task.status !== "completed",
  );

  const { title, description } = rateCompletion({
    totalTasks: allTasks.length,
    completedTasks: allTasks.length - incompleteTasks.length,
  });

  const [statusUpdates, setStatusUpdates] = useState<
    Record<TaskSelect["id"], TaskSelect["status"]>
  >({});

  const handleStatusUpdate = (
    taskId: TaskSelect["id"],
    taskStatus: TaskSelect["status"],
  ) => {
    setStatusUpdates((prev) => ({ ...prev, [taskId]: taskStatus }));
  };

  return (
    <Box>
      <Text ta="center" className="text-4xl!">
        {title}
      </Text>
      <Space h="sm" />
      <Text ta="center" size="xl" className="text-balance">
        {description}
      </Text>
      {incompleteTasks.length > 0 && (
        <>
          <Divider my="sm" />
          <Text>What should happen with your incompleted tasks?</Text>
          <Space h="xs" />
          <Paper
            withBorder
            className="grid! max-h-48 grid-rows-1 overflow-clip"
          >
            <ScrollArea type="never" className="min-h-0">
              {incompleteTasks.map(({ runId, task }, index) => (
                <Fragment key={runId}>
                  {index > 0 && <Divider />}
                  <FlatTaskBase
                    asButton={false}
                    label={task.title}
                    withBorder={false}
                    className="*:cursor-auto!"
                    group={task.parent?.title}
                    rightSection={
                      <Group gap="xs">
                        <Button
                          variant={
                            statusUpdates[task.id] === "deleted"
                              ? "filled"
                              : "subtle"
                          }
                          size="compact-sm"
                          color="red"
                          onClick={() => handleStatusUpdate(task.id, "deleted")}
                        >
                          Drop
                        </Button>

                        <Button
                          variant={
                            statusUpdates[task.id] === "todo"
                              ? "filled"
                              : "subtle"
                          }
                          size="compact-sm"
                          onClick={() => handleStatusUpdate(task.id, "todo")}
                        >
                          Do Later
                        </Button>
                      </Group>
                    }
                  />
                </Fragment>
              ))}
            </ScrollArea>
          </Paper>
        </>
      )}
      <Space h="lg" />
      <Button
        fullWidth
        size="md"
        disabled={incompleteTasks.some(
          ({ task }) => statusUpdates[task.id] === undefined,
        )}
        onClick={() => onLeave(statusUpdates)}
      >
        Leave Session
      </Button>
    </Box>
  );
}

const rateCompletion = ({
  totalTasks,
  completedTasks,
}: {
  totalTasks: number;
  completedTasks: number;
}): { title: string; description: string } => {
  const completionRate = completedTasks / totalTasks;

  if (completionRate === 1)
    return {
      title: "A PERFECT SESSION",
      description: "You've completed all your tasks!",
    };

  if (completionRate > 0.8)
    return {
      title: "WELL DONE",
      description: "You've completed most of your tasks!",
    };

  if (completionRate > 0.5)
    return {
      title: "NICE WORK",
      description: "You've completed more then half of your tasks!",
    };

  if (completionRate > 0)
    return {
      title: "YOU'RE ON THE RIGHT TRACK",
      description: "You've completed some of your tasks!",
    };

  return {
    title: "SESSION IS OVER",
    description: "You haven't completed all your tasks!",
  };
};
