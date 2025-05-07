import type { PaperProps } from "@mantine/core";
import type { ReactElement, Ref } from "react";
import { Children, cloneElement, Fragment, useEffect, useRef } from "react";
import {
  ActionIcon,
  Box,
  Collapse,
  createPolymorphicComponent,
  Divider,
  Paper,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconX } from "@tabler/icons-react";

import type { TaskInput } from "@/core/task-management";
import {
  taskFormOpts,
  useTaskForm,
} from "@/ui/task-management/task-form/useTaskForm";
import { cn } from "@/ui/utils";

export interface TaskWrapperProps {
  task: ReactElement<{ onAddSubtask?: () => void }>;
  subtasks: ReactElement[] | undefined;
  ref?: Ref<HTMLDivElement>;
  onAddSubtask: (task: TaskInput) => void;
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

    const form = useTaskForm({
      ...taskFormOpts,
      onSubmit: ({ value }) => {
        onAddSubtask(value);
        form.reset();
      },
    });

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      const timeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timeout);
    }, [isAddingSubtask]);

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

        <Box>
          {subtasks &&
            Children.map(subtasks, (subtask) => (
              <Fragment key={subtask.key}>
                <Divider />
                {subtask}
              </Fragment>
            ))}
        </Box>
        <Collapse in={isAddingSubtask}>
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
                        onClick={handleAbort}
                      >
                        <IconX size={16} />
                      </ActionIcon>
                    }
                    value={field.state.value}
                    error={field.state.meta.errors.length > 0}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={subtaskAdder.close}
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
      </Paper>
    );
  },
);
