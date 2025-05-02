import type { PaperProps } from "@mantine/core";
import type { Ref } from "react";
import { useImperativeHandle, useRef } from "react";
import {
  ActionIcon,
  Button,
  Divider,
  Flex,
  FocusTrap,
  Modal,
  Paper,
  ScrollArea,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure, useInputState } from "@mantine/hooks";
import { IconPlus, IconTrash, IconX } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

import type {
  Project,
  ProjectInput,
  Tag,
  TagInput,
  Task,
  TaskInput,
} from "@/core/task-management";
import type { TaskFormProps } from "@/ui/task-management";
import { taskInputSchema, taskSchema } from "@/core/task-management";
import {
  ProjectCreator,
  TagCreator,
  TaskForm,
  useTaskForm,
} from "@/ui/task-management";
import { cn } from "@/ui/utils";

export interface TaskCollectorRef {
  reset: () => void;
  resetTask: (taskId: Task["id"], value: TaskInput) => void;
}

export interface TaskCollectorProps {
  items: Task[];
  onUpdateTask?: (taskId: Task["id"], updates: Partial<Task>) => void;
  onRemoveTask?: (taskId: Task["id"], shouldDelete?: boolean) => void;
  onAddTask?: (task: Omit<Task, "id">) => void;
  onRefineTask?: (task: Task) => void;

  projects?: Project[];
  onCreateProject?: (
    project: ProjectInput,
    onCreate: (project: Project) => void,
  ) => void;
  tags?: Tag[];
  ref?: Ref<TaskCollectorRef>;
  onCreateTag?: (tag: TagInput, onCreate: (tag: Tag) => void) => void;
  allowImport?: boolean;
  onRequestImport?: () => void;
  containerProps?: Omit<PaperProps, "className">;
}

export function TaskCollector({
  items,
  onUpdateTask,
  onRemoveTask,
  onAddTask,
  onRefineTask,
  projects = [],
  onCreateProject,
  tags = [],
  onCreateTag,
  allowImport,
  onRequestImport,
  className,
  ref,
  ...paperProps
}: TaskCollectorProps & PaperProps) {
  const form = useForm({
    defaultValues: {
      items: items,
    },
    validators: {
      onChange: z.object({
        items: z.array(taskSchema),
      }),
      onMount: z.object({
        items: z.array(taskSchema),
      }),
    },
  });
  const [isCreatingProject, projectAdder] = useDisclosure(false);
  const createProjectCallback = useRef<(project: Project) => void>(null);

  const [isCreatingTag, tagAdder] = useDisclosure(false);
  const createTagCallback = useRef<(tag: Tag) => void>(null);

  const itemsReset = useRef<Record<string, (value: TaskInput) => void>>({});

  useImperativeHandle(ref, () => {
    return {
      reset: () => {
        form.reset();
      },
      resetTask: (taskId, value) => {
        itemsReset.current[taskId]?.(value);
      },
    };
  }, [form]);

  return (
    <>
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
          <form.Field
            name="items"
            mode="array"
            children={(itemsField) =>
              itemsField.state.value.length ? (
                <Stack p="md">
                  {itemsField.state.value.map((item, index) => (
                    <form.Field
                      key={item.id}
                      name={`items[${index}]`}
                      children={(itemField) => (
                        <>
                          <form.Field
                            name={`items[${index}].id`}
                            defaultValue={item.id}
                            children={() => null}
                          />
                          <Item
                            item={itemField.state.value}
                            onChange={(update) => {
                              itemField.handleChange({
                                id: item.id,
                                ...update,
                              });
                              onUpdateTask?.(item.id, update);
                            }}
                            ref={(reset) => {
                              if (!reset) return;
                              itemsReset.current[item.id] = reset;
                            }}
                            projects={projects}
                            tags={tags}
                            TaskActions={({ defaultActions }) => (
                              <>
                                {onRefineTask && (
                                  <>
                                    <Button
                                      fullWidth
                                      variant="subtle"
                                      color="gray"
                                      justify="flex-start"
                                      onClick={() => onRefineTask(item)}
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
                                  color="gray"
                                  justify="flex-start"
                                  onClick={() => onRemoveTask?.(item.id, false)}
                                >
                                  Postpone for later
                                </Button>
                                <Divider />
                                <Button
                                  fullWidth
                                  color="red"
                                  variant="subtle"
                                  justify="flex-start"
                                  leftSection={<IconTrash size={16} />}
                                  onClick={() => onRemoveTask?.(item.id, true)}
                                >
                                  Delete
                                </Button>
                              </>
                            )}
                            onAssignToNewProject={(callback) => {
                              createProjectCallback.current = callback;
                              projectAdder.open();
                            }}
                            onAttachNewTag={(callback) => {
                              createTagCallback.current = callback;
                              tagAdder.open();
                            }}
                          />
                        </>
                      )}
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
                  Start planning your next session by adding all the tasks you
                  want to achieve.
                </Text>
              )
            }
          />
          <TaskAdder
            onSubmit={onAddTask}
            allowImport={allowImport}
            onRequestImport={onRequestImport}
          />
        </ScrollArea>
      </Paper>
      <Modal
        opened={isCreatingProject}
        centered
        withCloseButton={false}
        transitionProps={{ transition: "pop" }}
        onClose={() => {
          projectAdder.close();
          createProjectCallback.current = null;
        }}
      >
        <ProjectCreator
          onCreate={(values) => {
            projectAdder.close();
            onCreateProject?.(values, (project) => {
              if (createProjectCallback.current === null) return;
              createProjectCallback.current(project);
              createProjectCallback.current = null;
            });
          }}
        />
      </Modal>
      <Modal
        opened={isCreatingTag}
        centered
        withCloseButton={false}
        transitionProps={{ transition: "pop" }}
        onClose={() => {
          tagAdder.close();
          createTagCallback.current = null;
        }}
      >
        <TagCreator
          onCreate={(values) => {
            tagAdder.close();
            onCreateTag?.(values, (tag) => {
              if (createTagCallback.current === null) return;
              createTagCallback.current(tag);
              createTagCallback.current = null;
            });
          }}
        />
      </Modal>
    </>
  );
}

function Item({
  item,
  onChange,
  ref,
  ...props
}: {
  item: TaskInput;
  ref: Ref<(value: TaskInput) => void>;
  onChange: (update: TaskInput) => void;
} & TaskFormProps) {
  const form = useTaskForm({
    defaultValues: item,
    validators: {
      onChange: taskInputSchema,
      onMount: taskInputSchema,
    },
    onSubmit: ({ value }) => onChange(value),
    listeners: {
      onChange: ({ formApi }) => {
        onChange(formApi.state.values);
      },
    },
  });
  useImperativeHandle(ref, () => {
    return (value: TaskInput) => {
      Object.entries(value).forEach(([key, value]) => {
        form.setFieldValue(key as keyof TaskInput, value);
      });
    };
  }, []);

  return <TaskForm form={form} {...props} />;
}

interface TaskAdderProps
  extends Pick<TaskCollectorProps, "allowImport" | "onRequestImport"> {
  onSubmit?: (task: Omit<Task, "id">) => void;
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
