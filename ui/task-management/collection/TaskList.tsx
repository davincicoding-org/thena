import { useRef } from "react";
import {
  ActionIcon,
  Box,
  Button,
  Collapse,
  Divider,
  Flex,
  Paper,
  PaperProps,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useDisclosure, useInputState } from "@mantine/hooks";
import {
  IconFileImport,
  IconPlus,
  IconTrash,
  IconX,
} from "@tabler/icons-react";

import { hasSubtasks, Task } from "@/core/task-management";
import { MOCK_PROJECTS, MOCK_TAGS } from "@/core/task-management/mock";
import { cn } from "@/ui/utils";

import { BuiltInTaskAction, TaskForm, TaskFormProps } from "../task/TaskForm";
import { taskFormOpts, TaskFormValues, useTaskForm } from "../task/useTaskForm";

export type TaskListProps = {
  items: Task[];
  readOnly?: boolean;
  onUpdateTask: (taskId: Task["id"], updates: Partial<Task>) => void;
  onRemoveTask: (taskId: Task["id"]) => void;
  onAddTask: (task: Omit<Task, "id">) => void;
  onRefineTask?: (task: Task) => void;
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
    <Paper
      withBorder={items.length > 0}
      className="transition-all"
      p="sm"
      {...paperProps}
    >
      <Stack>
        {items.map((item) => (
          <Item
            key={item.id}
            item={item}
            onChange={(update) => onUpdateTask(item.id, update)}
            projects={MOCK_PROJECTS}
            tags={MOCK_TAGS}
            actions={[
              ...(onRefineTask
                ? [
                    {
                      label: "Refine",
                      onClick: () => onRefineTask(item),
                    },
                    "-" as BuiltInTaskAction,
                  ]
                : []),
              "subtasks",
              {
                label: "Remove",
                onClick: () => onRemoveTask(item.id),
                color: "red",
              },
            ]}
          />
        ))}
        <Divider className="first:hidden" />
        <TaskAdder hasTasks={items.length > 0} onSubmit={onAddTask} />
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
  hasTasks,
  onSubmit,
}: {
  hasTasks: boolean;
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
      <Flex gap="xs">
        <Button
          className="transition-all"
          flex={1}
          leftSection={<IconPlus size={20} />}
          size={hasTasks ? "xs" : "lg"}
          variant={hasTasks ? "outline" : undefined}
          onClick={open}
        >
          New Task
        </Button>
        <Tooltip label="COMING SOON">
          <ActionIcon
            className="transition-all"
            size={hasTasks ? 30 : 50}
            variant="default"
            onClick={() => alert("COMING SOON")}
          >
            <IconFileImport size="60%" />
          </ActionIcon>
        </Tooltip>
      </Flex>
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
