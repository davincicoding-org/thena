import { useState } from "react";
import {
  Box,
  Button,
  Card,
  Collapse,
  Progress,
  Select,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";

import { cn } from "@/ui/utils";

import type { FocusSessionConfig, FocusSessionStatus } from "./types";
import { useStopWatch } from "./useStopWatch";

export interface ControlPanelProps {
  status: FocusSessionStatus;
  className?: string;
  onContinue: (timeElapsed: number) => void;
  onStartBreak: (duration: number) => void;
  onSkipBreak: () => void;
  onFinish: () => void;
  onStartSession: (config: FocusSessionConfig) => void;
}

export function ControlPanel({
  status,
  className,
  onStartSession,
  onStartBreak,
  onSkipBreak,
  onContinue,
  onFinish,
}: ControlPanelProps) {
  const sessionDurationOptions = [15, 25, 45];
  const [sessionDuration, setSessionDuration] = useState(25);

  const breakStopwatch = useStopWatch();

  const handleStartBreak = (duration: number) => {
    breakStopwatch.start(duration * 60 * 1000);
    onStartBreak(duration);
  };

  return (
    <Card radius="md" p={0} className={cn(className)}>
      <Collapse in={status === "idle"}>
        <Stack p="md">
          <Text size="xl" ta="center">
            Next Session
          </Text>
          <Select
            size="md"
            value={sessionDuration.toString()}
            data={sessionDurationOptions.map((minutes) => ({
              label: `${minutes} minutes`,
              value: minutes.toString(),
            }))}
            onChange={(value) => setSessionDuration(Number(value))}
          />
        </Stack>

        <Button
          size="lg"
          radius={0}
          fullWidth
          onClick={() =>
            onStartSession({ plannedDuration: sessionDuration * 60 })
          }
        >
          Start Session
        </Button>
      </Collapse>

      <Collapse in={status === "break" && breakStopwatch.timeElapsed === 0}>
        <Box p="sm">
          <Text size="xl" ta="center" mb="md">
            Session Completed
          </Text>

          <Stack gap="xs">
            {/* <Menu>
          <Menu.Target> */}
            <Button size="md" fullWidth onClick={() => handleStartBreak(10)}>
              Take a Break
            </Button>
            {/* </Menu.Target>
          <Menu.Dropdown></Menu.Dropdown>
        </Menu> */}
            <SimpleGrid cols={2}>
              <Button
                size="xs"
                variant="subtle"
                color="gray"
                onClick={onSkipBreak}
              >
                Skip Break
              </Button>
              <Button
                size="xs"
                variant="subtle"
                color="gray"
                onClick={onFinish}
              >
                Stop Working
              </Button>
            </SimpleGrid>
          </Stack>
        </Box>
      </Collapse>
      <Collapse in={status === "break" && breakStopwatch.timeElapsed > 0}>
        <Box p="sm">
          <Text size="xl" ta="center" mb="xs">
            Time for a break
          </Text>
          <Progress
            value={
              (breakStopwatch.timeElapsed / breakStopwatch.totalTime) * 100
            }
            mb="sm"
          />
        </Box>

        <Button
          size="md"
          radius={0}
          fullWidth
          onClick={() => onContinue(breakStopwatch.timeElapsed)}
          variant={
            breakStopwatch.timeElapsed > breakStopwatch.totalTime
              ? "filled"
              : "subtle"
          }
        >
          Continue Working
        </Button>
      </Collapse>
    </Card>
  );
}
