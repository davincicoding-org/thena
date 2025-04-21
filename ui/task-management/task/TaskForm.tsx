import { ReactElement, useEffect, useRef } from "react";
import {
  ActionIcon,
  Button,
  Collapse,
  Flex,
  Paper,
  PaperProps,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure, useInputState } from "@mantine/hooks";
import { IconDotsVertical, IconTrash, IconX } from "@tabler/icons-react";
import { useStore } from "@tanstack/react-form";
import { nanoid } from "nanoid";

import { Subtask } from "@/core/task-management/types";
import { BoundOverlay } from "@/ui/components/BoundOverlay";
import { cn } from "@/ui/utils";

import { taskFormOpts, withTaskForm } from "./useTaskForm";

export type TaskFormProps = {
  actions?: (ReactElement | "add-subtask")[];
  autoSubmit?: "blur" | "change";
  containerProps?: PaperProps;
};

export const TaskForm = withTaskForm({
  ...taskFormOpts,
  props: {} as TaskFormProps,
  render: ({
    form,
    actions: providedActions,
    autoSubmit = "disabled",
    containerProps,
  }) => {
    const { hasTitle, hasSubtasks } = useStore(form.store, ({ values }) => ({
      hasSubtasks: values.subtasks && values.subtasks.length > 0,
      hasTitle: values.title.trim() !== "",
    }));

    const [isAddingSubtask, subtaskAdder] = useDisclosure(false);

    const defaultActions: TaskFormProps["actions"] = !hasTitle
      ? []
      : ["add-subtask"];

    const actions = (providedActions || defaultActions).map((action) => {
      if (action === "add-subtask") {
        return (
          <Button
            key={action}
            variant="default"
            size="compact-sm"
            className="last:mr-0.5"
            disabled={isAddingSubtask}
            onClick={subtaskAdder.open}
          >
            Add subtask
          </Button>
        );
      }
      return action;
    });

    return (
      <Paper
        withBorder={hasSubtasks || isAddingSubtask}
        className={cn("overflow-clip", containerProps?.className)}
        {...containerProps}
      >
        <form.Field
          name="title"
          children={(field) => (
            <BoundOverlay
              closeOnClick
              disabled={actions.length === 0}
              content={
                <Flex
                  align="center"
                  justify="flex-end"
                  h="100%"
                  px={4}
                  gap="xs"
                >
                  {actions}
                </Flex>
              }
              overlayProps={{
                bg: "black",
              }}
              className="group"
            >
              <TextInput
                placeholder="Task title"
                radius={hasSubtasks ? 0 : undefined}
                classNames={{
                  error: "hidden!",
                  wrapper: "mb-0!",
                  input: cn("truncate", {
                    "border-none!": hasSubtasks,
                  }),
                }}
                value={field.state.value}
                pos="relative"
                onChange={(e) => {
                  field.handleChange(e.target.value);
                  if (autoSubmit === "change") {
                    field.form.handleSubmit();
                  }
                }}
                onBlur={() => {
                  if (autoSubmit === "blur") {
                    field.form.handleSubmit();
                  }
                }}
                error={field.state.meta.errors[0]?.message}
                rightSection={
                  <BoundOverlay.Trigger>
                    <ActionIcon
                      variant="transparent"
                      color="gray"
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <IconDotsVertical size={16} />
                    </ActionIcon>
                  </BoundOverlay.Trigger>
                }
              />
            </BoundOverlay>
          )}
        />
        <form.Field
          name="subtasks"
          mode="array"
          children={(field) => {
            const handleAddSubtask = (title: string) => {
              field.pushValue({
                id: generateSubtaskId(
                  field.state.value?.map((subtask) => subtask.id),
                ),
                title,
              });
              if (autoSubmit) field.form.handleSubmit();
            };
            return (
              <Stack
                className={cn({
                  "hidden!": !(hasSubtasks || isAddingSubtask),
                })}
                p="sm"
                gap="xs"
              >
                {field.state.value?.map((_, i) => (
                  <form.Field key={i} name={`subtasks[${i}].title`}>
                    {(subField) => (
                      <TextInput
                        placeholder="Subtask title"
                        value={subField.state.value}
                        className="group"
                        rightSection={
                          <ActionIcon
                            className="opacity-0 transition-opacity group-hover:opacity-100"
                            color="red"
                            variant="transparent"
                            onClick={() => {
                              field.removeValue(i);
                              if (autoSubmit === "change") {
                                field.form.handleSubmit();
                              }
                            }}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        }
                        onChange={(e) => subField.handleChange(e.target.value)}
                      />
                    )}
                  </form.Field>
                ))}
                <SubtaskAdder
                  visible={isAddingSubtask}
                  onSubmit={(title) => {
                    handleAddSubtask(title);
                    subtaskAdder.close();
                  }}
                  onCancel={subtaskAdder.close}
                />
              </Stack>
            );
          }}
        />
      </Paper>
    );
  },
});

function SubtaskAdder({
  visible,
  onSubmit,
  onCancel,
}: {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (title: string) => void;
}) {
  const [title, setTitle] = useInputState("");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!visible) return;
    const timeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timeout);
  }, [visible]);

  const handleSubmit = () => {
    if (title.trim() === "") return;
    onSubmit(title.trim());
    setTitle("");
  };

  return (
    <Collapse in={visible}>
      <TextInput
        ref={inputRef}
        placeholder="New subtask"
        rightSection={
          <ActionIcon
            variant="transparent"
            color="gray"
            onClick={() => {
              setTitle("");
              onCancel();
            }}
          >
            <IconX size={16} />
          </ActionIcon>
        }
        value={title}
        onChange={setTitle}
        onBlur={onCancel}
        onKeyDown={(e) => {
          if (e.key !== "Enter") return;
          handleSubmit();
        }}
      />
      <Text size="xs" mt={2} opacity={0.3}>
        Press Enter to add
      </Text>
    </Collapse>
  );
}

export const generateSubtaskId = (
  existingIds: string[] = [],
): Subtask["id"] => {
  const id = nanoid(4);
  if (existingIds.includes(id)) return generateSubtaskId(existingIds);
  return id;
};
