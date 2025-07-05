import { Button, FocusTrap, Modal, Stack, Textarea } from "@mantine/core";
import { useInputState } from "@mantine/hooks";

import type { BulkTasks } from "@/core/task-management";

export interface BulkCreatorProps {
  opened: boolean;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (tasks: BulkTasks) => void;
}

export function BulkCreator({
  opened,
  submitting,
  onClose,
  onSubmit,
}: BulkCreatorProps) {
  const [input, setInput] = useInputState("");

  const handleSubmit = () => {
    const rawLines = input
      .split("\n")
      .filter(Boolean)
      .map((line) => line.trim());

    const tasks = rawLines.reduce<{ title: string; subtasks: string[] }[]>(
      (acc, line) => {
        const isSubtask = line.startsWith("-");
        if (!isSubtask) return [...acc, { title: line, subtasks: [] }];
        const accCopy = [...acc];
        const parentTask = accCopy.pop();
        if (!parentTask) return acc;
        return [
          ...accCopy,
          {
            ...parentTask,
            subtasks: [...parentTask.subtasks, line.slice(1).trim()],
          },
        ];
      },
      [],
    );
    onSubmit(tasks);
  };

  return (
    <Modal
      title="Bulk Create Tasks"
      centered
      radius="md"
      opened={opened}
      onClose={onClose}
    >
      <FocusTrap.InitialFocus />
      <Stack>
        <Textarea
          value={input}
          onChange={setInput}
          autosize
          minRows={10}
          maxRows={16}
          disabled={submitting}
          placeholder={`Task 1\n- Subtask\n- Subtask\nTask 2\nTask 3\n- Subtask\n- Subtask`}
        />
        <Button loading={submitting} onClick={handleSubmit}>
          Create
        </Button>
      </Stack>
    </Modal>
  );
}
