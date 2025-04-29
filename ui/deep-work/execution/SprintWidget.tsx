import type { PaperProps } from "@mantine/core";
import { Fragment } from "react";
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

import type { RuntITem$$$ } from "@/core/deep-work";
import type { TaskReference } from "@/core/task-management";
import { cn } from "@/ui/utils";

import { QueueTask } from "./QueueTask";

export interface SprintWidgetProps {
  duration: number;
  timeElapsed: number;
  warnBeforeTimeRunsOut: number;
  paused?: boolean;
  tasks: RuntITem$$$[];
  currentTask?: TaskReference;
  allowToPause?: boolean;
  onStart: () => void;
  onCompleteTask: (task: TaskReference) => void;
  onSkipTask: (task: TaskReference) => void;
  onRunTaskManually: (task: TaskReference) => void;
  onPause: () => void;
  onResume: () => void;
  onFinish: () => void;
}
export function SprintWidget({
  duration,
  timeElapsed,
  warnBeforeTimeRunsOut,
  tasks,
  paused = false,
  currentTask,
  allowToPause = false,
  onStart,
  onCompleteTask,
  onSkipTask,
  onRunTaskManually,
  onPause,
  onResume,
  onFinish,
  className,
  ...paperProps
}: SprintWidgetProps & PaperProps) {
  // IDEA Bring some of the logic from use Sprint to here
  const isTimeUp = timeElapsed >= duration;
  const hasStarted = timeElapsed > 0;
  const warningThreshold =
    warnBeforeTimeRunsOut && Math.max(duration - warnBeforeTimeRunsOut, 0);
  const shouldWarnAboutTime = warningThreshold
    ? timeElapsed >= warningThreshold
    : false;

  return (
    <Paper
      withBorder
      shadow="sm"
      radius="md"
      className={cn("overflow-clip", className)}
      {...paperProps}
    >
      <Collapse in={hasStarted} animateOpacity>
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
            value={(timeElapsed / duration) * 100}
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
          {tasks.map((item) => (
            <Fragment key={`${item.taskId}-${item.subtaskId}`}>
              <QueueTask
                group={item.group ?? undefined}
                label={item.label}
                readOnly={!hasStarted}
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
                  onCompleteTask({
                    taskId: item.taskId,
                    subtaskId: item.subtaskId,
                  })
                }
                onSkip={() =>
                  onSkipTask({ taskId: item.taskId, subtaskId: item.subtaskId })
                }
                onRunManually={() =>
                  onRunTaskManually({
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

      <Collapse in={timeElapsed === 0} animateOpacity>
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
      <Collapse in={isTimeUp} animateOpacity>
        <Divider />
        <Button fullWidth className="rounded-t-none!" onClick={onFinish}>
          Finish Sprint
        </Button>
      </Collapse>
    </Paper>
  );
}
