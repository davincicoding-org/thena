import { Fragment, ReactElement } from "react";
import {
  ActionIcon,
  Button,
  Collapse,
  Divider,
  Flex,
  NavLink,
  NavLinkProps,
  Paper,
  PaperProps,
  Progress,
  Tooltip,
} from "@mantine/core";
import {
  IconArrowDownDashed,
  IconCheck,
  IconPlayerPause,
} from "@tabler/icons-react";

import type { SprintStatus, TaskReference, TaskRun } from "@/core/deep-work";
import { hasSubtasks } from "@/core/task-management";
import { BoundOverlay } from "@/ui/components/BoundOverlay";
import { cn } from "@/ui/utils";

export interface LiveSprintProps {
  duration: number;
  timeElapsed: number;
  warnBeforeTimeRunsOut: number;
  status: SprintStatus;
  tasks: TaskRun[];
  currentTask?: TaskReference;
  allowToPause?: boolean;
  onStart: () => void;
  onCompleteTask: (task: TaskReference) => void;
  onSkipTask: (task: TaskReference) => void;
  onRunTaskManually: (task: TaskReference) => void;
  onPause: () => void;
  onResume: () => void;
}
export function LiveSprint({
  duration,
  timeElapsed,
  warnBeforeTimeRunsOut,
  tasks,
  currentTask,
  status,
  allowToPause = false,
  onStart: onStartSession,
  onCompleteTask,
  onSkipTask,
  onRunTaskManually,
  onPause,
  onResume,
  ...paperProps
}: LiveSprintProps & PaperProps) {
  const isTimeUp = timeElapsed >= duration;
  const warningThreshold =
    warnBeforeTimeRunsOut && Math.max(duration - warnBeforeTimeRunsOut, 0);
  const shouldWarnAboutTime = warningThreshold
    ? timeElapsed >= warningThreshold
    : false;

  return (
    <Paper
      p="sm"
      shadow="sm"
      radius="md"
      {...paperProps}
    >
      <Collapse in={status === "running"} pb="md" animateOpacity>
        <Flex gap={4} align="center">
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
          {allowToPause && (
            <ActionIcon
              size="xs"
              variant="subtle"
              color="gray"
              onClick={onPause}
            >
              <IconPlayerPause size={16} />
            </ActionIcon>
          )}
        </Flex>
      </Collapse>
      <Paper className="overflow-clip" withBorder>
        {tasks.map((task) => (
          <Fragment key={task.id}>
            <TaskItem
              task={task}
              readOnly={status !== "running"}
              activeTask={currentTask}
              onComplete={onCompleteTask}
              onSkip={onSkipTask}
              onRunManually={onRunTaskManually}
            />
            <Divider className="last:hidden" />
          </Fragment>
        ))}
      </Paper>
      <Collapse in={status === "idle"} pt="md" animateOpacity>
        <Button fullWidth onClick={onStartSession}>
          Start Session
        </Button>
      </Collapse>
      <Collapse in={status === "paused"} pt="md" animateOpacity>
        <Button fullWidth onClick={onResume}>
          Resume Session
        </Button>
      </Collapse>
    </Paper>
  );
}

interface TaskItemProps {
  task: TaskRun;
  readOnly?: boolean;
  activeTask: TaskReference | undefined;
  onComplete: (task: TaskReference) => void;
  onSkip: (task: TaskReference) => void;
  onRunManually: (task: TaskReference) => void;
}

function TaskItem({
  task,
  activeTask,
  readOnly,
  onComplete,
  onSkip,
  onRunManually,
}: TaskItemProps) {
  if (hasSubtasks(task)) {
    return (
      <>
        {task.subtasks.map((subtask) => (
          <Fragment key={subtask.id}>
            <TaskControlItem
              key={subtask.id}
              label={subtask.title}
              group={task.title}
              readOnly={readOnly}
              status={
                subtask.completedAt
                  ? "completed"
                  : subtask.skipped
                    ? "skipped"
                    : activeTask?.taskId === task.id &&
                        activeTask?.subtaskId === subtask.id
                      ? "active"
                      : "upcoming"
              }
              onComplete={() =>
                onComplete({ taskId: task.id, subtaskId: subtask.id })
              }
              onSkip={() => onSkip({ taskId: task.id, subtaskId: subtask.id })}
              onRunManually={() =>
                onRunManually({ taskId: task.id, subtaskId: subtask.id })
              }
            />
            <Divider className="last:hidden" />
          </Fragment>
        ))}
      </>
    );
  }
  return (
    <TaskControlItem
      label={task.title}
      status={
        task.completedAt
          ? "completed"
          : task.skipped
            ? "skipped"
            : activeTask?.taskId === task.id
              ? "active"
              : "upcoming"
      }
      readOnly={readOnly}
      onComplete={() => onComplete({ taskId: task.id })}
      onSkip={() => onSkip({ taskId: task.id })}
      onRunManually={() => onRunManually({ taskId: task.id })}
    />
  );
}

type TaskStatus = "completed" | "skipped" | "active" | "upcoming";

interface TaskControlProps {
  label: string;
  group?: string;
  status: TaskStatus;
  readOnly?: boolean;
  onComplete: () => void;
  onSkip: () => void;
  onRunManually: () => void;
}
function TaskControlItem({
  label,
  group,
  status,
  readOnly,
  onComplete,
  onSkip,
  onRunManually,
}: TaskControlProps) {
  const color = ((): NavLinkProps["color"] => {
    switch (status) {
      case "completed":
        return "green";
      case "skipped":
        return "yellow";
      case "active":
        return undefined;
      default:
        return "gray";
    }
  })();

  const actions = ((): ReactElement[] => {
    switch (status) {
      case "skipped":
        return [
          <Button
            key="resume"
            size="compact-xs"
            variant="outline"
            color="gray"
            fullWidth
            onClick={onRunManually}
          >
            Resume Task
          </Button>,
        ];
      case "active":
        return [
          <Button
            key="complete"
            color="green"
            size="compact-sm"
            variant="outline"
            flex={1}
            leftSection={<IconCheck size={16} />}
            onClick={onComplete}
          >
            Complete
          </Button>,
          <Tooltip label="Skip Task" key="skip">
            <ActionIcon
              variant="subtle"
              size="md"
              color="yellow"
              onClick={onSkip}
            >
              <IconArrowDownDashed size={16} />
            </ActionIcon>
          </Tooltip>,
        ];
      case "upcoming":
        return [
          <Button
            key="jump-to"
            size="compact-xs"
            variant="outline"
            color="gray"
            fullWidth
            onClick={onRunManually}
          >
            Jump to Task
          </Button>,
        ];
      default:
        return [];
    }
  })();

  return (
    <BoundOverlay
      isTrigger
      disabled={readOnly || actions.length === 0}
      content={
        <Flex
          className="h-full"
          justify="flex-end"
          align="center"
          px="xs"
          gap={4}
        >
          {actions}
        </Flex>
      }
      overlayProps={{ blur: 2 }}
    >
      <NavLink
        label={label}
        description={group}
        component="div"
        py={status === "active" ? undefined : 4}
        disabled={readOnly || actions.length === 0 || status === "upcoming"}
        active={status !== "active"}
        color={color}
        classNames={{
          root: "min-w-48 transition-all",
          label: cn({
            "line-through": status === "completed",
            "opacity-30": status === "skipped",
          }),
          body: "flex flex-col-reverse",
        }}
        rightSection={null}
      />
    </BoundOverlay>
  );
}
