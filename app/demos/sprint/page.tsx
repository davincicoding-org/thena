"use client";

import { useRef } from "react";
import { AppShell, Box } from "@mantine/core";

import { LiveSprint, useSprint } from "@/ui/deep-work";
import { cn } from "@/ui/utils";

export default function SessionPage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const sprint = useSprint(
    {
      id: "sprint-1",
      duration: 5 * 60,
      tasks: [
        { id: "kitchen", title: "Clean the kitchen" },
        {
          id: "app",
          title: "Build an app",
          subtasks: [
            { id: "requirements", title: "Gather requirements" },
            { id: "design", title: "Design the UI" },
            { id: "logic", title: "Implement the logic" },
            { id: "test", title: "Test the app" },
          ],
        },
        { id: "dog", title: "Walk the dog" },
      ],
    },
    {
      onStart: () => {
        videoRef.current?.play();
      },
      onPause: () => {
        videoRef.current?.pause();
      },
      onResume: () => {
        videoRef.current?.play();
      },
    },
  );

  return (
    <AppShell.Main display="grid">
      <Box pos="relative">
        <video
          ref={videoRef}
          muted
          playsInline
          loop
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000",
            {
              "opacity-0": sprint.status === "idle",
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

        <LiveSprint
          className={cn(
            "absolute bg-neutral-700/50! backdrop-blur-sm transition-all duration-1000",
            sprint.status === "idle"
              ? "right-1/2 bottom-1/2 translate-x-1/2 translate-y-1/2"
              : "right-6 bottom-6",
          )}
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
        />
      </Box>
    </AppShell.Main>
  );
}
