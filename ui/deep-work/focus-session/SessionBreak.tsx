import type { PaperProps } from "@mantine/core";
import type { DurationUnitsObjectType } from "dayjs/plugin/duration";
import type { Ref } from "react";
import { Button, Flex, Paper, Progress, Stack, Text } from "@mantine/core";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

import { cn } from "@/ui/utils";

dayjs.extend(duration);

export interface SessionBreakProps {
  duration: DurationUnitsObjectType;
  timeElapsed: number;
  sprintsLeft: number;
  ref?: Ref<HTMLDivElement>;
  onResume: () => void;
}

export function SessionBreak({
  duration,
  sprintsLeft,
  ref,
  timeElapsed,
  onResume,
  className,
  ...paperProps
}: SessionBreakProps & PaperProps) {
  const durationMs = dayjs.duration(duration).asMilliseconds();
  const progress = 100 * (timeElapsed / durationMs);
  const hasRanOutOfTime = timeElapsed > durationMs;

  return (
    <Paper
      withBorder
      radius="md"
      className={cn("overflow-clip", className)}
      ref={ref}
      {...paperProps}
    >
      <Stack p="md" gap="sm">
        <Text size="xl" ta="center" fw={500} className="text-nowrap">
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
        <Flex justify="space-between" align="center">
          <Text size="sm">
            {sprintsLeft === 1 && "One last sprint to go"}
            {sprintsLeft > 1 && `${sprintsLeft} more Sprints to go`}
          </Text>
          <Button
            className="transition-colors"
            variant={hasRanOutOfTime ? "filled" : "subtle"}
            onClick={onResume}
          >
            Resume
          </Button>
        </Flex>
      </Stack>
    </Paper>
  );
}
