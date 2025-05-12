import type { PaperProps } from "@mantine/core";
import type { Ref } from "react";
import { Fragment, useMemo } from "react";
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

import type { Duration, TaskRun } from "@/core/deep-work";
import type { TaskId } from "@/core/task-management";
import { resolveDuration } from "@/core/deep-work";
import { cn } from "@/ui/utils";

import { QueueTask } from "./QueueTask";

type SprintStatus = "idle" | "running" | "paused";

export interface SprintWidgetProps {
  disabled?: boolean;
  initialStatus?: SprintStatus;
  duration: Duration;
  timeElapsed: number;
  warnBeforeTimeRunsOut?: number;
  tasks: TaskRun[];
  paused?: boolean;
  allowToPause?: boolean;
  ref?: Ref<HTMLDivElement>;
  onStart?: () => void;
  onCompleteTask?: (task: TaskId) => void;
  onSkipTask?: (task: TaskId) => void;
  onUnskipTask?: (task: TaskId) => void;
  // onJumpToTask?: (task: TaskId, tasksToSkip?: TaskId[]) => void;
  onPause?: () => void;
  onResume?: () => void;
  onFinish?: () => void;
}

export function SprintWidget({
  disabled,
  duration,
  timeElapsed,
  warnBeforeTimeRunsOut = 0,
  tasks,
  paused = false,
  allowToPause = false,
  ref,
  onStart,
  onCompleteTask,
  onSkipTask,
  onUnskipTask,
  onPause,
  onResume,
  onFinish,
  className,
  ...paperProps
}: SprintWidgetProps & PaperProps) {
  const durationMs = resolveDuration(duration).asMilliseconds();

  const currentTask = useMemo(() => {
    if (timeElapsed === 0 || disabled) return undefined;
    return tasks.find(({ status }) => status === "pending");
  }, [timeElapsed, tasks, disabled]);

  const outOfTasks =
    tasks.filter(({ status }) => status === "pending").length === 0;

  const isTimeUp = timeElapsed >= durationMs;
  const warningThreshold =
    warnBeforeTimeRunsOut && Math.max(durationMs - warnBeforeTimeRunsOut, 0);
  const shouldWarnAboutTime = warningThreshold
    ? timeElapsed >= warningThreshold
    : false;

  return (
    <Paper
      withBorder
      shadow="sm"
      radius="md"
      ref={ref}
      className={cn(
        "overflow-clip",
        {
          "pointer-events-none opacity-70": disabled,
        },
        className,
      )}
      {...paperProps}
    >
      <Collapse in={timeElapsed > 0 && !disabled} animateOpacity>
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
              onClick={onPause}
            >
              <IconPlayerPause size={16} />
            </ActionIcon>
          )}
        </Flex>
      </Collapse>
      <Box p="sm">
        <Paper className="overflow-clip" withBorder>
          {tasks.map(({ runId, task, status }) => (
            <Fragment key={runId}>
              <QueueTask
                group={task.parent?.title}
                label={task.title}
                readOnly={paused ?? disabled ?? !timeElapsed}
                active={currentTask?.runId === runId}
                status={status}
                onComplete={() => onCompleteTask?.(runId)}
                onSkip={() => onSkipTask?.(runId)}
                onUnskip={() => onUnskipTask?.(runId)}
                // onRunManually={() => handleJumpToTask(item.id)}
              />
              <Divider className="last:hidden" />
            </Fragment>
          ))}
        </Paper>
      </Box>

      {!disabled && (
        <>
          <Collapse in={!paused && timeElapsed === 0} animateOpacity>
            <Divider />
            <Button fullWidth className="rounded-t-none!" onClick={onStart}>
              Start Sprint
            </Button>
          </Collapse>
          <Collapse in={paused} animateOpacity>
            <Divider />
            <Button fullWidth className="rounded-t-none!" onClick={onResume}>
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
