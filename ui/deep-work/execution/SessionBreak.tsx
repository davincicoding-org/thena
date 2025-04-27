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
  onResume: () => void;
}

export function SessionBreak({
  duration,
  timeElapsed,
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
          Time for a break
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
          X more Sprints to go
        </Text>
      </Stack>

      <Accordion variant="contained" radius={0} className="-mx-px">
        <Accordion.Item value="1">
          <Accordion.Control>Upcoming Sprint</Accordion.Control>
          <Accordion.Panel>TODO: Show upcoming sprint tasks</Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      <Button
        fullWidth
        radius={0}
        variant={progress >= 100 ? "filled" : "light"}
        onClick={onResume}
      >
        Resume
      </Button>
    </Paper>
  );
}
