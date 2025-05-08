import { Fragment, useEffect, useRef, useState } from "react";
import { Flex, FocusTrap, Modal, ScrollArea } from "@mantine/core";
import { useLocalStorage, useWindowEvent } from "@mantine/hooks";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { AnimatePresence, motion } from "motion/react";

import type { RunnableSprint, RunnableTask } from "@/core/deep-work";
import { WavyBackground } from "@/ui/components/WavyBackground";
import { SessionReview } from "@/ui/deep-work/focus-session/SessionReview";
import { cn } from "@/ui/utils";

import { SessionBreak } from "./SessionBreak";
import { SprintWidget } from "./SprintWidget";

dayjs.extend(duration);

export interface FocusSessionProps {
  sprints: RunnableSprint[];
  onStartSprint: (sprintId: RunnableSprint["id"]) => void;
  onEndSprint: (sprintId: RunnableSprint["id"]) => void;
  onUpdateTaskRun: (
    taskId: RunnableTask["runId"],
    status: RunnableTask["status"],
  ) => void;
  className?: string;
  onLeave: () => void;
}

export function FocusSession({
  sprints,
  onUpdateTaskRun,
  onStartSprint,
  onEndSprint,
  onLeave,
  className,
}: FocusSessionProps) {
  const [session, setSession, clearSession] = useLocalStorage<{
    currentSprintId?: RunnableSprint["id"];
    status: "unstarted" | "idle" | "running" | "paused" | "break" | "finished";
    interruption?: {
      timeElapsed: number;
    };
  }>({
    key: "active-focus-session",
    defaultValue: {
      status: "unstarted",
    },
  });

  const stopWatch = useStopWatch();

  // Resume from interruption
  useEffect(() => {
    if (!session.interruption) return;
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
  }, [session.interruption]);

  const handleExit = () =>
    setSession((prev) => {
      if (prev.status === "unstarted") return prev;
      if (prev.status === "finished") return prev;

      return { ...prev, interruption: { timeElapsed: stopWatch.timeElapsed } };
    });

  // Store timer on exit
  useWindowEvent("beforeunload", handleExit);
  useEffect(() => handleExit, []);

  useEffect(() => {
    if (sprints.length === 0) return;

    setSession((prev) => {
      if (prev.currentSprintId) return prev;
      if (prev.status === "finished") return prev;

      return {
        ...prev,
        currentSprintId: sprints[0]?.id,
        status: "idle",
      };
    });
  }, [sprints, setSession]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const breakRef = useRef<HTMLDivElement>(null);
  const activeSprintRef = useRef<HTMLDivElement>(null);

  const handleStartSprint = () => {
    if (!session.currentSprintId) return;
    onStartSprint(session.currentSprintId);
    void videoRef.current?.play();
    stopWatch.start();
    setSession((prev) => ({
      ...prev,
      status: "running",
    }));
  };

  const handlePauseSprint = () => {
    void videoRef.current?.pause();
    stopWatch.pause();
    setSession((prev) => ({
      ...prev,
      status: "paused",
    }));
  };

  const handleResumeSprint = () => {
    void videoRef.current?.play();
    stopWatch.start();
    setSession((prev) => ({
      ...prev,
      status: "running",
    }));
  };

  const handleFinishSprint = (
    nextSprintId: RunnableSprint["id"] | undefined,
  ) => {
    if (!session.currentSprintId) return;
    onEndSprint(session.currentSprintId);
    void videoRef.current?.pause();
    stopWatch.start(0);
    if (!nextSprintId)
      return setSession((prev) => ({
        ...prev,
        currentSprintId: undefined,
        status: "finished",
      }));

    setSession((prev) => ({
      ...prev,
      currentSprintId: nextSprintId,
      status: "break",
    }));

    setTimeout(() => {
      breakRef.current?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
      });
    }, 300);
  };

  const handleFinishBreak = () => {
    stopWatch.reset();
    setSession((prev) => ({
      ...prev,
      status: "idle",
    }));
    activeSprintRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
    });
  };

  const handleLeaveSession = (
    statusUpdates: Record<RunnableTask["runId"], RunnableTask["status"]>,
  ) => {
    Object.entries(statusUpdates).forEach(([runId, status]) => {
      onUpdateTaskRun(runId, status);
    });
    onLeave();
    clearSession();
  };

  return (
    <WavyBackground
      speed="slow"
      className="h-full"
      disabled={session.status === "running"}
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
              "opacity-100": session.status === "running",
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
                const isCurrentSprint = session.currentSprintId === sprint.id;

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
                      allowToPause
                      className={cn(
                        "w-xs shrink-0 snap-center snap-always transition-opacity",
                        {
                          "opacity-0":
                            !isCurrentSprint &&
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
                      paused={session.status === "paused"}
                      onStart={handleStartSprint}
                      onPause={handlePauseSprint}
                      onResume={handleResumeSprint}
                      onFinish={() => handleFinishSprint(nextSprintId)}
                      onCompleteTask={(taskId) => {
                        onUpdateTaskRun(taskId, "completed");
                        // TODO Log to PostHog
                      }}
                      onSkipTask={(taskId) => {
                        onUpdateTaskRun(taskId, "skipped");
                        // TODO Log to PostHog
                      }}
                      onUnskipTask={(taskId) => {
                        onUpdateTaskRun(taskId, "planned");
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
        opened={session.status === "finished"}
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
