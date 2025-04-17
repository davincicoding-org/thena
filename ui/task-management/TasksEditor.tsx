import { ReactElement, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import {
  buildTaskReference,
  Task,
  taskSchema,
} from "@/core/task-management/schema";

import { MultiActionIcon } from "../components/MultiActionIcon";

export interface TasksEditorProps extends BoxProps {
  items: Task[];
  onChange: (items: Task[]) => void;
  onRefineTask: (task: Task) => void;
}

export function TasksEditor({
  items,
  onChange,
  onRefineTask,
  ...boxProps
}: TasksEditorProps) {
  const { control, handleSubmit } = useForm({
    values: { items },
    resolver: zodResolver(z.object({ items: taskSchema.array() })),
  });

  const { fields, remove, update, append } = useFieldArray({
    control,
    name: "items",
  });

  const triggerChange = handleSubmit((values) => {
    // const namedItems = values.items.map((item, index) => {
    //   if ("id" in item) delete item.id;
    //   if (isTaskGroup(item)) {
    //     return {
    //       ...item,
    //       ref: buildTaskReference(index),
    //       tasks: item.tasks.map<Task>((task, subIndex) => {
    //         if ("id" in task) delete task.id;
    //         return {
    //           ...task,
    //           ref: buildTaskReference(index, subIndex),
    //         };
    //       }),
    //     };
    //   }
    //   return {
    //     ...item,
    //     ref: buildTaskReference(index),
    //   };
    // });
    onChange(values.items);
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const [isAddingTask, { open: openTaskAdder, close: closeTaskAdder }] =
    useDisclosure(false);
  const [input, setInput] = useInputState("");

  return (
    <Stack component="form" {...boxProps}>
      {fields.map((item, index) => {
        if (item.subtasks && item.subtasks.length > 0)
          return (
            <TaskGroupItem
              key={item.id}
              value={item}
              onChange={(updatedItem) => {
                update(index, updatedItem);
                triggerChange();
              }}
            />
          );

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
            onChange={(updatedItem) => {
              update(index, updatedItem);
              triggerChange();
            }}
            onRemove={() => {
              remove(index);
              triggerChange();
            }}
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
            append({
              // ref: buildTaskReference(fields.length),
              label: input,
            });
            setInput("");
            closeTaskAdder();
            triggerChange();
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

function TaskGroupItem({
  value,
  onChange,
  disableRefine = false,
}: {
  value: Required<Task>;
  onChange: (item: Task) => void;
  disableRefine?: boolean;
}) {
  const { control, register, handleSubmit } = useForm<Task>({
    values: value,
  });
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "subtasks",
  });

  const triggerChange = handleSubmit(onChange);

  const inputRef = useRef<HTMLInputElement>(null);
  const [isAddingTask, { open: openTaskAdder, close: closeTaskAdder }] =
    useDisclosure(false);
  const [input, setInput] = useInputState("");

  return (
    <Paper withBorder bg="dark.7">
      <Paper bg="dark.8" pos="relative">
        <TextInput
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
          {...register(`label`)}
          onBlur={(e) => {
            if (e.target.value === "") return alert("Please enter a title");
            if (e.target.value === value.label) return;
            triggerChange();
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
        {fields.map((task, index) => (
          <TaskItem
            key={task.id}
            value={task}
            onChange={(updatedItem) => {
              update(index, updatedItem);
              triggerChange();
            }}
            onRemove={() => {
              remove(index);
              triggerChange();
            }}
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
              append({
                // ref: `${value.ref}.${fields.length + 1}`,
                label: input,
              });
              setInput("");
              closeTaskAdder();
              triggerChange();
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
  onChange,
  onRemove,
}: {
  value: Task;
  actions?: ReactElement[];
  onChange: (item: Task) => void;
  onRemove: () => void;
}) {
  const { register, handleSubmit } = useForm<Task>({
    values: value,
  });
  const triggerChange = handleSubmit(onChange);

  return (
    <TextInput
      {...register(`label`)}
      onBlur={(e) => {
        if (e.target.value === "") return onRemove();
        if (e.target.value === value.label) return;
        triggerChange();
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
