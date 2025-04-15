"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AppShell, Button, Center, RingProgress, Text } from "@mantine/core";
import { useInterval } from "@mantine/hooks";
import dayjs, { Dayjs } from "dayjs";
import duration, { Duration } from "dayjs/plugin/duration";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

dayjs.extend(duration);

export default function SessionPage() {
  const [isReady, setIsReady] = useState(false);
  const { timeLeft, duration, deadline, start, progress } = useTimer({
    duration: dayjs.duration({ minutes: 45, seconds: 0 }),
    onFinish: () => {
      alert("finished");
    },
  });

  return (
    <AppShell.Main display="grid">
      <ReactPlayer
        url="https://www.youtube.com/watch?v=B8JhwzElIhQ"
        playing
        loop
        config={{
          youtube: {
            playerVars: {
              start: 70,
            },
          },
        }}
        muted
        height="100%"
        width="100%"
        style={{
          position: "fixed",
          inset: 0,
          top: 40,
          pointerEvents: "none",
          opacity: deadline ? 1 : 0,
          transition: "opacity 2s ease-in-out",
        }}
        onReady={() => setIsReady(true)}
      />

      <Center my="auto">
        {deadline ? (
          <RingProgress
            size={250}
            thickness={20}
            roundCaps
            sections={[
              {
                value: progress,
                color: "blue",
              },
            ]}
            styles={{ label: { textAlign: "center" } }}
            label={
              <Text
                c="blue.1"
                style={{
                  fontSize: 32,
                  fontFamily: "monospace",
                  textShadow: "0 0 4px rgba(0, 0, 0, 1)",
                }}
                fw={700}
                px="xs"
                component="span"
              >
                {timeLeft.format("mm:ss")}
              </Text>
            }
          />
        ) : (
          <Button
            size="xl"
            radius="xl"
            loading={!isReady}
            loaderProps={{ type: "bars" }}
            onClick={start}
          >
            Start Session
          </Button>
        )}
      </Center>
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

  const start = () => {
    setDeadline(dayjs().add(duration));
    interval.start();
  };

  const progress =
    Math.max(0, timeLeft.asSeconds() / duration.asSeconds()) * 100;

  return { timeLeft, duration, start, progress, deadline };
};
