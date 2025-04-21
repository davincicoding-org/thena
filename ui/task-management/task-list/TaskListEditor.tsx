import { ReactElement, useRef } from "react";
import {
  ActionIcon,
  BoxProps,
  Button,
  Paper,
  Stack,
  TextInput,
} from "@mantine/core";
import { useDisclosure, useInputState } from "@mantine/hooks";
import { IconPlus, IconTrash } from "@tabler/icons-react";

import { MultiActionIcon } from "@/ui/components/MultiActionIcon";
import { useSyncState } from "@/ui/hooks/useSyncState";

import { Subtask, Task } from "../../../core/task-management/types";
import { SubtaskInput, TaskListHookReturn } from "./useTaskList";

export interface TaskListEditorProps extends BoxProps {
  tasks: TaskListHookReturn["tasks"];
  onAddTask: TaskListHookReturn["addTask"];
  onUpdateTask: TaskListHookReturn["updateTask"];
  onRemoveTask: TaskListHookReturn["removeTask"];
  onAddSubtask: TaskListHookReturn["addSubtask"];
  onUpdateSubtask: TaskListHookReturn["updateSubtask"];
  onRemoveSubtask: TaskListHookReturn["removeSubtask"];
  onRefineTask: (task: Task) => void;
}

export function TaskListEditor({
  tasks,
  onAddTask,
  onUpdateTask,
  onRemoveTask,
  onAddSubtask,
  onUpdateSubtask,
  onRemoveSubtask,
  onRefineTask,
  ...boxProps
}: TaskListEditorProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isAddingTask, { open: openTaskAdder, close: closeTaskAdder }] =
    useDisclosure(false);
  const [input, setInput] = useInputState("");

  return (
    <Stack {...boxProps}>
      {tasks.map((item) => {
        if (hasSubtasks(item)) {
          return (
            <TaskWithSubtasks
              key={item.id}
              value={item}
              onUpdate={(updates) => onUpdateTask(item.id, updates)}
              onAddSubtask={(subtask) => onAddSubtask(item.id, subtask)}
              onRemoveSubtask={(subtaskId) =>
                onRemoveSubtask(item.id, subtaskId)
              }
              onUpdateSubtask={(subtaskId, updates) =>
                onUpdateSubtask(item.id, subtaskId, updates)
              }
            />
          );
        }
        return (
          <TaskItem
            key={item.id}
            actions={[
              <Button
                key="refine"
                size="compact-sm"
                variant="outline"
                onClick={() => onRefineTask(item)}
              >
                Refine
              </Button>,
            ]}
            value={item}
            onUpdate={(updates) => onUpdateTask(item.id, updates)}
            onRemove={() => onRemoveTask(item.id)}
          />
        );
      })}
      {isAddingTask ? (
        <TextInput
          ref={inputRef}
          value={input}
          onChange={setInput}
          onBlur={closeTaskAdder}
          onKeyDown={(e) => {
            if (e.code !== "Enter") return;
            if (input.length === 0) return;
            onAddTask({
              title: input,
            });
            setInput("");
            closeTaskAdder();
          }}
        />
      ) : (
        <Button
          size="sm"
          variant="subtle"
          leftSection={<IconPlus size={12} />}
          onClick={() => {
            openTaskAdder();
            setTimeout(() => {
              inputRef.current?.focus();
            }, 100);
          }}
        >
          Add Task
        </Button>
      )}
    </Stack>
  );
}

function TaskWithSubtasks({
  value,
  onUpdate,
  onAddSubtask,
  onRemoveSubtask,
  onUpdateSubtask,
}: {
  value: Required<Task>;
  onUpdate: (updates: Partial<Task>) => void;
  onAddSubtask: (subtask: SubtaskInput) => void;
  onRemoveSubtask: (subtaskId: string) => void;
  onUpdateSubtask: (subtaskId: string, updates: Partial<Subtask>) => void;
}) {
  const [internalValue, setInternalValue] = useSyncState(value);

  const inputRef = useRef<HTMLInputElement>(null);
  const [isAddingTask, { open: openTaskAdder, close: closeTaskAdder }] =
    useDisclosure(false);
  const [input, setInput] = useInputState("");

  return (
    <Paper withBorder bg="dark.7">
      <Paper bg="dark.8" pos="relative">
        <TextInput
          value={internalValue.title}
          onChange={(e) =>
            setInternalValue((prev) => ({ ...prev, title: e.target.value }))
          }
          variant="unstyled"
          size="md"
          styles={{
            input: {
              paddingLeft: 12,
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
            },
          }}
          pr={0}
          onBlur={() => {
            if (internalValue.title === "")
              return alert("Please enter a title");
            if (internalValue.title === value.title) return;
            onUpdate({ title: internalValue.title });
          }}
          rightSectionWidth={28}
          rightSection={
            <MultiActionIcon
              overlayProps={{
                radius: "sm",
                bg: "dark.6",
              }}
              actions={[
                <Button
                  key="add-task"
                  size="compact-sm"
                  variant="outline"
                  onClick={() => {
                    openTaskAdder();
                    setTimeout(() => {
                      inputRef.current?.focus();
                    }, 100);
                  }}
                >
                  Add Task
                </Button>,
              ]}
            />
          }
        />
      </Paper>

      <Stack gap="xs" p="sm">
        {internalValue.subtasks.map((task, index) => (
          <TaskItem
            key={task.id}
            value={task}
            onUpdate={(updates) => onUpdateSubtask(task.id, updates)}
            onRemove={() => onRemoveSubtask(task.id)}
          />
        ))}
        {isAddingTask && (
          <TextInput
            ref={inputRef}
            value={input}
            onChange={setInput}
            onBlur={closeTaskAdder}
            onKeyDown={(e) => {
              if (e.code !== "Enter") return;
              if (input.length === 0) return;
              onAddSubtask({
                title: input,
              });
              setInput("");
              closeTaskAdder();
            }}
          />
        )}
      </Stack>
    </Paper>
  );
}

function TaskItem({
  value,
  actions = [],
  onUpdate,
  onRemove,
}: {
  value: Task | Subtask;
  actions?: ReactElement[];
  onUpdate: (updates: Partial<Task | Subtask>) => void;
  onRemove: () => void;
}) {
  const [internalValue, setInternalValue] = useSyncState(value);

  return (
    <TextInput
      value={internalValue.title}
      onChange={(e) =>
        setInternalValue((prev) => ({ ...prev, title: e.target.value }))
      }
      onBlur={() => {
        if (internalValue.title === "") return onRemove();
        if (internalValue.title === value.title) return;
        onUpdate({ title: internalValue.title });
      }}
      className="group"
      rightSection={
        <MultiActionIcon
          className="opacity-0 transition-opacity group-hover:opacity-100"
          overlayProps={{
            radius: "sm",
          }}
          flexProps={{
            gap: 4,
            px: 4,
          }}
          actions={[
            ...actions,
            <ActionIcon
              key="delete"
              variant="subtle"
              size="md"
              color="red"
              onClick={onRemove}
            >
              <IconTrash size={16} />
            </ActionIcon>,
          ]}
        />
      }
    />
  );
}

const hasSubtasks = (item: Task): item is Required<Task> => {
  return Array.isArray(item.subtasks) && item.subtasks.length > 0;
};
