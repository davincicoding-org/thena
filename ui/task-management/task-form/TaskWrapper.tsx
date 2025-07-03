import type { PaperProps } from "@mantine/core";
import type { ReactElement, ReactNode, Ref } from "react";
import { cloneElement } from "react";
import {
  ActionIcon,
  Box,
  Collapse,
  createPolymorphicComponent,
  Divider,
  FocusTrap,
  Paper,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconX } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import z from "zod";

import { cn } from "@/ui/utils";

export interface TaskWrapperProps {
  task: ReactElement<{ onAddSubtask?: () => void }>;
  subtasks: ReactNode;
  ref?: Ref<HTMLDivElement>;
  onAddSubtask: (title: string) => void;
}

export const TaskWrapper = createPolymorphicComponent<
  "div",
  TaskWrapperProps & PaperProps
>(
  ({
    task,
    subtasks,
    className,
    onAddSubtask,
    ...paperProps
  }: TaskWrapperProps & PaperProps) => {
    const [isAddingSubtask, subtaskAdder] = useDisclosure();

    const form = useForm({
      defaultValues: {
        title: "",
      },
      validators: {
        onChange: z.object({
          title: z.string().min(3),
        }),
      },
      onSubmit: ({ value }) => {
        onAddSubtask(value.title);
        form.reset();
      },
    });

    const handleAbort = () => {
      form.reset();
      subtaskAdder.close();
    };

    return (
      <Paper
        withBorder
        className={cn("overflow-clip", className)}
        {...paperProps}
      >
        {cloneElement(task, { onAddSubtask: subtaskAdder.open })}

        {subtasks}
        <Collapse in={isAddingSubtask}>
          <Divider />
          <Box p="xs">
            <form.Field
              name="title"
              children={(field) => (
                <FocusTrap active={isAddingSubtask}>
                  <TextInput
                    placeholder="New subtask"
                    rightSection={
                      <ActionIcon
                        aria-label="Cancel"
                        variant="transparent"
                        color="gray"
                        onClick={handleAbort}
                      >
                        <IconX size={16} />
                      </ActionIcon>
                    }
                    value={field.state.value}
                    error={field.state.meta.errors.length > 0}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onFocus={(e) =>
                      e.currentTarget.scrollIntoView({
                        behavior: "smooth",
                      })
                    }
                    onBlur={subtaskAdder.close}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        e.currentTarget.blur();
                      }
                      if (e.key === "Enter") {
                        void form.handleSubmit();
                      }
                    }}
                  />
                </FocusTrap>
              )}
            />
          </Box>
        </Collapse>
      </Paper>
    );
  },
);
