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

import {
  Project,
  ProjectInput,
  Tag,
  TagInput,
  Task,
} from "@/core/task-management";
import {
  ProjectCreator,
  TagCreator,
  TaskForm,
  taskFormOpts,
  TaskFormProps,
  TaskFormValues,
  useTaskForm,
} from "@/ui/task-management";

export type TaskCollectorProps = {
  items: Task[];
  projects: Project[];
  tags: Tag[];
  readOnly?: boolean;
  onUpdateTask: (taskId: Task["id"], updates: Partial<Task>) => void;
  onRemoveTask: (taskId: Task["id"]) => void;
  onAddTask: (task: Omit<Task, "id">) => void;
  onRefineTask?: (task: Task) => void;
  onCreateProject: (
    project: ProjectInput,
    onCreate: (project: Project) => void,
  ) => void;
  onCreateTag: (tag: TagInput, onCreate: (tag: Tag) => void) => void;
};

export function TaskCollector({
  items,
  projects,
  tags,
  onUpdateTask,
  onRemoveTask,
  onAddTask,
  onRefineTask,
  onCreateProject,
  onCreateTag,
  ...paperProps
}: TaskCollectorProps & PaperProps) {
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
          {items.map((item) => (
            <Item
              key={item.id}
              item={item}
              onChange={(update) => onUpdateTask(item.id, update)}
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
                    leftSection={<IconTrash size={16} />}
                    onClick={() => onRemoveTask(item.id)}
                  >
                    Remove
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
          ))}
          <Divider className="first:hidden" />
          <TaskAdder hasTasks={items.length > 0} onSubmit={onAddTask} />
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
  item: TaskFormValues;
  onChange: (update: TaskFormValues) => void;
} & TaskFormProps) {
  const form = useTaskForm({
    ...taskFormOpts,
    defaultValues: item,
    onSubmit: ({ value }) => onChange(value),
    listeners: {
      onChange: ({ formApi }) => {
        onChange(formApi.state.values);
      },
    },
  });

  return <TaskForm form={form} {...props} />;
}

function TaskAdder({
  hasTasks,
  onSubmit,
}: {
  hasTasks: boolean;
  onSubmit: (task: Omit<Task, "id">) => void;
}) {
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
        <Tooltip label="Import from Backlog">
          <ActionIcon
            aria-label="Import Tasks"
            className="transition-all"
            size={hasTasks ? 30 : 50}
            variant="default"
            onClick={() => alert("COMING SOON")}
          >
            <IconFileImport size="60%" />
          </ActionIcon>
        </Tooltip>
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
