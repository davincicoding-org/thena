import { Fragment, ReactElement, useEffect, useRef } from "react";
import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Collapse,
  Divider,
  Flex,
  Menu,
  MenuItemProps,
  Paper,
  PaperProps,
  ScrollArea,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconDotsVertical, IconPlus, IconX } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import { nanoid } from "nanoid";

import { baseTaskSchema, Project, Subtask, Tag } from "@/core/task-management";
import { cn } from "@/ui/utils";

import { taskFormOpts, withTaskForm } from "./useTaskForm";

export type BuiltInTaskAction = "subtasks" | "tags" | "project" | "-";

export interface CustomTaskAction extends MenuItemProps {
  label: string;
  onClick: () => void;
}

export type TaskFormProps = {
  containerProps?: PaperProps;
  projects: Project[];
  tags: Tag[];
  readOnly?: boolean;
  primaryAction?: ReactElement;
  actions?: (BuiltInTaskAction | CustomTaskAction | null)[];
};

export const TaskForm = withTaskForm({
  ...taskFormOpts,
  props: {} as TaskFormProps,
  render: ({
    form,
    containerProps,
    projects,
    tags,
    readOnly,
    primaryAction,
    actions = ["subtasks", "-", "tags", "project"] as BuiltInTaskAction[],
  }) => {
    const [isAddingSubtask, subtaskAdder] = useDisclosure(false);

    const resolveTag = (tagId: Tag["id"]) =>
      tags.find((tag) => tag.id === tagId);
    const resolveProject = (projectId: Project["id"]) =>
      projects.find((project) => project.id === projectId);

    return (
      <Paper
        withBorder
        className={cn("overflow-clip", containerProps?.className)}
        {...containerProps}
      >
        <Menu
          position="bottom-end"
          trigger="click-hover"
          disabled={isAddingSubtask}
          offset={{ mainAxis: 0, crossAxis: 12 }}
          withinPortal={false}
        >
          <Box bg="dark.6" className="group">
            <Flex align="center" p={4}>
              <form.Field
                name="projectId"
                children={({ state: { value } }) => {
                  if (value === undefined) return null;
                  const project = resolveProject(value);
                  if (!project) return null;

                  return (
                    <Tooltip
                      label={project.name}
                      position="right"
                      withArrow
                      arrowSize={6}
                      arrowPosition="center"
                    >
                      <Avatar
                        mr={4}
                        src={project.image}
                        name={project.name}
                        size={32}
                        color={project.color || "gray"}
                      />
                    </Tooltip>
                  );
                }}
              />
              <Box flex={1}>
                <Flex align="center">
                  <form.Field
                    name="title"
                    children={(field) => (
                      <TextInput
                        size="md"
                        flex={1}
                        readOnly={readOnly}
                        classNames={{
                          input: cn(
                            "h-8! min-h-0! truncate px-1.5! not-focus:border-transparent! read-only:border-transparent!",
                          ),
                        }}
                        placeholder="Title"
                        value={field.state.value}
                        error={field.state.meta.errors.length > 0}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    )}
                  />
                  {primaryAction}
                  {!readOnly && (
                    <Menu.Target>
                      <ActionIcon
                        aria-label="Task Actions"
                        className={cn(
                          "opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100",
                        )}
                        variant="transparent"
                        color="gray"
                      >
                        <IconDotsVertical size={16} />
                      </ActionIcon>
                    </Menu.Target>
                  )}
                </Flex>
                <form.Field
                  name="tags"
                  children={({ state: { value } }) => {
                    if (value === undefined) return null;
                    if (value.length === 0) return null;
                    return (
                      <ScrollArea pt={4} type="never">
                        <Flex gap={4} px={4}>
                          {value.map((tagId) => {
                            const tag = resolveTag(tagId);
                            if (!tag) return null;
                            return (
                              <Badge
                                key={tagId}
                                className="shrink-0"
                                color={tag.color || "gray"}
                                autoContrast
                                size="xs"
                              >
                                {tag.name}
                              </Badge>
                            );
                          })}
                        </Flex>
                      </ScrollArea>
                    );
                  }}
                />
              </Box>
            </Flex>

            <Menu.Dropdown>
              {actions.map((action, index) => {
                if (action === null) return null;
                if (typeof action === "object") {
                  const { label, ...props } = action;
                  return (
                    <Menu.Item key={label} {...props}>
                      {label}
                    </Menu.Item>
                  );
                }

                switch (action) {
                  case "-":
                    return <Menu.Divider key={index} />;
                  case "subtasks":
                    return (
                      <Menu.Item
                        key={action}
                        leftSection={<IconPlus size={16} />}
                        onClick={subtaskAdder.open}
                      >
                        Add subtask
                      </Menu.Item>
                    );
                  case "project":
                    return (
                      <form.Field
                        key={action}
                        name="projectId"
                        children={(field) => (
                          <Menu.Item disabled>
                            {field.state.value
                              ? "Remove from Project"
                              : "Assign to Project"}
                          </Menu.Item>
                        )}
                      />
                    );
                  case "tags":
                    return (
                      <form.Field
                        key={action}
                        name="tags"
                        children={(field) => (
                          <Menu.Item disabled>
                            {field.state.value && field.state.value.length > 0
                              ? "Manage Tags"
                              : "Add Tags"}
                          </Menu.Item>
                        )}
                      />
                    );
                }
              })}
            </Menu.Dropdown>
          </Box>
        </Menu>
        <form.Field
          name="subtasks"
          mode="array"
          children={(field) => {
            const handleAddSubtask = (values: Omit<Subtask, "id">) => {
              field.pushValue({
                id: generateSubtaskId(
                  field.state.value?.map((subtask) => subtask.id),
                ),
                ...values,
              });
            };
            return (
              <>
                {field.state.value?.map((subtask, index) => (
                  <Fragment key={subtask.id}>
                    <Divider />
                    <Menu
                      position="bottom-end"
                      trigger="click-hover"
                      disabled={isAddingSubtask}
                      offset={{ mainAxis: 4, crossAxis: 12 }}
                      withinPortal={false}
                    >
                      <Flex p={4} className="group" align="center">
                        <form.Field
                          key={subtask.id}
                          name={`subtasks[${index}].title`}
                          children={(subField) => (
                            <TextInput
                              placeholder="Subtask"
                              size="md"
                              flex={1}
                              classNames={{
                                input: cn(
                                  "h-7! min-h-0! truncate bg-transparent! px-1.5! not-focus:border-transparent! read-only:border-transparent!",
                                ),
                              }}
                              value={subField.state.value}
                              readOnly={readOnly}
                              onChange={(e) =>
                                subField.handleChange(e.target.value)
                              }
                              error={subField.state.meta.errors.length > 0}
                            />
                          )}
                        />
                        {!readOnly && (
                          <Menu.Target>
                            <ActionIcon
                              aria-label="Subtask Actions"
                              className="opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                              variant="transparent"
                              color="gray"
                            >
                              <IconDotsVertical size={16} />
                            </ActionIcon>
                          </Menu.Target>
                        )}
                        <Menu.Dropdown>
                          <form.Field
                            name={`subtasks[${index}].title`}
                            children={(subField) => (
                              <Menu.Item disabled>
                                {subField.state.value &&
                                subField.state.value.length > 0
                                  ? "Manage Tags"
                                  : "Add Tags"}
                              </Menu.Item>
                            )}
                          />
                          <Menu.Divider />
                          <Menu.Item
                            color="red"
                            leftSection={<IconX size={16} />}
                            onClick={() => field.removeValue(index)}
                          >
                            Remove
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Flex>
                      <form.Field
                        name={`subtasks[${index}].tags`}
                        children={({ state: { value } }) => {
                          if (value === undefined) return null;
                          if (value.length === 0) return null;
                          return (
                            <ScrollArea pb={4} type="never">
                              <Flex gap={4} px="xs">
                                {value.map((tagId) => {
                                  const tag = resolveTag(tagId);
                                  if (!tag) return null;
                                  return (
                                    <Badge
                                      key={tagId}
                                      className="shrink-0"
                                      color={tag.color || "gray"}
                                      size="xs"
                                    >
                                      {tag.name}
                                    </Badge>
                                  );
                                })}
                              </Flex>
                            </ScrollArea>
                          );
                        }}
                      />
                    </Menu>
                  </Fragment>
                ))}

                <SubtaskAdder
                  visible={isAddingSubtask}
                  onSubmit={handleAddSubtask}
                  onCancel={subtaskAdder.close}
                />
              </>
            );
          }}
        />
      </Paper>
    );
  },
});

function SubtaskAdder({
  visible,
  onSubmit,
  onCancel,
}: {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: Omit<Subtask, "id">) => void;
}) {
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
                    form.handleSubmit();
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

export const generateSubtaskId = (
  existingIds: string[] = [],
): Subtask["id"] => {
  const id = nanoid(4);
  if (existingIds.includes(id)) return generateSubtaskId(existingIds);
  return id;
};
