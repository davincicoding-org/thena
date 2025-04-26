import { useRef } from "react";
import {
  ActionIcon,
  Box,
  Button,
  Collapse,
  Divider,
  Flex,
  Modal,
  Paper,
  PaperProps,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useDisclosure, useInputState } from "@mantine/hooks";
import {
  IconFileImport,
  IconPlus,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

import {
  Project,
  ProjectInput,
  Tag,
  TagInput,
  Task,
  TaskInput,
  taskInputSchema,
  taskSchema,
} from "@/core/task-management";
import {
  ProjectCreator,
  TagCreator,
  TaskForm,
  TaskFormProps,
  useTaskForm,
} from "@/ui/task-management";

export type TaskCollectorProps = {
  items: Task[];
  onUpdateTask: (taskId: Task["id"], updates: Partial<Task>) => void;
  onRemoveTask: (taskId: Task["id"]) => void;
  onAddTask: (task: Omit<Task, "id">) => void;
  onRefineTask?: (task: Task) => void;
  projects: Project[];
  onCreateProject: (
    project: ProjectInput,
    onCreate: (project: Project) => void,
  ) => void;
  tags: Tag[];
  onCreateTag: (tag: TagInput, onCreate: (tag: Tag) => void) => void;
  allowPullFromBacklog?: boolean;
  onRequestToPullFromBacklog?: () => void;
};

export function TaskCollector({
  items,
  onUpdateTask,
  onRemoveTask,
  onAddTask,
  onRefineTask,
  tags,
  onCreateProject,
  projects,
  onCreateTag,
  allowPullFromBacklog,
  onRequestToPullFromBacklog,
  ...paperProps
}: TaskCollectorProps & PaperProps) {
  const form = useForm({
    defaultValues: {
      items,
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

  return (
    <>
      <Paper
        withBorder={items.length > 0}
        className="transition-all"
        p="sm"
        {...paperProps}
      >
        <Stack>
          <form.Field
            name="items"
            mode="array"
            children={(itemsField) => (
              <>
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
                            itemField.handleChange({ id: item.id, ...update });
                            onUpdateTask(item.id, update);
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
                                color="red"
                                variant="subtle"
                                justify="flex-start"
                                leftSection={<IconTrash size={16} />}
                                onClick={() => onRemoveTask(item.id)}
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
              </>
            )}
          />
          <Divider className="first:hidden" />
          <TaskAdder
            hasTasks={items.length > 0}
            onSubmit={onAddTask}
            allowPullFromBacklog={allowPullFromBacklog}
            onRequestToPullFromBacklog={onRequestToPullFromBacklog}
          />
        </Stack>
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
            onCreateProject(values, (project) => {
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
            onCreateTag(values, (tag) => {
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
  ...props
}: {
  item: TaskInput;
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

  return <TaskForm form={form} {...props} />;
}

interface TaskAdderProps
  extends Pick<
    TaskCollectorProps,
    "allowPullFromBacklog" | "onRequestToPullFromBacklog"
  > {
  hasTasks: boolean;
  onSubmit: (task: Omit<Task, "id">) => void;
}

function TaskAdder({
  hasTasks,
  onSubmit,
  allowPullFromBacklog,
  onRequestToPullFromBacklog,
}: TaskAdderProps) {
  const [visible, { open, close }] = useDisclosure(false);

  const [title, setTitle] = useInputState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (title.trim() === "") return;
    onSubmit({ title: title.trim() });
    setTitle("");
  };

  if (!visible)
    return (
      <Flex gap="xs">
        <Button
          className="transition-all"
          flex={1}
          leftSection={<IconPlus size={20} />}
          size={hasTasks ? "xs" : "lg"}
          variant={hasTasks ? "outline" : undefined}
          onClick={open}
        >
          New Task
        </Button>
        {allowPullFromBacklog && (
          <Tooltip label="Pull Tasks from Backlog">
            <ActionIcon
              aria-label="Pull Tasks from Backlog"
              className="transition-all"
              size={hasTasks ? 30 : 50}
              variant="default"
              onClick={onRequestToPullFromBacklog}
            >
              <IconFileImport size="60%" />
            </ActionIcon>
          </Tooltip>
        )}
      </Flex>
    );

  return (
    <Box>
      <TextInput
        ref={inputRef}
        autoFocus
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
      <Collapse in={title.trim() !== ""}>
        <Text size="xs" mt={2} opacity={0.3}>
          Press Enter to add
        </Text>
      </Collapse>
    </Box>
  );
}
