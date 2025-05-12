import { Card, Flex, RingProgress, Skeleton, Stack, Text } from "@mantine/core";

export interface IntelligenceTileProps {
  loading?: boolean;
  summary:
    | {
        focusTime: number;
        completedTasks: number;
        completionRate: number;
        completedSprints: {
          id: string;
          duration: number;
          completedTasks: number;
          skippedTasks: number;
          completionRate: number;
        }[];
      }
    | undefined;
}

export function IntelligenceTile({ loading, summary }: IntelligenceTileProps) {
  if (loading || !summary) {
    return <Skeleton height={90} radius="md" />;
  }

  const focusDuration = (() => {
    const focusTimeInMinutes = summary.focusTime / (1000 * 60);
    const hours = Math.floor(focusTimeInMinutes / 60);
    const minutes = focusTimeInMinutes % 60;
    if (hours === 0) return `${minutes.toFixed(0)}m`;

    return `${hours}h ${minutes.toFixed(0)}m`;
  })();

  const tasksCompleted = (() => {
    if (summary.completedTasks < 1_000) {
      return summary.completedTasks;
    }

    return `${(summary.completedTasks / 1_000).toFixed(1)}k`;
  })();

  const completionPercentage = summary.completionRate * 100;

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
        <RingProgress
          size={90}
          rootColor="yellow"
          roundCaps
          thickness={10}
          label={
            <Text size="sm" ta="center">
              {completionPercentage.toFixed(0)}%
            </Text>
          }
          sections={[{ value: completionPercentage, color: "green" }]}
        />
        <Stack gap={0} ta="center">
          <Text className="text-3xl!">{tasksCompleted}</Text>
          <Text size="sm">Tasks completed</Text>
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
