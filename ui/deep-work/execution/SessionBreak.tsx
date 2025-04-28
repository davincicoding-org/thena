import {
  Accordion,
  Box,
  Button,
  Divider,
  Paper,
  PaperProps,
  Progress,
  Space,
  Stack,
  Text,
} from "@mantine/core";

import { cn } from "@/ui/utils";

export interface SessionBreakProps {
  duration: number;
  timeElapsed: number;
  sprintsLeft: number;
  onResume: () => void;
}

export function SessionBreak({
  duration,
  timeElapsed,
  sprintsLeft,
  onResume,
  className,
  ...paperProps
}: SessionBreakProps & PaperProps) {
  const progress = 100 * (timeElapsed / duration);

  return (
    <Paper
      withBorder
      radius="md"
      className={cn("w-xs overflow-clip", className)}
      {...paperProps}
    >
      <Stack p="md" gap="sm">
        <Text size="xl" ta="center" fw={500}>
          {progress >= 100 ? "Break is over" : "Time for a break"}
        </Text>
        <Progress
          color={timeElapsed > duration ? "red" : "primary"}
          size="md"
          className={cn({
            "animate-pulse": timeElapsed > duration,
          })}
          value={progress}
        />
        <Text ta="center" size="sm">
          {sprintsLeft === 1 && "One last sprint to go"}
          {sprintsLeft > 1 && `${sprintsLeft} more Sprints to go`}
        </Text>
      </Stack>

      {/* <Accordion variant="contained" radius={0} className="-mx-px">
        <Accordion.Item value="1">
          <Accordion.Control>Upcoming Sprint</Accordion.Control>
          <Accordion.Panel>TODO: Show upcoming sprint tasks</Accordion.Panel>
        </Accordion.Item>
      </Accordion> */}

      <Divider />
      <Button
        fullWidth
        radius={0}
        size="md"
        className="transition-colors"
        variant={progress >= 100 ? "filled" : "subtle"}
        onClick={onResume}
      >
        Finish Break
      </Button>
    </Paper>
  );
}
