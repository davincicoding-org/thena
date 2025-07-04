import { Fragment } from "react";
import {
  Button,
  Divider,
  Paper,
  Progress,
  ScrollArea,
  Tooltip,
} from "@mantine/core";

import type { TaskId } from "@/core/task-management";
import { cn } from "@/ui/utils";

import type { TaskQueueItem } from "./types";
import { QueueTask } from "./QueueTask";

export function ActiveSessionPanel({
  queue,
  activeTaskId,
  timeElapsed,
  duration,
  warningThreshold = 0.9,
  className,
  onCompleteTask,
  onSkipTask,
  onUnskipTask,
  onFinishSession,
}: {
  queue: TaskQueueItem[];
  activeTaskId: TaskId | undefined;
  timeElapsed: number;
  duration: number;
  warningThreshold?: number;
  className?: string;
  onCompleteTask: (taskId: TaskId) => void;
  onSkipTask: (taskId: TaskId) => void;
  onUnskipTask: (taskId: TaskId) => void;
  onFinishSession: () => void;
}) {
  const timeProgress = duration ? (timeElapsed / duration) * 100 : 0;

  const isTimeOutSoon = timeProgress > warningThreshold * 100;
  const isTimeOut = timeProgress > 100;

  const minutesRemaining = Math.floor((duration - timeElapsed) / 60);

  return (
    <Paper
      withBorder
      radius="md"
      className={cn(
        "max-w-xs overflow-clip !bg-black/80 backdrop-blur-sm",
        className,
      )}
    >
      <div className="flex p-3">
        <Tooltip label={`${minutesRemaining} minutes left`}>
          <Progress
            flex={1}
            value={timeProgress}
            color={(() => {
              if (isTimeOut) return "red";
              if (isTimeOutSoon) return "yellow";
              return "primary";
            })()}
            className={cn("transition-all", {
              "animate-pulse duration-200": isTimeOutSoon || isTimeOut,
            })}
            style={{
              animationDuration: isTimeOut ? "1000ms" : undefined,
            }}
          />
        </Tooltip>
      </div>
      <Divider />
      <ScrollArea
        scrollbars="y"
        classNames={{
          root: "h-64",
        }}
      >
        {queue.map(
          (task, index) =>
            task.status !== "deleted" && (
              <Fragment key={task.id}>
                {index !== 0 && <Divider />}
                <QueueTask
                  group={task.parent?.title}
                  label={task.title}
                  status={task.skipped ? "skipped" : task.status}
                  active={task.id === activeTaskId}
                  onComplete={() => onCompleteTask(task.id)}
                  onSkip={() => onSkipTask(task.id)}
                  onUnskip={() => onUnskipTask(task.id)}
                  onActivate={(el) => {
                    if (!el) return;
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                />
              </Fragment>
            ),
        )}
      </ScrollArea>
      <Divider />
      <Button
        fullWidth
        radius={0}
        variant={isTimeOut ? "filled" : "light"}
        onClick={onFinishSession}
      >
        Finish Session
      </Button>
    </Paper>
  );
}
