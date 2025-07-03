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
  Kbd,
  Paper,
  Textarea,
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
  onAddSubtasks: (titles: string[]) => void;
}

export const TaskWrapper = createPolymorphicComponent<
  "div",
  TaskWrapperProps & PaperProps
>(
  ({
    task,
    subtasks,
    className,
    onAddSubtasks,
    ...paperProps
  }: TaskWrapperProps & PaperProps) => {
    const [isAddingSubtask, subtaskAdder] = useDisclosure();

    const form = useForm({
      defaultValues: {
        content: "",
      },
      validators: {
        onSubmit: z.object({
          content: z.string().trim().min(3),
        }),
      },
      onSubmit: ({ value }) => {
        const titles = value.content
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
        onAddSubtasks(titles);
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
              name="content"
              children={(field) => (
                <div>
                  <FocusTrap active={isAddingSubtask}>
                    <Textarea
                      autosize
                      maxRows={3}
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
                          block: "center",
                        })
                      }
                      // onBlur={subtaskAdder.close}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") {
                          e.currentTarget.blur();
                        }
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          void form.handleSubmit();
                        }
                      }}
                    />
                  </FocusTrap>
                  <p className="mt-3 mb-0 text-center text-xs text-gray-400 italic">
                    Press{" "}
                    <Kbd size="xs" className="align-top">
                      Shift
                    </Kbd>{" "}
                    +{" "}
                    <Kbd size="xs" className="align-top">
                      Enter
                    </Kbd>{" "}
                    to add multiple subtasks
                  </p>
                </div>
              )}
            />
          </Box>
        </Collapse>
      </Paper>
    );
  },
);
