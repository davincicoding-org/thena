import type { PaperProps } from "@mantine/core";
import type { DurationUnitsObjectType } from "dayjs/plugin/duration";
import type { Ref } from "react";
import { useEffect, useState } from "react";
import { Button, Divider, Paper, Progress, Stack, Text } from "@mantine/core";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

import { cn } from "@/ui/utils";

dayjs.extend(duration);

export interface SessionBreakProps {
  duration: DurationUnitsObjectType;
  running: boolean;
  sprintsLeft: number;
  ref?: Ref<HTMLDivElement>;
  onResume: () => void;
}

export function SessionBreak({
  duration,
  sprintsLeft,
  ref,
  running,
  onResume,
  className,
  ...paperProps
}: SessionBreakProps & PaperProps) {
  const durationMs = dayjs.duration(duration).asMilliseconds();
  const [timeElapsed, setTimeElapsed] = useState(0);
  const progress = 100 * (timeElapsed / durationMs);
  const hasRanOutOfTime = timeElapsed > durationMs;

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 100);
    }, 100);
    return () => clearInterval(timer);
  }, [running]);

  return (
    <Paper
      withBorder
      radius="md"
      className={cn("w-xs overflow-clip", className)}
      ref={ref}
      {...paperProps}
    >
      <Stack p="md" gap="sm">
        <Text size="xl" ta="center" fw={500}>
          {progress >= 100 ? "Break is over" : "Time for a break"}
        </Text>
        <Progress
          color={hasRanOutOfTime ? "red" : "primary"}
          size="md"
          className={cn({
            "animate-pulse": hasRanOutOfTime,
          })}
          value={progress}
        />
        <Text ta="center" size="sm">
          {sprintsLeft === 1 && "One last sprint to go"}
          {sprintsLeft > 1 && `${sprintsLeft} more Sprints to go`}
        </Text>
      </Stack>

      <Divider />
      <Button
        fullWidth
        radius={0}
        size="md"
        className="transition-colors"
        variant={hasRanOutOfTime ? "filled" : "subtle"}
        onClick={onResume}
      >
        Finish Break
      </Button>
    </Paper>
  );
}
