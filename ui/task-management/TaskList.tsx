import { BoxProps, Checkbox, Paper, Stack, Text } from "@mantine/core";

import { Task } from "@/core/task-management/schema";

export interface TaskListProps extends BoxProps {
  items: Task[];
}

export function TaskList({ items, ...boxProps }: TaskListProps) {
  return (
    <Stack gap={4} {...boxProps}>
      {items.map((item, index) => {
        if (item.subtasks && item.subtasks.length > 0)
          return <TaskGroupItem key={item.label} value={item} />;

        return <TaskItem key={item.label} value={item} />;
      })}
    </Stack>
  );
}

function TaskGroupItem({ value }: { value: Required<Task> }) {
  return (
    <Paper withBorder bg="dark.7">
      <Text size="md" fw={500} px="sm" pt="xs">
        {value.label}
      </Text>

      <Stack gap={4} p="xs">
        {value.subtasks.map((task, index) => (
          <TaskItem key={task.label} value={task} />
        ))}
      </Stack>
    </Paper>
  );
}

function TaskItem({ value }: { value: Task }) {
  return (
    <Paper withBorder display="grid">
      <Checkbox
        label={value.label}
        styles={{ body: { padding: 8 }, labelWrapper: { flex: 1 } }}
      />
    </Paper>
  );
}
