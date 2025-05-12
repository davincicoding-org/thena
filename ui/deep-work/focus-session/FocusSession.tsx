import { Fragment, useEffect, useRef, useState } from "react";
import { Flex, FocusTrap, Modal, ScrollArea } from "@mantine/core";
import { readLocalStorageValue, useWindowEvent } from "@mantine/hooks";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { AnimatePresence, motion } from "motion/react";

import type {
  ActiveFocusSession,
  RunnableSprint,
  TaskRun,
} from "@/core/deep-work";
import type { TaskSelect } from "@/core/task-management";
import { WavyBackground } from "@/ui/components/WavyBackground";
import { cn } from "@/ui/utils";

import { SessionBreak } from "./SessionBreak";
import { SessionReview } from "./SessionReview";
import { SprintQueue } from "./SprintQueue";

dayjs.extend(duration);

export interface FocusSessionProps {
  session: Omit<ActiveFocusSession, "id"> | null;
  sprints: RunnableSprint[];

  onStartSprint: (sprintId: RunnableSprint["id"]) => void;
  onFinishSprint: (sprintId: RunnableSprint["id"]) => void;
  onFinishBreak: () => void;

  onCompleteTask: (args: {
    sprintId: RunnableSprint["id"];
    runId: TaskRun["runId"];
    taskId: TaskSelect["id"];
  }) => void;
  onSkipTask: (args: {
    sprintId: RunnableSprint["id"];
    runId: TaskRun["runId"];
  }) => void;
  onUnskipTask: (args: {
    sprintId: RunnableSprint["id"];
    runId: TaskRun["runId"];
  }) => void;

  onFinishSession: (
    taskStatusUpdates: Record<TaskSelect["id"], TaskSelect["status"]>,
  ) => void;
  className?: string;
}

export function FocusSession({
  session,
  sprints,
  onStartSprint,
  onFinishSprint,
  onFinishBreak,
  onCompleteTask,
  onSkipTask,
  onUnskipTask,
  onFinishSession,
  className,
}: FocusSessionProps) {
  const stopWatch = useStopWatch();

  useEffect(() => {
    switch (session?.status) {
      case "idle":
        stopWatch.reset();
        break;
      case "running":
        void videoRef.current?.play();
        stopWatch.start();
        break;
      case "break":
        stopWatch.start();
        break;
      case "paused":
        void videoRef.current?.pause();
        stopWatch.pause();
        break;
      case "finished":
        void videoRef.current?.pause();
        break;
    }
    setTimeout(() => {
      if (breakRef.current)
        return breakRef.current.scrollIntoView({
          behavior: "smooth",
          inline: "center",
        });

      if (activeSprintRef.current)
        return activeSprintRef.current.scrollIntoView({
          behavior: "smooth",
          inline: "center",
        });
    }, 300);
  }, [session?.status]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const breakRef = useRef<HTMLDivElement>(null);
  const activeSprintRef = useRef<HTMLDivElement>(null);

  const handleStartSprint = (sprintId: RunnableSprint["id"]) => {
    stopWatch.reset();
    onStartSprint(sprintId);
  };

  const handlePauseSprint = () => {
    // NOT IMPLEMENTED
  };

  const handleResumeSprint = () => {
    // NOT IMPLEMENTED
  };

  const handleFinishSprint = (sprintId: RunnableSprint["id"]) => {
    onFinishSprint(sprintId);
    stopWatch.reset();
  };

  const handleFinishBreak = () => {
    stopWatch.reset();
    onFinishBreak();
  };

  const handleLeaveSession = (
    statusUpdates: Record<TaskSelect["id"], TaskSelect["status"]>,
  ) => {
    onFinishSession(statusUpdates);
  };

  return (
    <WavyBackground
      speed="slow"
      className="h-full"
      disabled={session?.status === "running"}
    >
      <FocusTrap.InitialFocus />
      <Flex className={cn("h-full", className)}>
        <video
          ref={videoRef}
          muted
          playsInline
          loop
          className={cn(
            "absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-1000",
            {
              "opacity-100": session?.status === "running",
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
            root: cn("relative my-auto w-screen"),
            viewport: cn("snap-x snap-mandatory"),
          }}
          scrollbars="x"
          type="never"
        >
          <div className="flex items-start gap-12">
            <div className="h-px w-[50vw] shrink-0" />
            <AnimatePresence>
              {sprints.map((sprint, index) => {
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
              })}
            </AnimatePresence>
            <div className="h-px w-[50vw] shrink-0" />
          </div>
        </ScrollArea>
      </Flex>
      <Modal
        centered
        opened={session?.status === "finished"}
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
      </Modal>
    </WavyBackground>
  );
}

function useStopWatch() {
  const STORAGE_KEY = "focus-session-time-elapsed";
  const handleInterruption = () => {
    if (!isRunning) return;
    localStorage.setItem(STORAGE_KEY, timeElapsed.toString());
  };
  useWindowEvent("beforeunload", () => {
    handleInterruption();
  });
  useEffect(() => {
    if (typeof window === "undefined") return;
    return () => {
      handleInterruption();
    };
  }, []);

  const [timeElapsed, setTimeElapsed] = useState<number>(() => {
    const restoredTimeElapsed = readLocalStorageValue<number>({
      key: STORAGE_KEY,
      defaultValue: 0,
    });
    localStorage.removeItem(STORAGE_KEY);
    return restoredTimeElapsed;
  });
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 100);
    }, 100);
    return () => clearInterval(interval);
  }, [isRunning]);

  const start = () => {
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const reset = () => {
    setTimeElapsed(0);
    setIsRunning(false);
  };

  return {
    timeElapsed,
    start,
    pause,
    reset,
    setTimeElapsed,
  };
}
