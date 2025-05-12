import { Fragment, useEffect, useRef, useState } from "react";
import { Flex, FocusTrap, Modal, ScrollArea } from "@mantine/core";
import { useWindowEvent } from "@mantine/hooks";
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
import { SessionReview } from "@/ui/deep-work/focus-session/SessionReview";
import { cn } from "@/ui/utils";

import { SessionBreak } from "./SessionBreak";
import { SprintWidget } from "./SprintWidget";

dayjs.extend(duration);

export interface FocusSessionProps {
  session: ActiveFocusSession | null;
  sprints: RunnableSprint[];
  onStartSprint: (sprintId: RunnableSprint["id"]) => void;
  onEndSprint: (sprintId: RunnableSprint["id"]) => void;
  onUpdateTaskStatus: (
    updates: Record<TaskSelect["id"], TaskSelect["status"]>,
  ) => void;
  onUpdateTaskRun: (taskRun: Pick<TaskRun, "runId" | "status">) => void;
  className?: string;
  onLeave: () => void;
  onStatusChange: (status: ActiveFocusSession["status"]) => void;
  onSprintChange: (sprintId: RunnableSprint["id"] | undefined) => void;
  onInterruption: (interruption: ActiveFocusSession["interruption"]) => void;
}

export function FocusSession({
  session,
  sprints,
  onUpdateTaskRun,
  onUpdateTaskStatus,
  onStartSprint,
  onEndSprint,
  onLeave,
  onInterruption,
  onStatusChange,
  onSprintChange,
  className,
}: FocusSessionProps) {
  const stopWatch = useStopWatch();

  // Resume from interruption
  useEffect(() => {
    if (!session?.interruption) return;
    switch (session.status) {
      case "running":
        void videoRef.current?.play();
      case "break":
        stopWatch.start(session.interruption.timeElapsed);
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
  }, [session?.interruption]);

  useEffect(() => {
    if (!session?.currentSprintId) return;
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
  }, [session?.currentSprintId]);

  const handleInterruption = () => {
    if (!session) return;
    if (session.status === "unstarted") return;
    if (session.status === "idle") return;
    if (session.status === "finished") return;
    onInterruption({
      timeElapsed:
        // FIXME: This is a hack to get the time elapsed from the interruption
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        stopWatch.timeElapsed || session.interruption?.timeElapsed || 0,
    });
  };

  // Store timer on exit
  useWindowEvent("beforeunload", () => {
    handleInterruption();
  });
  useEffect(() => {
    if (typeof window === "undefined") return;
    return () => {
      handleInterruption();
    };
  }, []);

  const videoRef = useRef<HTMLVideoElement>(null);
  const breakRef = useRef<HTMLDivElement>(null);
  const activeSprintRef = useRef<HTMLDivElement>(null);

  const handleStartSprint = () => {
    if (!session?.currentSprintId) return;
    onStartSprint(session.currentSprintId);
    void videoRef.current?.play();
    stopWatch.start();
    onStatusChange("running");
  };

  const handlePauseSprint = () => {
    void videoRef.current?.pause();
    stopWatch.pause();
    onStatusChange("paused");
  };

  const handleResumeSprint = () => {
    void videoRef.current?.play();
    stopWatch.start();
    onStatusChange("running");
  };

  const handleFinishSprint = (
    nextSprintId: RunnableSprint["id"] | undefined,
  ) => {
    if (!session?.currentSprintId) return;
    onEndSprint(session.currentSprintId);
    void videoRef.current?.pause();
    stopWatch.start(0);
    if (!nextSprintId) {
      onStatusChange("finished");
      onSprintChange(undefined);
      return;
    }

    onStatusChange("break");
    onSprintChange(nextSprintId);

    setTimeout(() => {
      breakRef.current?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
      });
    }, 300);
  };

  const handleFinishBreak = () => {
    stopWatch.reset();
    onStatusChange("idle");
    activeSprintRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
    });
  };

  const handleLeaveSession = (
    statusUpdates: Record<TaskSelect["id"], TaskSelect["status"]>,
  ) => {
    // TODO fix this
    onUpdateTaskStatus(statusUpdates);
    onLeave();
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
                const nextSprintId = sprints[index + 1]?.id;
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

                    <SprintWidget
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
                      disabled={
                        !isCurrentSprint ||
                        !["idle", "running", "paused"].includes(session.status)
                      }
                      duration={sprint.duration}
                      timeElapsed={stopWatch.timeElapsed}
                      tasks={sprint.tasks}
                      paused={session?.status === "paused"}
                      onStart={handleStartSprint}
                      onPause={handlePauseSprint}
                      onResume={handleResumeSprint}
                      onFinish={() => handleFinishSprint(nextSprintId)}
                      onCompleteTask={(runId) => {
                        onUpdateTaskRun({ runId, status: "completed" });
                        // TODO Log to PostHog
                      }}
                      onSkipTask={(runId) => {
                        onUpdateTaskRun({ runId, status: "skipped" });
                        // TODO Log to PostHog
                      }}
                      onUnskipTask={(runId) => {
                        onUpdateTaskRun({ runId, status: "pending" });

                        // TODO Log to PostHog
                      }}
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
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 100);
    }, 100);
    return () => clearInterval(interval);
  }, [isRunning]);

  const start = (timeElapsed?: number) => {
    if (timeElapsed !== undefined) setTimeElapsed(timeElapsed);
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
  };
}
