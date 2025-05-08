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

import type { RunnableSprint, RunnableTask } from "@/core/deep-work";
import { FlatTaskBase } from "@/ui/deep-work/session-planner/components";

export interface SessionReviewProps {
  sprints: RunnableSprint[];
  onLeave: (
    statusUpdates: Record<RunnableTask["runId"], RunnableTask["status"]>,
  ) => void;
}

export function SessionReview({ sprints, onLeave }: SessionReviewProps) {
  const allTasks = sprints.flatMap((sprint) => sprint.tasks);
  const inCompletedTasks = allTasks.filter(
    (task) => task.status !== "completed",
  );

  const { title, description } = rateCompletion({
    totalTasks: allTasks.length,
    completedTasks: allTasks.length - inCompletedTasks.length,
  });

  const [statusUpdates, setStatusUpdates] = useState<
    Record<RunnableTask["runId"], RunnableTask["status"]>
  >({});

  const handleStatusUpdate = (
    taskId: RunnableTask["id"],
    status: RunnableTask["status"],
  ) => {
    setStatusUpdates((prev) => ({ ...prev, [taskId]: status }));
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
      {inCompletedTasks.length && (
        <>
          <Divider my="sm" />
          <Text>What should happen with your incompleted tasks?</Text>
          <Space h="xs" />
          <Paper
            withBorder
            className="grid! max-h-48 grid-rows-1 overflow-clip"
          >
            <ScrollArea type="never" className="min-h-0">
              {inCompletedTasks.map((task, index) => (
                <Fragment key={task.id}>
                  {index > 0 && <Divider />}
                  <FlatTaskBase
                    asButton={false}
                    label={task.title}
                    withBorder={false}
                    className="*:cursor-auto!"
                    group={"parent" in task ? task.parent.title : undefined}
                    rightSection={
                      <Group gap="xs">
                        <Button
                          variant={
                            statusUpdates[task.runId] === "abandoned"
                              ? "filled"
                              : "subtle"
                          }
                          size="compact-sm"
                          color="red"
                          onClick={() =>
                            handleStatusUpdate(task.runId, "abandoned")
                          }
                        >
                          Drop
                        </Button>

                        <Button
                          variant={
                            statusUpdates[task.runId] === "deferred"
                              ? "filled"
                              : "subtle"
                          }
                          size="compact-sm"
                          onClick={() =>
                            handleStatusUpdate(task.runId, "deferred")
                          }
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
        disabled={inCompletedTasks.some(
          ({ runId }) => statusUpdates[runId] === undefined,
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
