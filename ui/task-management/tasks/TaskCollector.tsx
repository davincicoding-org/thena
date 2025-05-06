import type { PaperProps } from "@mantine/core";
import type { UseMutateFunction } from "@tanstack/react-query";
import type { Ref } from "react";
import { forwardRef, useImperativeHandle, useRef } from "react";
import {
  ActionIcon,
  Button,
  createPolymorphicComponent,
  Divider,
  Flex,
  FocusTrap,
  Paper,
  ScrollArea,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure, useInputState } from "@mantine/hooks";
import { IconPlus, IconTrash, IconX } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";

import type {
  ProjectInsertExtended,
  ProjectSelect,
  StandaloneTask,
  TaskId,
  TaskInsert,
  TaskSelect,
  TaskTree,
  TaskUpdate,
} from "@/core/task-management";
import type { TaskFormProps } from "@/ui/task-management";
import { isTaskTree, taskInsertSchema } from "@/core/task-management";
import { TaskForm, useTaskForm } from "@/ui/task-management";
import { cn } from "@/ui/utils";

import { SubtaskForm } from "../task-form/SubtaskForm";
import { TaskWrapper } from "../task-form/TaskWrapper";

export interface TaskCollectorProps {
  items: (TaskTree | StandaloneTask)[];
  onUpdateTask?: (uid: TaskId, updates: TaskUpdate) => void;
  onRemoveTask?: (taskId: TaskId, shouldDelete?: boolean) => void;
  onAddTask?: (task: TaskInsert) => void;
  onRefineTask?: (task: TaskInsert) => void;

  projects?: ProjectSelect[];
  onCreateProject?: UseMutateFunction<
    ProjectSelect | undefined,
    Error,
    ProjectInsertExtended
  >;

  allowImport?: boolean;
  onRequestImport?: () => void;
}

export function TaskCollector({
  items,
  onUpdateTask,
  onRemoveTask,
  onAddTask,
  onRefineTask,
  projects = [],
  onCreateProject,
  allowImport,
  onRequestImport,
  className,
  ...paperProps
}: TaskCollectorProps & PaperProps) {
  return (
    <Paper
      withBorder
      display="grid"
      radius="md"
      className={cn("max-w-96 grid-rows-[1fr_auto] overflow-clip", className)}
      {...paperProps}
    >
      <ScrollArea
        scrollbars="y"
        scrollHideDelay={300}
        classNames={{
          scrollbar: "pb-12!",
        }}
      >
        {items.length ? (
          <Stack p="md">
            <AnimatePresence>
              {items.map((task) => (
                <TaskWrapper
                  component={motion.div}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 25 }}
                  layout
                  transition={{ duration: 0.3 }}
                  key={task.uid}
                  task={
                    <Item
                      item={task}
                      onUpdate={(updates) => onUpdateTask?.(task.uid, updates)}
                      projects={projects}
                      onCreateProject={onCreateProject}
                      TaskActions={({ defaultActions, closeMenu }) => (
                        <>
                          {onRefineTask && (
                            <>
                              <Button
                                fullWidth
                                variant="subtle"
                                color="gray"
                                justify="flex-start"
                                onClick={() => onRefineTask(task)}
                              >
                                Refine
                              </Button>
                              <Divider />
                            </>
                          )}
                          {defaultActions}
                          <Divider />
                          <Button
                            fullWidth
                            variant="subtle"
                            radius={0}
                            color="gray"
                            justify="flex-start"
                            onClick={() => {
                              closeMenu();
                              onRemoveTask?.(task.uid, false);
                            }}
                          >
                            Postpone for later
                          </Button>
                          <Divider />
                          <Button
                            fullWidth
                            color="red"
                            radius={0}
                            variant="subtle"
                            justify="flex-start"
                            leftSection={<IconTrash size={16} />}
                            onClick={() => {
                              closeMenu();
                              onRemoveTask?.(task.uid, true);
                            }}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    />
                  }
                  subtasks={
                    isTaskTree(task)
                      ? task.subtasks.map((subtask) => (
                          <Item
                            key={subtask.uid}
                            item={subtask}
                            isSubtask
                            component={motion.div}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            onUpdate={(updates) =>
                              onUpdateTask?.(subtask.uid, updates)
                            }
                            projects={projects}
                            onCreateProject={onCreateProject}
                            onDelete={() => onRemoveTask?.(subtask.uid, true)}
                          />
                        ))
                      : undefined
                  }
                  onAddSubtask={(subtask) =>
                    onAddTask?.({
                      parentTaskId: task.uid,
                      ...subtask,
                    })
                  }
                />
              ))}
            </AnimatePresence>
          </Stack>
        ) : (
          <Text
            p="lg"
            size="xl"
            opacity={0.5}
            className="min-w-0 text-center leading-normal! text-balance"
          >
            Start planning your next session by adding all the tasks you want to
            achieve.
          </Text>
        )}
        <TaskAdder
          onSubmit={onAddTask}
          allowImport={allowImport}
          onRequestImport={onRequestImport}
        />
      </ScrollArea>
    </Paper>
  );
}

interface ItemProps extends TaskFormProps {
  item: TaskInsert;
  ref?: Ref<HTMLDivElement>;
  isSubtask?: boolean;
  onUpdate: (update: TaskInsert) => void;
  onDelete?: () => void;
}

const Item = createPolymorphicComponent<"div", ItemProps>(
  ({ item, isSubtask, onUpdate, onDelete, ...props }: ItemProps) => {
    const form = useTaskForm({
      defaultValues: item,
      validators: {
        onChange: taskInsertSchema,
        onMount: taskInsertSchema,
      },
      onSubmit: ({ value }) => onUpdate(value),
      listeners: {
        onChange: ({ formApi }) => {
          if (formApi.state.isValid) return;
          onUpdate(formApi.state.values);
        },
      },
    });

    if (isSubtask) {
      return <SubtaskForm form={form} onRemove={onDelete} {...props} />;
    }

    return <TaskForm form={form} {...props} />;
  },
);

interface TaskAdderProps
  extends Pick<TaskCollectorProps, "allowImport" | "onRequestImport"> {
  onSubmit?: (task: TaskInsert) => void;
}

function TaskAdder({ onSubmit, allowImport, onRequestImport }: TaskAdderProps) {
  const [visible, { open, close }] = useDisclosure(false);

  const [title, setTitle] = useInputState("");

  const handleSubmit = () => {
    if (title.trim() === "") return;
    onSubmit?.({ title: title.trim() });
    setTitle("");
  };

  return (
    <Flex
      pos="sticky"
      bottom={0}
      className={cn(
        "border-t border-t-[var(--paper-border-color)] backdrop-blur-sm transition-colors",
        {
          "flex-col border-t-transparent": visible,
        },
      )}
    >
      {visible ? (
        <FocusTrap active={visible}>
          <TextInput
            autoFocus
            size="md"
            radius="md"
            placeholder="New Task"
            rightSection={
              <ActionIcon
                aria-label="Cancel"
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
        </FocusTrap>
      ) : (
        <>
          <Button
            flex={1}
            variant="light"
            size="md"
            radius={0}
            leftSection={<IconPlus size={20} />}
            onClick={open}
          >
            Create Task
          </Button>
          {allowImport && (
            <Button
              component={motion.button}
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              flex={1}
              variant="light"
              color="gray"
              radius={0}
              size="md"
              onClick={onRequestImport}
            >
              Add Existing Tasks
            </Button>
          )}
        </>
      )}
    </Flex>
  );
}
