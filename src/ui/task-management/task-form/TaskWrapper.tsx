import type { BoxProps, PaperProps } from "@mantine/core";
import type { ReactElement, ReactNode, Ref } from "react";
import {
  ActionIcon,
  Collapse,
  createPolymorphicComponent,
  Divider,
  Flex,
  FocusTrap,
  Kbd,
  Paper,
  Textarea,
  Tooltip,
} from "@mantine/core";
import { IconInfoCircleFilled, IconX } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import z from "zod";

import { cn } from "@/ui/utils";

export interface TaskWrapperProps {
  task: ReactElement<{ onAddSubtask?: () => void } & BoxProps>;
  subtasks: ReactNode;
  ref?: Ref<HTMLDivElement>;
  isAddingSubtask?: boolean;
  onCloseSubtaskAdder?: () => void;
  onAddSubtasks?: (titles: string[]) => void;
}

export const TaskWrapper = createPolymorphicComponent<
  "div",
  TaskWrapperProps & PaperProps
>(
  ({
    task,
    subtasks,
    className,
    isAddingSubtask = false,
    onCloseSubtaskAdder,
    onAddSubtasks,
    ...paperProps
  }: TaskWrapperProps & PaperProps) => {
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
        onAddSubtasks?.(titles);
        form.reset();
      },
    });

    const handleAbort = () => {
      form.reset();
      onCloseSubtaskAdder?.();
    };

    return (
      <Paper
        withBorder
        className={cn("overflow-clip", className)}
        {...paperProps}
      >
        {task}

        {subtasks}
        <Collapse in={isAddingSubtask}>
          <Divider />
          <Flex p="xs" pr={0} wrap="nowrap">
            <form.Field
              name="content"
              children={(field) => (
                <FocusTrap active={isAddingSubtask}>
                  <Textarea
                    autosize
                    flex={1}
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
                    onBlur={onCloseSubtaskAdder}
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
              )}
            />
            <Tooltip
              position="bottom-end"
              transitionProps={{
                transition: "pop-top-right",
              }}
              label={
                <>
                  Press{" "}
                  <Kbd size="xs" className="align-text-bottom">
                    Shift
                  </Kbd>{" "}
                  +{" "}
                  <Kbd size="xs" className="align-text-bottom">
                    Enter
                  </Kbd>{" "}
                  to add multiple subtasks
                </>
              }
            >
              <ActionIcon
                variant="transparent"
                color="gray"
                size="input-sm"
                px={8}
                className="!w-auto !min-w-0"
              >
                <IconInfoCircleFilled size={12} />
              </ActionIcon>
            </Tooltip>
          </Flex>
        </Collapse>
      </Paper>
    );
  },
);
