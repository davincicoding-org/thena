import type { UseMutateFunction } from "@tanstack/react-query";
import type { SetRequired } from "type-fest";
import { Fragment, useEffect, useRef } from "react";
import {
  Divider,
  Paper,
  ScrollArea,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";

import type {
  ProjectInput,
  ProjectSelect,
  TaskFormValues,
  TaskId,
  TaskSelect,
  TaskTree,
  TaskUpdate,
} from "@/core/task-management";
import { WavyBackground } from "@/ui/components/WavyBackground";
import { QueueTask } from "@/ui/focus-session/QueueTask";
import { TaskListEditor } from "@/ui/task-management";
import { cn } from "@/ui/utils";

import type {
  ActiveFocusSession,
  FocusSessionConfig,
  FocusSessionStatus,
  FocusSessionSummary,
} from "./types";
import { ActiveSessionPanel } from "./ActiveSessionPanel";
import { ControlPanel } from "./ControlPanel";

export interface FocusSessionProps {
  loading?: boolean;
  status: FocusSessionStatus;
  onStartSession: (config: FocusSessionConfig) => void;
  onFinishSession: () => void;
  onStartBreak: (duration: number) => void;
  onSkipBreak: () => void;
  onFinishBreak: (timeElapsed: number | null) => void;
  onFinish: () => void;

  completedSessions: FocusSessionSummary[];

  activeSession: ActiveFocusSession | null;

  onCompleteTask: (taskId: TaskId) => void;
  onSkipTask: (taskId: TaskId) => void;
  onUnskipTask: (taskId: TaskId) => void;

  // TODOS
  todos: TaskTree[];
  onUpdateTask: (task: SetRequired<TaskUpdate, "id" | "parentId">) => void;
  onDeleteTasks: (tasks: TaskSelect[]) => void;
  onCreateTasks: (tasks: TaskFormValues[]) => void;
  projects: ProjectSelect[];
  onCreateProject: UseMutateFunction<
    ProjectSelect | undefined,
    Error,
    ProjectInput
  >;

  className?: string;
}

export function FocusSession({
  loading,
  status,
  onStartSession,
  onFinishSession,
  onStartBreak,
  onSkipBreak,
  onFinishBreak,
  onFinish,
  completedSessions,
  activeSession,
  onCompleteTask,
  onSkipTask,
  onUnskipTask,
  todos,
  onUpdateTask,
  onDeleteTasks,
  onCreateTasks,
  projects,
  onCreateProject,
  className,
}: FocusSessionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    switch (status) {
      case "session":
        if (!videoRef.current) return;
        void videoRef.current.play();
        break;
      case "idle":
        // TODO scroll upcoming tasks to top
        setTimeout(() => {
          if (!videoRef.current) return;
          void videoRef.current?.pause();
          videoRef.current.currentTime = 0;
        }, 1000);
        break;
    }
  }, [status]);

  return (
    <WavyBackground
      speed="slow"
      className="h-full w-full"
      disabled={status === "session"}
    >
      <div
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-1000",
          {
            "opacity-100": status === "session",
          },
        )}
      >
        <video
          ref={videoRef}
          muted
          playsInline
          loop
          className={cn("absolute inset-0 h-full w-full object-cover")}
        >
          <source
            src={`${process.env.NEXT_PUBLIC_VIDEO_BASE_URL}/library.webm`}
            type="video/webm"
          />
          <source
            src={`${process.env.NEXT_PUBLIC_VIDEO_BASE_URL}/library.webm`}
            type="video/mp4"
          />
        </video>
        {activeSession && (
          <ActiveSessionPanel
            className="absolute right-4 bottom-4"
            queue={activeSession.queue}
            activeTaskId={activeSession.currentTaskId}
            timeElapsed={activeSession.timeElapsed}
            duration={activeSession.duration}
            onFinishSession={onFinishSession}
            onSkipTask={onSkipTask}
            onUnskipTask={onUnskipTask}
            onCompleteTask={onCompleteTask}
          />
        )}
      </div>

      <div
        className={cn(
          "grid h-full grid-cols-[1fr_auto_1fr] gap-12 transition-opacity duration-1000",
          {
            "pointer-events-none opacity-0": status === "session",
            "opacity-0": loading,
          },
          className,
        )}
      >
        <ScrollArea
          classNames={{
            root: cn("mx-auto transition-opacity", {
              "opacity-30": completedSessions.length === 0,
              "pointer-events-none opacity-20": status === "break",
            }),
            viewport: "pt-[50vh] pb-20 px-4",
            scrollbar: "mt-[50vh] mb-20",
          }}
          scrollbars="y"
        >
          <p className="my-0 -mt-20 flex h-20 items-center text-4xl font-light">
            Completed Sessions
          </p>
          <Stack className="!flex-col-reverse" gap="lg">
            {completedSessions.map((session) => (
              <Paper
                key={session.id}
                radius="md"
                className="!flex flex-col-reverse overflow-clip"
              >
                {session.tasks.length > 0 ? (
                  session.tasks.map((task, index) => (
                    <Fragment key={task.id}>
                      {index !== 0 && <Divider />}
                      <QueueTask
                        key={task.id}
                        label={task.title}
                        group={task.parent?.title}
                        status="todo"
                        active
                        readOnly
                        leftSection={
                          <ThemeIcon color="green" variant="transparent">
                            <IconCircleCheck size={32} />
                          </ThemeIcon>
                        }
                      />
                    </Fragment>
                  ))
                ) : (
                  <Text p="sm" ta="center">
                    No Tasks completed
                  </Text>
                )}
              </Paper>
            ))}
          </Stack>
        </ScrollArea>

        <ControlPanel
          className={cn("my-auto")}
          status={status}
          onStartSession={onStartSession}
          onStartBreak={onStartBreak}
          onSkipBreak={onSkipBreak}
          onContinue={onFinishBreak}
          onFinish={onFinish}
        />

        <ScrollArea
          classNames={{
            root: cn("mx-auto transition-opacity", {
              "pointer-events-none opacity-20": status === "break",
            }),
            viewport: "pt-[50vh] pb-20 px-4",
            scrollbar: "mt-[50vh] mb-20",
          }}
          scrollbars="y"
        >
          <p className="my-0 -mt-20 flex h-20 items-center text-4xl font-light">
            Upcoming Tasks
          </p>
          <TaskListEditor
            tasks={todos}
            onUpdateTask={onUpdateTask}
            onDeleteTasks={onDeleteTasks}
            onCreateTasks={onCreateTasks}
            projects={projects}
            onCreateProject={onCreateProject}
          />
        </ScrollArea>
      </div>
    </WavyBackground>
  );
}
