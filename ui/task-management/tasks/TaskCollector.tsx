import type { PaperProps } from "@mantine/core";
import type { UseMutateFunction } from "@tanstack/react-query";
import type { Ref } from "react";
import { useImperativeHandle, useRef } from "react";
import {
  ActionIcon,
  Button,
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

export interface TaskCollectorRef {
  resetTask: (task: TaskSelect) => void;
}

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

  ref?: Ref<TaskCollectorRef>;
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
  ref,
  ...paperProps
}: TaskCollectorProps & PaperProps) {
  const itemsReset = useRef<Record<TaskId, (value: TaskSelect) => void>>({});

  useImperativeHandle(ref, () => {
    return {
      resetTask: (task) => {
        itemsReset.current[task.uid]?.(task);
      },
    };
  }, []);

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
            {items.map((task) => (
              <TaskWrapper
                key={task.uid}
                task={
                  <Item
                    item={task}
                    onUpdate={(updates) => onUpdateTask?.(task.uid, updates)}
                    ref={(reset) => {
                      if (!reset) return;
                      itemsReset.current[task.uid] = reset;
                    }}
                    projects={projects}
                    onCreateProject={onCreateProject}
                    TaskActions={({ defaultActions }) => (
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
                          onClick={() => onRemoveTask?.(task.uid, false)}
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
                          onClick={() => onRemoveTask?.(task.uid, true)}
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
                          onUpdate={(updates) =>
                            onUpdateTask?.(subtask.uid, updates)
                          }
                          ref={(reset) => {
                            if (!reset) return;
                            itemsReset.current[subtask.uid] = reset;
                          }}
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

function Item({
  item,
  ref,
  isSubtask,
  onUpdate,
  onDelete,
  ...props
}: {
  item: TaskInsert;
  ref: Ref<(value: TaskInsert) => void>;
  isSubtask?: boolean;
  onUpdate: (update: TaskInsert) => void;
  onDelete?: () => void;
} & TaskFormProps) {
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
  useImperativeHandle(ref, () => {
    return (value: TaskInsert) =>
      Object.entries(value).forEach(([key, value]) => {
        form.setFieldValue(key as keyof TaskInsert, value);
      });
  }, [form]);
  if (isSubtask) {
    return <SubtaskForm form={form} onRemove={onDelete} {...props} />;
  }

  return <TaskForm form={form} {...props} />;
}

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
