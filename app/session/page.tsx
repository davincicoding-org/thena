"use client";

import { useEffect, useRef, useState } from "react";
import {
  AppShell,
  Box,
  Button,
  Card,
  Flex,
  Progress,
  Tooltip,
} from "@mantine/core";
import { useInterval } from "@mantine/hooks";
import dayjs, { Dayjs } from "dayjs";
import duration, { Duration } from "dayjs/plugin/duration";

import { TaskList } from "@/ui/task-management";
import { cn } from "@/ui/utils";

dayjs.extend(duration);

export default function SessionPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
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
              "opacity-0": !deadline || pipEnabled,
            },
          )}
        >
          <source src="/videos/library.webm" type="video/webm" />
          <source src="/videos/library.mp4" type="video/mp4" />
        </video>

        <Card
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
            ]}
            onUpdateTask={() => {}}
            onRemoveTask={() => {}}
            onAddTask={() => {}}
            onRefineTask={() => {}}
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
