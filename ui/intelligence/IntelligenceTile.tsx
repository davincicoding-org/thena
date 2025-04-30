import { Badge, Card, Flex, RingProgress, Stack, Text } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IntelligenceTileProps {}

export function IntelligenceTile({}: IntelligenceTileProps) {
  return (
    <Card
      p={0}
      radius="md"
      shadow="sm"
      className="relative overflow-visible! transition-colors hover:bg-[var(--mantine-color-dark-5)]!"
    >
      <Badge
        pos="absolute"
        top={0}
        className="-translate-y-1/2"
        right={8}
        size="xs"
        variant="light"
        leftSection={<IconAlertCircle size={12} />}
        color="orange"
      >
        Mock Data
      </Badge>
      <Flex gap="md" pr="sm" justify="space-evenly" align="center">
        <RingProgress size={90} sections={[{ value: 75, color: "primary" }]} />
        <Stack gap={0} ta="center">
          <Text className="text-3xl!">5h 20m</Text>
          <Text size="sm">Total Focus Time</Text>
        </Stack>
        <Stack gap={0} ta="center">
          <Text className="text-3xl!">75%</Text>
          <Text size="sm">Goals achieved</Text>
        </Stack>
      </Flex>
    </Card>
  );
}
