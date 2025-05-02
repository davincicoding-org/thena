import { useEffect, useRef } from "react";
import {
  ActionIcon,
  Box,
  Collapse,
  Divider,
  Text,
  TextInput,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";

import type { Subtask } from "@/core/task-management";
import { baseTaskSchema } from "@/core/task-management";

export interface SubtaskAdderProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: Omit<Subtask, "id">) => void;
}

export function SubtaskAdder({
  visible,
  onSubmit,
  onCancel,
}: SubtaskAdderProps) {
  const form = useForm({
    defaultValues: {
      title: "",
    },
    validators: {
      onChange: baseTaskSchema.omit({ id: true }),
    },
    onSubmit: ({ value }) => {
      onSubmit(value);
      form.reset();
    },
  });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timeout);
  }, [visible]);

  const handleCancel = () => {
    form.reset();
    onCancel();
  };

  return (
    <Collapse in={visible}>
      <Divider />
      <Box p="xs">
        <form.Field
          name="title"
          children={(field) => (
            <>
              <TextInput
                ref={inputRef}
                placeholder="New subtask"
                rightSection={
                  <ActionIcon
                    aria-label="Cancel"
                    variant="transparent"
                    color="gray"
                    onClick={handleCancel}
                  >
                    <IconX size={16} />
                  </ActionIcon>
                }
                value={field.state.value}
                error={field.state.meta.errors.length > 0}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={onCancel}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    void form.handleSubmit();
                  }
                }}
              />
              <Collapse
                in={
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length === 0
                }
              >
                <Text size="xs" mt={2} opacity={0.5}>
                  Press Enter to add
                </Text>
              </Collapse>
            </>
          )}
        />
      </Box>
    </Collapse>
  );
}
