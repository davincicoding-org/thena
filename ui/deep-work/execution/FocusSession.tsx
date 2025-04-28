import { useRef, useState } from "react";
import { Box, Flex } from "@mantine/core";

import {
  FocusSessionBreak,
  FocusSessionStatus,
  SprintPlan,
} from "@/core/deep-work";
import { cn } from "@/ui/utils";

import { SessionBreak } from "./SessionBreak";
import { SprintWidget } from "./SprintWidget";
import { useSprint } from "./useSprint";

export interface FocusSessionProps {
  currentSprint: SprintPlan | undefined;
  sessionBreak: FocusSessionBreak | undefined;
  status: FocusSessionStatus;
  onFinishSprint: () => void;
  onFinishBreak: () => void;
}

export function FocusSession({
  currentSprint,
  sessionBreak,
  status,
  onFinishSprint,
  onFinishBreak,
}: FocusSessionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const sprint = useSprint(currentSprint, {
    onStart: () => {
      videoRef.current?.play();
    },
    onPause: () => {
      videoRef.current?.pause();
    },
    onResume: () => {
      videoRef.current?.play();
    },
    onComplete: onFinishSprint,
  });

  const handleFinish = () => {
    videoRef.current?.pause();
    onFinishSprint();
  };

  return (
    <Flex pos="relative" className="h-full">
      <video
        ref={videoRef}
        muted
        playsInline
        loop
        className={cn(
          "absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-1000",
          {
            "opacity-100":
              sprint?.status === "running" ||
              sprint?.status === "paused" ||
              sprint?.status === "over",
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

      <Box
        className={cn(
          "absolute right-1/2 bottom-1/2 translate-x-1/2 translate-y-1/2 transition-all duration-1000",
          {
            "right-6 bottom-6 translate-0":
              sprint?.status === "running" ||
              sprint?.status === "paused" ||
              sprint?.status === "over",
          },
        )}
      >
        {status === "sprint" && sprint && (
          <SprintWidget
            className={cn("bg-neutral-700/50! backdrop-blur-sm")}
            allowToPause
            duration={sprint.duration}
            warnBeforeTimeRunsOut={10}
            tasks={sprint.tasks}
            currentTask={sprint.currentTask}
            status={sprint.status}
            timeElapsed={sprint.timeElapsed}
            onStart={sprint.start}
            onPause={sprint.pause}
            onResume={sprint.resume}
            onCompleteTask={sprint.completeTask}
            onSkipTask={sprint.skipTask}
            onRunTaskManually={sprint.runTaskManually}
            onFinish={handleFinish}
          />
        )}
        {status === "break" && sessionBreak && (
          <SessionBreak
            duration={sessionBreak.duration}
            timeElapsed={sessionBreak.timeElapsed}
            sprintsLeft={sessionBreak.sprintsLeft}
            onResume={onFinishBreak}
          />
        )}
      </Box>
    </Flex>
  );
}
