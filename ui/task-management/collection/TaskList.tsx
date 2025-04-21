import { useRef } from "react";
import {
  ActionIcon,
  Box,
  Button,
  Collapse,
  Divider,
  Paper,
  PaperProps,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure, useInputState } from "@mantine/hooks";
import { IconPlus, IconTrash, IconX } from "@tabler/icons-react";

import { Task } from "@/core/task-management";

import { TaskForm, TaskFormProps } from "../task/TaskForm";
import { taskFormOpts, TaskFormValues, useTaskForm } from "../task/useTaskForm";

export type TaskListProps = {
  items: Task[];
  readOnly?: boolean;
  onUpdateTask: (taskId: Task["id"], updates: Partial<Task>) => void;
  onRemoveTask: (taskId: Task["id"]) => void;
  onAddTask: (task: Omit<Task, "id">) => void;
  onRefineTask: (task: Task) => void;
};

export function TaskList({
  items,
  onUpdateTask,
  onRemoveTask,
  onAddTask,
  onRefineTask,
  ...paperProps
}: TaskListProps & PaperProps) {
  return (
    <Paper withBorder p="sm" {...paperProps}>
      <Stack>
        {items.map((item) => (
          <Item
            key={item.id}
            item={item}
            onChange={(update) => onUpdateTask(item.id, update)}
            autoSubmit="blur"
            actions={[
              <Button
                key="refine"
                variant="outline"
                size="compact-sm"
                onClick={() => onRefineTask(item)}
              >
                Refine
              </Button>,
              "add-subtask",
              <ActionIcon
                key="remove"
                color="red"
                variant="subtle"
                onClick={() => onRemoveTask(item.id)}
              >
                <IconTrash size={16} />
              </ActionIcon>,
            ]}
          />
        ))}
        <Divider className="first:hidden" />
        <TaskAdder onSubmit={onAddTask} />
      </Stack>
    </Paper>
  );
}

function Item({
  item,
  onChange,
  ...props
}: {
  item: TaskFormValues;
  onChange: (update: TaskFormValues) => void;
} & TaskFormProps) {
  const form = useTaskForm({
    ...taskFormOpts,
    defaultValues: item,
    onSubmit: ({ value }) => onChange(value),
  });
  return <TaskForm form={form} {...props} />;
}

function TaskAdder({
  onSubmit,
}: {
  onSubmit: (task: Omit<Task, "id">) => void;
}) {
  const [visible, { open, close }] = useDisclosure(false);

  const [title, setTitle] = useInputState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (title.trim() === "") return;
    onSubmit({ title: title.trim() });
    setTitle("");
  };

  if (!visible)
    return (
      <Button leftSection={<IconPlus size={20} />} size="sm" onClick={open}>
        Add Task
      </Button>
    );

  return (
    <Box>
      <TextInput
        ref={inputRef}
        autoFocus
        placeholder="New Task"
        rightSection={
          <ActionIcon
            variant="transparent"
            color="gray"
            onClick={() => {
              setTitle("");
              close();
            }}
          >
            <IconX size={16} />
          </ActionIcon>
        }
        value={title}
        onChange={setTitle}
        onBlur={close}
        onKeyDown={(e) => {
          if (e.key !== "Enter") return;
          handleSubmit();
          close();
        }}
      />
      <Collapse in={title.trim() !== ""}>
        <Text size="xs" mt={2} opacity={0.3}>
          Press Enter to add
        </Text>
      </Collapse>
    </Box>
  );
}
