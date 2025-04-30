import type { PaperProps } from "@mantine/core";
import type { Ref } from "react";
import { Fragment, useEffect, useMemo, useState } from "react";
import {
  ActionIcon,
  Box,
  Button,
  Collapse,
  Divider,
  Flex,
  Paper,
  Progress,
} from "@mantine/core";
import { IconPlayerPause } from "@tabler/icons-react";

import type { Duration, WithRunMetrics } from "@/core/deep-work";
import type { FlatTask, TaskReference } from "@/core/task-management";
import { isTaskRunnable, resolveDuration } from "@/core/deep-work";
import { cn } from "@/ui/utils";

import { QueueTask } from "./QueueTask";

type SprintStatus = "idle" | "running" | "paused";

export interface SprintWidgetProps {
  initialStatus?: SprintStatus;
  duration: Duration;
  warnBeforeTimeRunsOut?: number;
  viewOnly?: boolean;
  tasks: WithRunMetrics<FlatTask>[];
  allowToPause?: boolean;
  ref?: Ref<HTMLDivElement>;
  onStart?: () => void;
  onCompleteTask?: (task: TaskReference) => void;
  onSkipTask?: (task: TaskReference) => void;
  onJumpToTask?: (task: TaskReference, tasksToSkip?: TaskReference[]) => void;
  onPause?: () => void;
  onResume?: () => void;
  onFinish?: () => void;
}
export function SprintWidget({
  initialStatus = "idle",
  duration,
  warnBeforeTimeRunsOut = 0,
  tasks,
  viewOnly = false,
  allowToPause = false,
  ref,
  onStart,
  onCompleteTask,
  onSkipTask,
  onJumpToTask,
  onPause,
  onResume,
  onFinish,
  className,
  ...paperProps
}: SprintWidgetProps & PaperProps) {
  const [status, setStatus] = useState<SprintStatus>(initialStatus);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const durationMs = resolveDuration(duration).asMilliseconds();

  const currentTask = useMemo(() => {
    if (status === "idle") return undefined;
    return tasks.find(isTaskRunnable);
  }, [status, tasks]);

  const outOfTasks = tasks.filter(isTaskRunnable).length === 0;

  useEffect(() => {
    if (status === "idle") return;
    if (status === "paused") return;

    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 100);
    }, 100);

    return () => clearInterval(timer);
  }, [status, paused]);

  const isTimeUp = timeElapsed >= durationMs;
  const warningThreshold =
    warnBeforeTimeRunsOut && Math.max(durationMs - warnBeforeTimeRunsOut, 0);
  const shouldWarnAboutTime = warningThreshold
    ? timeElapsed >= warningThreshold
    : false;

  const handleStart = () => {
    setStatus("running");
    onStart?.();
  };

  const handlePause = () => {
    setPaused(true);
    onPause?.();
  };

  const handleResume = () => {
    setPaused(false);
    onResume?.();
  };

  const handleJumpToTask = (task: TaskReference) => {
    const taskIndex = tasks.findIndex(
      ({ taskId, subtaskId }) =>
        taskId === task.taskId && subtaskId === task.subtaskId,
    );
    if (taskIndex === -1) return;

    const tasksToSkip = tasks.slice(0, taskIndex).filter(isTaskRunnable);
    onJumpToTask?.(task, tasksToSkip);
  };

  return (
    <Paper
      withBorder
      shadow="sm"
      radius="md"
      ref={ref}
      className={cn("overflow-clip", className)}
      {...paperProps}
    >
      <Collapse in={status !== "idle" && !viewOnly} animateOpacity>
        <Flex gap={4} h={24} pt="xs" px="sm" align="center">
          <Progress
            flex={1}
            color={
              isTimeUp ? "red" : shouldWarnAboutTime ? "yellow" : undefined
            }
            classNames={{
              root: cn("transition-colors", {
                "animate-pulse": isTimeUp,
              }),
              section: "ease-linear!",
            }}
            value={(timeElapsed / durationMs) * 100}
          />
          {allowToPause && !paused && !isTimeUp && (
            <ActionIcon
              size="xs"
              aria-label="Pause Sprint"
              variant="subtle"
              color="gray"
              onClick={handlePause}
            >
              <IconPlayerPause size={16} />
            </ActionIcon>
          )}
        </Flex>
      </Collapse>
      <Box p="sm">
        <Paper className="overflow-clip" withBorder>
          {tasks.map((item) => (
            <Fragment key={`${item.taskId}-${item.subtaskId}`}>
              <QueueTask
                group={item.parentTitle}
                label={item.title}
                readOnly={viewOnly || status === "idle"}
                status={
                  item.completedAt
                    ? "completed"
                    : item.skipped
                      ? "skipped"
                      : currentTask?.taskId === item.taskId &&
                          currentTask?.subtaskId === item.subtaskId
                        ? "active"
                        : "upcoming"
                }
                onComplete={() =>
                  onCompleteTask?.({
                    taskId: item.taskId,
                    subtaskId: item.subtaskId,
                  })
                }
                onSkip={() =>
                  onSkipTask?.({
                    taskId: item.taskId,
                    subtaskId: item.subtaskId,
                  })
                }
                onRunManually={() =>
                  handleJumpToTask?.({
                    taskId: item.taskId,
                    subtaskId: item.subtaskId,
                  })
                }
              />
              <Divider className="last:hidden" />
            </Fragment>
          ))}
        </Paper>
      </Box>

      {!viewOnly && (
        <>
          <Collapse in={timeElapsed === 0} animateOpacity>
            <Divider />
            <Button fullWidth className="rounded-t-none!" onClick={handleStart}>
              Start Sprint
            </Button>
          </Collapse>
          <Collapse in={paused} animateOpacity>
            <Divider />
            <Button
              fullWidth
              className="rounded-t-none!"
              onClick={handleResume}
            >
              Resume Sprint
            </Button>
          </Collapse>
          <Collapse in={isTimeUp || outOfTasks} animateOpacity>
            <Divider />
            <Button fullWidth className="rounded-t-none!" onClick={onFinish}>
              Finish Sprint
            </Button>
          </Collapse>
        </>
      )}
    </Paper>
  );
}
