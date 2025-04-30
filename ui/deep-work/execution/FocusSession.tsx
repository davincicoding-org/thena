import { useEffect, useRef } from "react";
import { Card, Flex, ScrollArea, Text } from "@mantine/core";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { AnimatePresence, motion } from "motion/react";

import type { SprintPlan } from "@/core/deep-work";
import type { Task } from "@/core/task-management";
import { cn } from "@/ui/utils";

import { SessionBreak } from "./SessionBreak";
import { SprintWidget } from "./SprintWidget";
import { useSprintsRunner } from "./useSprintsRunner";

dayjs.extend(duration);

export interface FocusSessionProps {
  sprints: SprintPlan[];
  tasks: Task[];
  className?: string;
}

export function FocusSession({ sprints, tasks, className }: FocusSessionProps) {
  const {
    slots,
    status,
    activeSprint,
    upcomingSprints,
    startSprint,
    completeTask,
    skipTask,
    finishSprint,
    finishBreak,
  } = useSprintsRunner({
    plans: sprints,
    tasks,
    onFinish: () => {
      setTimeout(() => {
        finishedRef.current?.scrollIntoView({
          behavior: "smooth",
          inline: "center",
        });
      }, 300);
    },
  });

  const breakRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const activeSprintRef = useRef<HTMLDivElement>(null);
  const finishedRef = useRef<HTMLDivElement>(null);

  const handleStartSprint = () => {
    void videoRef.current?.play();
    startSprint();
  };

  const handlePauseSprint = () => {
    void videoRef.current?.pause();
  };

  const handleResumeSprint = () => {
    void videoRef.current?.play();
  };

  const handleFinishSprint = () => {
    void videoRef.current?.pause();
    finishSprint();
  };

  const handleFinishBreak = () => {
    finishBreak();
    setTimeout(() => {
      activeSprintRef.current?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
      });
    }, 300);
  };

  useEffect(() => {
    if (status !== "break") return;

    setTimeout(() => {
      breakRef.current?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
      });
    }, 300);
  }, [status]);

  return (
    <Flex pos="relative" className={cn("h-full", className)}>
      <video
        ref={videoRef}
        muted
        playsInline
        loop
        className={cn(
          "absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-1000",
          {
            "opacity-100": status === "sprint-run",
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
        <div className="flex gap-16 px-[50vw]">
          <AnimatePresence>
            {slots.map((slot) => {
              if (
                slot.type === "sprint-run" &&
                slot.sprint.id === activeSprint?.id
              )
                return (
                  <motion.div
                    key={slot.sprint.id}
                    layout
                    className="shrink-0 snap-center snap-always"
                    style={
                      status === "sprint-run"
                        ? {
                            position: "fixed",
                            right: 24,
                            bottom: 24,
                          }
                        : undefined
                    }
                    transition={{ duration: 1 }}
                  >
                    <SprintWidget
                      ref={activeSprintRef}
                      viewOnly={status === "break"}
                      className={cn("bg-neutral-700/50! backdrop-blur-sm")}
                      duration={slot.sprint.duration}
                      tasks={slot.sprint.tasks}
                      onStart={handleStartSprint}
                      onPause={handlePauseSprint}
                      onResume={handleResumeSprint}
                      onCompleteTask={completeTask}
                      onSkipTask={skipTask}
                      onFinish={handleFinishSprint}
                    />
                  </motion.div>
                );

              if (status === "sprint-run") return null;

              if (slot.type === "sprint-run")
                return (
                  <motion.div
                    key={slot.sprint.id}
                    // exit={{ opacity: 0 }}
                    // transition={{ duration: 1 }}
                  >
                    <SprintWidget
                      className={cn(
                        "shrink-0 snap-center snap-always bg-neutral-700/50! backdrop-blur-sm",
                      )}
                      viewOnly
                      duration={slot.sprint.duration}
                      tasks={slot.sprint.tasks}
                    />
                  </motion.div>
                );

              if (
                slot.type === "break" &&
                status === "break" &&
                slot.nextSprint === activeSprint?.id
              )
                return (
                  <motion.div
                    key={`break-before-${slot.nextSprint}`}
                    // exit={{ opacity: 0, scale: 0 }}
                  >
                    <SessionBreak
                      ref={breakRef}
                      className="snap-center snap-always self-start"
                      duration={slot.duration}
                      running
                      sprintsLeft={upcomingSprints.length}
                      onResume={handleFinishBreak}
                    />
                  </motion.div>
                );

              return null;
            })}
            {status === "finished" && (
              <Card
                className="shrink-0 snap-center snap-always self-start"
                withBorder
                radius="md"
                component={motion.div}
                ref={finishedRef}
              >
                <Text size="xl" ta="center" c="green">
                  Well Done
                </Text>
                <Text ta="center">Your session is completed.</Text>
              </Card>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </Flex>
  );
}
