import { useState } from "react";
import {
  Box,
  Button,
  Card,
  Collapse,
  NumberInput,
  Progress,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";

import { cn } from "@/ui/utils";

import type { FocusSessionConfig, FocusSessionStatus } from "./types";
import { useStopWatch } from "./useStopWatch";

export interface ControlPanelProps {
  status: FocusSessionStatus;
  hasTodos: boolean;
  className?: string;
  onStartBreak: (duration: number) => void;
  onFinishBreak: () => void;
  onSkipBreak: () => void;
  onStartSession: (config: FocusSessionConfig) => void;
  onExit: () => void;
}

export function ControlPanel({
  status,
  hasTodos,
  className,
  onStartSession,
  onStartBreak,
  onSkipBreak,
  onFinishBreak,
  onExit,
}: ControlPanelProps) {
  const [sessionDuration, setSessionDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(10);

  const breakStopwatch = useStopWatch();

  const handleStartBreak = (duration: number) => {
    breakStopwatch.start(duration * 60);
    onStartBreak(duration);
  };

  const handleFinishBreak = () => {
    breakStopwatch.reset();
    onFinishBreak();
  };

  return (
    <Card radius="md" p={0} className={cn(className)}>
      <Collapse in={status === "idle"}>
        <Stack p="md">
          {hasTodos ? (
            <>
              <Text size="xl" ta="center">
                Next Session
              </Text>
              <NumberInput
                min={15}
                max={90}
                step={5}
                size="lg"
                variant="filled"
                radius="md"
                value={sessionDuration}
                suffix=" Minutes"
                onChange={(value) => setSessionDuration(Number(value))}
              />
            </>
          ) : (
            <Text>Create some tasks to get started</Text>
          )}
        </Stack>

        <Button
          size="lg"
          radius={0}
          fullWidth
          disabled={sessionDuration < 15 || sessionDuration > 90}
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
            <NumberInput
              min={5}
              max={60}
              step={5}
              size="lg"
              variant="filled"
              radius="md"
              value={breakDuration}
              suffix=" Minutes"
              onChange={(value) => setBreakDuration(Number(value))}
            />
            <Button
              size="md"
              fullWidth
              disabled={breakDuration < 5 || breakDuration > 60}
              onClick={() => handleStartBreak(breakDuration)}
            >
              Take a Break
            </Button>

            <SimpleGrid cols={2}>
              <Button
                size="xs"
                variant="subtle"
                color="gray"
                onClick={onSkipBreak}
              >
                Skip Break
              </Button>
              <Button size="xs" variant="subtle" color="gray" onClick={onExit}>
                Exit Session
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
          onClick={handleFinishBreak}
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
