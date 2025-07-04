import { Card, Flex, Skeleton, Stack, Text } from "@mantine/core";

import type { FocusSessionSelect } from "@/core/deep-work/db";

export interface IntelligenceTileProps {
  loading?: boolean;
  summary:
    | {
        focusMinutes: number;
        completedTasks: number;
        completedSessions: FocusSessionSelect[];
      }
    | undefined;
}

export function IntelligenceTile({ loading, summary }: IntelligenceTileProps) {
  if (loading || !summary) return <Skeleton height={90} radius="md" />;

  const focusDuration = (() => {
    const hours = Math.floor(summary.focusMinutes / 60);
    const minutes = summary.focusMinutes % 60;
    if (hours === 0) return `${minutes.toFixed(0)}m`;

    return `${hours}h ${minutes.toFixed(0)}m`;
  })();

  const tasksCompleted = (() => {
    if (summary.completedTasks < 1_000) return summary.completedTasks;

    return `${(summary.completedTasks / 1_000).toFixed(1)}k`;
  })();

  // const completionPercentage = summary.completionRate * 100;

  return (
    <Card
      p={0}
      h={90}
      radius="md"
      shadow="sm"
      className="relative overflow-visible! transition-colors hover:bg-[var(--mantine-color-dark-5)]!"
    >
      <Flex
        gap="md"
        pr="sm"
        justify="space-evenly"
        align="center"
        className="h-full"
      >
        {/* <Tooltip
          label="Completion Rate"
          position="bottom"
          transitionProps={{ transition: "slide-down" }}
        >
          <RingProgress
            size={90}
            rootColor="yellow"
            roundCaps
            thickness={10}
            label={
              <Text size="sm" ta="center" className="font-semibold!">
                {completionPercentage.toFixed(0)}%
              </Text>
            }
            sections={[{ value: completionPercentage, color: "green" }]}
          />
        </Tooltip> */}
        <Stack gap={0} ta="center">
          <Text className="text-3xl!">{tasksCompleted}</Text>
          <Text size="sm">Tasks completed</Text>
        </Stack>

        <Stack gap={0} ta="center">
          <Text className="text-3xl!">{summary.completedSessions.length}</Text>
          <Text size="sm">Sessions completed</Text>
        </Stack>

        <Stack gap={0} ta="center">
          <Text className="text-3xl!">{focusDuration}</Text>
          <Text size="sm">Focus Time</Text>
        </Stack>
        {/* <Stack gap={0} ta="center">
          <Text className="text-3xl!">75%</Text>
          <Text size="sm">Goals achieved</Text>
        </Stack> */}
      </Flex>
    </Card>
  );
}
