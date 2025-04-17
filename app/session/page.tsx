"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  AppShell,
  Box,
  Button,
  Card,
  Center,
  Flex,
  Progress,
  Tooltip,
} from "@mantine/core";
import { useInterval } from "@mantine/hooks";
import dayjs, { Dayjs } from "dayjs";
import duration, { Duration } from "dayjs/plugin/duration";

import { TaskList } from "@/ui/task-management/TaskList";
import { cn } from "@/ui/utils";

dayjs.extend(duration);

type CompanionCapabilities = {
  video: boolean;
  full: boolean;
};

export default function SessionPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const taskListRef = useRef<HTMLDivElement>(null);
  const pipWindowRef = useRef<PictureInPictureWindow>(null);
  const [pipEnabled, setPipEnabled] = useState(false);

  const { timeLeft, duration, deadline, startTimer, progress } = useTimer({
    duration: dayjs.duration({ minutes: 45, seconds: 0 }),
    onFinish: () => {
      alert("finished");
    },
  });

  const startSession = () => {
    startTimer();
    videoRef.current?.play();
  };

  console.log(documentPictureInPicture);

  const enterPipMode = async () => {
    if (!videoRef.current) return;
    const pipWindow = await videoRef.current.requestPictureInPicture();
    setPipEnabled(true);
    // FIXME: this is not working
    pipWindow.addEventListener("pagehide", () => {
      setPipEnabled(false);
      pipWindowRef.current = null;
    });
    pipWindowRef.current = pipWindow;

    if (documentPictureInPicture) {
      documentPictureInPicture.requestWindow();
      setPipEnabled(true);
      const pipWindow2 = await documentPictureInPicture.requestWindow();
      pipWindow2.document.body.append(taskListRef.current);
    }
  };

  return (
    <AppShell.Main display="grid">
      <Box pos="relative">
        <video
          ref={videoRef}
          src="/videos/bunny.mp4"
          muted
          playsInline
          loop
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000",
            {
              "opacity-0": !deadline || pipEnabled,
            },
          )}
        />

        {deadline && (
          <Button
            pos="absolute"
            variant="outline"
            className={cn({ hidden: pipEnabled })}
            top={24}
            right={24}
            onClick={enterPipMode}
          >
            Companion Mode
          </Button>
        )}
        <Card
          ref={taskListRef}
          withBorder
          pos="absolute"
          bottom={24}
          right={24}
          p="sm"
          maw={400}
          radius="md"
          bg="none"
          className="bg-neutral-600/30! backdrop-blur-md"
        >
          <TaskList
            mb="sm"
            items={[
              { label: "Clean the kitchen" },
              {
                label: "Build an app",
                subtasks: [
                  { label: "Gather requirements" },
                  { label: "Design the UI" },
                  { label: "Implement the logic" },
                  { label: "Test the app" },
                ],
              },
              { label: "Walk the dog" },
            ]}
          />
          <Card.Section h={42}>
            {deadline ? (
              <Flex h={36} align="center" justify="stretch">
                <Tooltip label={timeLeft.format("mm:ss")}>
                  <Progress
                    value={progress}
                    size="lg"
                    w="100%"
                    mx="md"
                    radius="md"
                    styles={{ label: { textAlign: "center" } }}
                  />
                </Tooltip>
              </Flex>
            ) : (
              <Button
                radius={0}
                size="md"
                fullWidth
                loaderProps={{ type: "bars" }}
                onClick={startSession}
              >
                Start Session
              </Button>
            )}
          </Card.Section>
        </Card>
      </Box>
    </AppShell.Main>
  );
}

const useTimer = ({
  duration,
  onFinish,
}: {
  duration: Duration;
  onFinish: () => void;
}) => {
  const [deadline, setDeadline] = useState<Dayjs>();

  const [timeLeft, setTimeLeft] = useState(duration);
  const interval = useInterval(() => {
    if (!deadline) return;
    setTimeLeft(dayjs.duration(deadline.diff(dayjs())));
  }, 100);

  useEffect(() => {
    if (!deadline) return;

    if (deadline.isAfter(dayjs())) return;
    onFinish();
    interval.stop();
  }, [timeLeft, deadline]);

  const startTimer = () => {
    setDeadline(dayjs().add(duration));
    interval.start();
  };

  const progress =
    Math.max(0, timeLeft.asSeconds() / duration.asSeconds()) * 100;

  return { timeLeft, duration, startTimer, progress, deadline };
};
