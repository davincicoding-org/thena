import { Fragment, useRef, useState } from "react";
import {
  Button,
  Card,
  Divider,
  Flex,
  ScrollArea,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

import type {
  // ActiveFocusSession,
  RunnableSprint,
  TaskRun,
} from "@/core/deep-work";
import type { FlatTask, TaskSelect } from "@/core/task-management";
import { WavyBackground } from "@/ui/components/WavyBackground";
import { cn } from "@/ui/utils";

import { QueueTask } from "./QueueTask";
import { useStopWatch } from "./useStopWatch";

dayjs.extend(duration);

export interface FocusSessionProps {
  todos: FlatTask[];
  completedSessions?: [];
  onStartSession: (params: { duration: number }) => void;
  // session: Omit<ActiveFocusSession, "id"> | null;
  // sprints: RunnableSprint[];

  onStartSprint?: (sprintId: RunnableSprint["id"]) => void;
  onFinishSprint?: (sprintId: RunnableSprint["id"]) => void;
  onFinishBreak?: () => void;

  onCompleteTask?: (args: {
    sprintId: RunnableSprint["id"];
    runId: TaskRun["runId"];
    taskId: TaskSelect["id"];
  }) => void;
  // onSkipTask: (args: {
  //   sprintId: RunnableSprint["id"];
  //   runId: TaskRun["runId"];
  // }) => void;
  // onUnskipTask: (args: {
  //   sprintId: RunnableSprint["id"];
  //   runId: TaskRun["runId"];
  // }) => void;

  onFinishSession: () // taskStatusUpdates: Record<TaskSelect["id"], TaskSelect["status"]>,
  => void;
  className?: string;
}

export function FocusSession({
  todos,
  onStartSession,
  onStartSprint,
  onFinishSprint,
  onFinishBreak,
  onCompleteTask,
  onFinishSession,
  className,
}: FocusSessionProps) {
  const activeSession = useActiveSession();

  // useEffect(() => {
  //   switch (session?.status) {
  //     case "idle":
  //       stopWatch.reset();
  //       break;
  //     case "running":
  //       void videoRef.current?.play();
  //       stopWatch.start();
  //       break;
  //     case "break":
  //       stopWatch.start();
  //       break;
  //     case "paused":
  //       void videoRef.current?.pause();
  //       stopWatch.pause();
  //       break;
  //     case "finished":
  //       void videoRef.current?.pause();
  //       break;
  //   }
  //   setTimeout(() => {
  //     if (breakRef.current)
  //       return breakRef.current.scrollIntoView({
  //         behavior: "smooth",
  //         inline: "center",
  //       });

  //     if (activeSprintRef.current)
  //       return activeSprintRef.current.scrollIntoView({
  //         behavior: "smooth",
  //         inline: "center",
  //       });
  //   }, 300);
  // }, [session?.status]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const breakRef = useRef<HTMLDivElement>(null);
  const activeSprintRef = useRef<HTMLDivElement>(null);

  const handleStartSession = (params: { duration: number }) => {
    activeSession.controls.start(params.duration);
    void videoRef.current?.play();
  };

  const handlePauseSession = () => {
    activeSession.controls.pause();
    void videoRef.current?.pause();
  };

  const handleResumeSession = () => {
    activeSession.controls.resume();
    void videoRef.current?.play();
  };

  // const handleFinishSprint = (sprintId: RunnableSprint["id"]) => {
  //   onFinishSprint(sprintId);
  //   stopwatch.reset();
  // };

  // const handleFinishBreak = () => {
  //   stopwatch.reset();
  //   onFinishBreak();
  // };

  // const handleLeaveSession = (
  //   statusUpdates: Record<TaskSelect["id"], TaskSelect["status"]>,
  // ) => {
  //   alert("TODO");
  //   // onFinishSession(statusUpdates);
  // };

  return (
    <WavyBackground
      speed="slow"
      className="h-full"
      disabled={activeSession.status === "running"}
    >
      <Flex className={cn("h-full", className)}>
        <video
          ref={videoRef}
          muted
          playsInline
          loop
          className={cn(
            "absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-1000",
            {
              "opacity-100": activeSession.status === "running",
            },
          )}
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

        <ScrollArea
          classNames={{
            root: cn("relative my-auto w-screen transition-all"),
            viewport: cn("snap-x snap-mandatory"),
          }}
          scrollbars="x"
          type="never"
        >
          <div className="flex items-start gap-12">
            <div className={cn("h-px w-[50vw] shrink-0")} />
            {/* <AnimatePresence> */}

            <SessionInitiator
              className={cn(
                "shrink-0 snap-center snap-always transition-opacity",
                {
                  "pointer-events-none opacity-0":
                    activeSession.status !== "idle",
                },
              )}
              onSubmit={handleStartSession}
            />

            <Card
              radius="md"
              p={0}
              className={cn("shrink-0 transition-all", {
                "ml-auto": activeSession.status === "running",
              })}
            >
              {/* TODO add Session Controls */}
              <ScrollArea>
                {todos.map((todo, index) => (
                  <Fragment key={todo.id}>
                    {index > 0 && <Divider />}
                    <QueueTask
                      readOnly
                      group={todo.parent?.title}
                      label={todo.title}
                      active
                      onComplete={() => {
                        alert("TODO");
                      }}
                      onSkip={() => {
                        alert("TODO");
                      }}
                      onUnskip={() => {
                        alert("TODO");
                      }}
                    />
                  </Fragment>
                ))}
              </ScrollArea>
            </Card>
            {/* {sprints.map((sprint, index) => {
                const isCurrentSprint = session?.currentSprintId === sprint.id;

                return (
                  <Fragment key={sprint.id}>
                    {index > 0 &&
                      isCurrentSprint &&
                      session.status === "break" && (
                        <motion.div
                          key="break"
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <SessionBreak
                            className={cn("w-sm snap-center snap-always")}
                            ref={breakRef}
                            duration={sprint.recoveryTime ?? { minutes: 10 }}
                            sprintsLeft={sprints.length - index}
                            timeElapsed={stopWatch.timeElapsed}
                            onResume={handleFinishBreak}
                          />
                        </motion.div>
                      )}

                    <SprintQueue
                      className={cn(
                        "w-xs shrink-0 snap-center snap-always transition-opacity",
                        {
                          "opacity-0":
                            !isCurrentSprint &&
                            session &&
                            !["idle", "break", "finished"].includes(
                              session.status,
                            ),
                        },
                      )}
                      ref={isCurrentSprint ? activeSprintRef : undefined}
                      readOnly={
                        !isCurrentSprint ||
                        !["idle", "running", "paused"].includes(session.status)
                      }
                      duration={sprint.duration}
                      timeElapsed={stopWatch.timeElapsed}
                      currentTaskRunId={session?.currentTaskRunId}
                      tasks={sprint.tasks}
                      paused={session?.status === "paused"}
                      onStart={() => handleStartSprint(sprint.id)}
                      onPause={handlePauseSprint}
                      onResume={handleResumeSprint}
                      onFinish={() => handleFinishSprint(sprint.id)}
                      onCompleteTask={({ runId, taskId }) =>
                        onCompleteTask({ sprintId: sprint.id, runId, taskId })
                      }
                      onSkipTask={({ runId }) =>
                        onSkipTask({ sprintId: sprint.id, runId })
                      }
                      onUnskipTask={({ runId }) =>
                        onUnskipTask({ sprintId: sprint.id, runId })
                      }
                    />
                  </Fragment>
                );
              })} */}
            {/* </AnimatePresence> */}
            <div
              className={cn("h-px w-[50vw] shrink-0 transition-all", {
                "w-0": activeSession.status === "running",
              })}
            />
          </div>
        </ScrollArea>
      </Flex>
      {/* <Modal
        centered
        opened={false}
        // opened={session?.status === "finished"}
        withCloseButton={false}
        closeOnEscape={false}
        closeOnClickOutside={false}
        radius="md"
        size="auto"
        onClose={() => void 0}
        transitionProps={{
          transition: "pop",
          duration: 500,
          enterDelay: 1000,
        }}
      >
        <SessionReview sprints={sprints} onLeave={handleLeaveSession} />
      </Modal> */}
    </WavyBackground>
  );
}

interface SessionInitiatorProps {
  className?: string;
  onSubmit: (params: { duration: number }) => void;
}

function SessionInitiator({ className, onSubmit }: SessionInitiatorProps) {
  const durationOptions = [15, 25, 45];
  const [duration, setDuration] = useState(25);

  return (
    <Card radius="md" p={0} className={cn(className)}>
      <Stack p="md" mb="xs">
        <Text size="xl" ta="center">
          Next Session
        </Text>
        <Select
          size="md"
          value={duration.toString()}
          data={durationOptions.map((minutes) => ({
            label: `${minutes} minutes`,
            value: minutes.toString(),
          }))}
          onChange={(value) => setDuration(Number(value))}
        />
      </Stack>

      <Button size="lg" radius={0} onClick={() => onSubmit({ duration })}>
        Start
      </Button>
    </Card>
  );
}

function useActiveSession() {
  const [status, setStatus] = useState<
    "idle" | "running" | "paused" | "finished"
  >("idle");
  const stopwatch = useStopWatch();

  const start = (duration: number) => {
    stopwatch.start(duration);
    setStatus("running");
  };

  const pause = () => {
    stopwatch.pause();
    setStatus("paused");
  };

  const resume = () => {
    stopwatch.resume();
    setStatus("running");
  };

  const finish = () => {
    stopwatch.reset();
    setStatus("finished");
  };

  return {
    status,
    duration: stopwatch.totalTime,
    timeElapsed: stopwatch.timeElapsed,
    controls: {
      start,
      pause,
      resume,
      finish,
    },
  };
}
