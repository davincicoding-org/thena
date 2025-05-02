/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable max-lines */
import type { MenuProps, PaperProps } from "@mantine/core";
import type { Updater } from "@tanstack/react-form";
import type {
  FunctionComponent,
  HTMLAttributes,
  ReactElement,
  ReactNode,
} from "react";
import { Fragment, useEffect, useRef, useState } from "react";
import {
  ActionIcon,
  Box,
  Button,
  Collapse,
  Combobox,
  Divider,
  Flex,
  FocusTrap,
  Group,
  Menu,
  NavLink,
  Paper,
  Popover,
  ScrollArea,
  Space,
  Tabs,
  Text,
  TextInput,
  useCombobox,
} from "@mantine/core";
import { useClickOutside, useDisclosure, useInputState } from "@mantine/hooks";
import {
  IconChevronLeft,
  IconCircleX,
  IconClipboardOff,
  IconClipboardText,
  IconDotsVertical,
  IconPlus,
  IconSearch,
  IconTags,
  IconX,
} from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";

import type {
  Project,
  ProjectInput,
  Subtask,
  Tag,
  TagInput,
  TaskComplexity,
  TaskPriority,
} from "@/core/task-management";
import {
  baseTaskSchema,
  taskComplexityEnum,
  taskPriorityEnum,
} from "@/core/task-management";
import {
  ComplexityBadge,
  PriorityBadge,
  ProjectAvatar,
  TagBadge,
} from "@/ui/task-management";
import { ProjectForm } from "@/ui/task-management/metadata/ProjectForm";
import { TagForm } from "@/ui/task-management/metadata/TagForm";
import {
  projectFormOpts,
  useProjectForm,
} from "@/ui/task-management/metadata/useProjectForm";
import {
  tagFormOpts,
  useTagForm,
} from "@/ui/task-management/metadata/useTagForm";
import { cn, createUniqueId } from "@/ui/utils";

import { taskFormOpts, withTaskForm } from "./useTaskForm";

type TaskActionsComponent = FunctionComponent<{ defaultActions: ReactNode }>;

// MARK: Component

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type TaskFormProps = {
  containerProps?: PaperProps & HTMLAttributes<HTMLDivElement>;
  projects: Project[];
  onCreateProject?: (
    input: ProjectInput,
    callback: (project: Project) => void,
  ) => void;
  tags: Tag[];
  onCreateTag?: (input: TagInput, callback: (tag: Tag) => void) => void;
  readOnly?: boolean;
  TaskActions?: TaskActionsComponent;
};

export const TaskForm = withTaskForm({
  ...taskFormOpts,
  props: {} as TaskFormProps,
  render: ({
    form,
    containerProps,
    projects,
    onCreateProject,
    tags,
    onCreateTag,
    readOnly,
    TaskActions = (({ defaultActions }) =>
      defaultActions) as TaskActionsComponent,
  }) => {
    const [isAddingSubtask, subtaskAdder] = useDisclosure(false);

    const [isActionsPanelOpen, actionsPanel] = useDisclosure(false);
    const actionsPanelRef = useClickOutside(() => actionsPanel.close());
    const [tab, setTab] = useState<"actions" | "tags" | "projects">("actions");

    const resolveTag = (tagId: Tag["id"]) =>
      tags.find((tag) => tag.id === tagId);
    const resolveProject = (projectId: Project["id"] | undefined) =>
      projects.find((project) => project.id === projectId);

    const defaultActions = (
      <>
        <Button
          variant="subtle"
          justify="flex-start"
          fullWidth
          radius={0}
          color="gray"
          leftSection={<IconPlus size={16} />}
          onClick={() => {
            subtaskAdder.open();
            actionsPanel.close();
          }}
        >
          Add Subtasks
        </Button>
        <Divider />
        <form.Field
          name="projectId"
          children={(projectField) => {
            if (projectField.state.value)
              return (
                <Button
                  variant="subtle"
                  justify="flex-start"
                  leftSection={<IconClipboardOff size={16} />}
                  fullWidth
                  radius={0}
                  color="gray"
                  onClick={() => {
                    projectField.setValue(null);
                    actionsPanel.close();
                  }}
                >
                  Unassign from Project
                </Button>
              );

            return (
              <Button
                variant="subtle"
                justify="flex-start"
                leftSection={<IconClipboardText size={16} />}
                fullWidth
                radius={0}
                color="gray"
                onClick={() => setTab("projects")}
              >
                Assign to Project
              </Button>
            );
          }}
        />
        <form.Field
          name="tags"
          children={(tagsField) => (
            <Button
              variant="subtle"
              justify="flex-start"
              leftSection={<IconTags size={16} />}
              fullWidth
              radius={0}
              color="gray"
              onClick={() => setTab("tags")}
            >
              {tagsField.state.value?.length ? "Manage Tags" : "Add Tags"}
            </Button>
          )}
        />

        <Divider />

        <form.Field
          name="priority"
          children={(priorityField) => (
            <PriorityMenu
              value={priorityField.state.value}
              onChange={priorityField.handleChange}
            >
              <Button
                justify="flex-start"
                fullWidth
                radius={0}
                color="gray"
                variant="subtle"
              >
                Set Priority
              </Button>
            </PriorityMenu>
          )}
        />

        <form.Field
          name="complexity"
          children={(complexityField) => (
            <ComplexityMenu
              value={complexityField.state.value}
              onChange={complexityField.handleChange}
            >
              <Button
                justify="flex-start"
                fullWidth
                radius={0}
                color="gray"
                variant="subtle"
              >
                Set Complexity
              </Button>
            </ComplexityMenu>
          )}
        />
      </>
    );

    return (
      <Paper
        withBorder
        className={cn("overflow-clip", containerProps?.className)}
        {...containerProps}
      >
        <Popover
          position="bottom-end"
          opened={isActionsPanelOpen}
          onClose={() => {
            setTimeout(() => {
              setTab("actions");
            }, 300);
          }}
        >
          <TaskHeader
            form={form}
            readOnly={readOnly}
            resolveProject={resolveProject}
            resolveTag={resolveTag}
            ActionsTarget={Popover.Target}
            isActionsPanelOpen={isActionsPanelOpen}
            onOpenActionsPanel={actionsPanel.open}
          />

          <Popover.Dropdown
            p={0}
            ref={actionsPanelRef}
            className="overflow-clip"
          >
            <Tabs value={tab}>
              <Tabs.Panel value="actions">
                <TaskActions defaultActions={defaultActions} />
              </Tabs.Panel>
              <Tabs.Panel value="projects">
                <form.Field
                  name="projectId"
                  children={(projectField) => (
                    <ProjectAssigner
                      value={projectField.state.value}
                      projects={projects}
                      onClose={() => setTab("actions")}
                      onChange={(projectId) => {
                        projectField.handleChange(projectId);
                        actionsPanel.close();
                      }}
                      onCreate={(project, callback) => {
                        onCreateProject?.(project, callback);
                        actionsPanel.close();
                      }}
                    />
                  )}
                />
              </Tabs.Panel>
              <Tabs.Panel value="tags">
                <form.Field
                  name="tags"
                  children={(tagFields) => (
                    <TagsPanel
                      value={tagFields.state.value}
                      tags={tags}
                      onClose={() => setTab("actions")}
                      onChange={tagFields.handleChange}
                      onCreate={onCreateTag}
                    />
                  )}
                />
              </Tabs.Panel>
            </Tabs>
          </Popover.Dropdown>
        </Popover>
        <form.Field
          name="subtasks"
          mode="array"
          children={(subtasksField) => {
            const handleAddSubtask = (values: Omit<Subtask, "id">) => {
              subtasksField.pushValue({
                id: createUniqueId(subtasksField.state.value ?? [], 4),
                ...values,
              });
            };
            return (
              <>
                <Box>
                  {subtasksField.state.value?.map((subtask, index) => (
                    <Fragment key={subtask.id}>
                      <Divider />
                      <SubtaskForm
                        form={form}
                        index={index}
                        readOnly={readOnly}
                        tags={tags}
                        onRemove={() => subtasksField.removeValue(index)}
                        onCreateTag={onCreateTag}
                      />
                    </Fragment>
                  ))}
                </Box>
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

// MARK: Header

type TaskHeaderProps = Pick<TaskFormProps, "readOnly"> & {
  isActionsPanelOpen: boolean;
  resolveProject: (projectId: Project["id"]) => Project | undefined;
  resolveTag: (tagId: Tag["id"]) => Tag | undefined;
  ActionsTarget: FunctionComponent<{ children: ReactElement }>;
  onOpenActionsPanel: () => void;
};

const TaskHeader = withTaskForm({
  ...taskFormOpts,
  props: {} as TaskHeaderProps,
  render: ({
    form,
    readOnly,
    resolveProject,
    resolveTag,
    ActionsTarget,
    isActionsPanelOpen,
    onOpenActionsPanel,
  }) => {
    return (
      <Box bg="dark.6" className="group">
        <Flex align="center" p={4}>
          <form.Field
            name="projectId"
            children={({ state: { value } }) => {
              if (!value) return null;
              const project = resolveProject(value);
              if (!project) return null;

              return <ProjectAvatar mr={4} project={project} size={32} />;
            }}
          />
          <Box flex={1}>
            <Flex align="center" gap={4}>
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
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        void form.handleSubmit();
                        e.currentTarget.blur();
                      }
                    }}
                  />
                )}
              />
              <form.Field
                name="priority"
                children={(priorityField) => {
                  if (!priorityField.state.value) return null;
                  if (priorityField.state.value === "default") return null;

                  return (
                    <PriorityMenu
                      value={priorityField.state.value}
                      onChange={priorityField.handleChange}
                    >
                      <PriorityBadge
                        priority={priorityField.state.value}
                        className="cursor-pointer!"
                        size="xs"
                      />
                    </PriorityMenu>
                  );
                }}
              />
              <form.Field
                name="complexity"
                children={(complexityField) => {
                  if (!complexityField.state.value) return null;
                  if (complexityField.state.value === "default") return null;

                  return (
                    <ComplexityMenu
                      value={complexityField.state.value}
                      onChange={complexityField.handleChange}
                    >
                      <ComplexityBadge
                        className="cursor-pointer!"
                        complexity={complexityField.state.value}
                        size="xs"
                      />
                    </ComplexityMenu>
                  );
                }}
              />
              {!readOnly && (
                <ActionsTarget>
                  <ActionIcon
                    aria-label="Task Actions"
                    className="disabled:cursor-default!"
                    disabled={isActionsPanelOpen}
                    variant="transparent"
                    color="gray"
                    onClick={onOpenActionsPanel}
                  >
                    <IconDotsVertical size={16} />
                  </ActionIcon>
                </ActionsTarget>
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
                          <TagBadge
                            key={tagId}
                            className="shrink-0"
                            size="xs"
                            tag={tag}
                          />
                        );
                      })}
                    </Flex>
                  </ScrollArea>
                );
              }}
            />
          </Box>
        </Flex>
      </Box>
    );
  },
});

// MARK: Subtask

type SubtaskFormProps = Pick<TaskFormProps, "readOnly" | "onCreateTag"> & {
  index: number;
  tags: Tag[];
  onRemove: () => void;
};

const SubtaskForm = withTaskForm({
  ...taskFormOpts,
  props: {} as SubtaskFormProps,
  render: ({ form, readOnly, index, tags, onRemove, onCreateTag }) => {
    const [isActionsPanelOpen, actionsPanel] = useDisclosure(false);
    const actionsPanelRef = useClickOutside(() => actionsPanel.close());
    const [tab, setTab] = useState<"actions" | "tags">("actions");

    return (
      <Popover
        position="bottom-end"
        offset={{ mainAxis: 4, crossAxis: 12 }}
        opened={isActionsPanelOpen}
        onClose={actionsPanel.close}
      >
        <Flex p={4} gap={4} className="group" align="center">
          <form.Field
            name={`subtasks[${index}].title`}
            children={(subField) => (
              <TextInput
                placeholder="Subtask"
                size="md"
                flex={1}
                classNames={{
                  input: cn(
                    "h-8! min-h-0! truncate bg-transparent! px-1.5! not-focus:border-transparent! read-only:border-transparent!",
                  ),
                }}
                value={subField.state.value ?? ""}
                readOnly={readOnly}
                onChange={(e) => subField.handleChange(e.target.value)}
                error={subField.state.meta.errors.length > 0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    void form.handleSubmit();
                    e.currentTarget.blur();
                  }
                }}
              />
            )}
          />

          <form.Field
            name={`subtasks[${index}].priority`}
            children={(priorityField) => {
              if (!priorityField.state.value) return null;
              if (priorityField.state.value === "default") return null;

              return (
                <PriorityMenu
                  value={priorityField.state.value}
                  onChange={priorityField.handleChange}
                >
                  <PriorityBadge
                    priority={priorityField.state.value}
                    className="cursor-pointer!"
                    size="xs"
                  />
                </PriorityMenu>
              );
            }}
          />
          <form.Field
            name={`subtasks[${index}].complexity`}
            children={(complexityField) => {
              if (!complexityField.state.value) return null;
              if (complexityField.state.value === "default") return null;

              return (
                <ComplexityMenu
                  value={complexityField.state.value}
                  onChange={complexityField.handleChange}
                >
                  <ComplexityBadge
                    className="cursor-pointer!"
                    complexity={complexityField.state.value}
                    size="xs"
                  />
                </ComplexityMenu>
              );
            }}
          />
          {!readOnly && (
            <Popover.Target>
              <ActionIcon
                aria-label="Subtask Actions"
                variant="transparent"
                color="gray"
                onClick={actionsPanel.open}
              >
                <IconDotsVertical size={16} />
              </ActionIcon>
            </Popover.Target>
          )}
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
                    const tag = tags.find((tag) => tag.id === tagId);
                    if (!tag) return null;
                    return (
                      <TagBadge
                        key={tagId}
                        className="shrink-0"
                        size="xs"
                        tag={tag}
                      />
                    );
                  })}
                </Flex>
              </ScrollArea>
            );
          }}
        />

        <Popover.Dropdown p={0} ref={actionsPanelRef}>
          <Tabs value={tab}>
            <Tabs.Panel value="actions">
              <form.Field
                name={`subtasks[${index}].tags`}
                children={(tagFields) => (
                  <Button
                    variant="subtle"
                    justify="flex-start"
                    leftSection={<IconTags size={16} />}
                    fullWidth
                    radius={0}
                    color="gray"
                    onClick={() => setTab("tags")}
                  >
                    {tagFields.state.value?.length ? "Manage Tags" : "Add Tags"}
                  </Button>
                )}
              />
              <Divider />
              <form.Field
                name={`subtasks[${index}].priority`}
                children={(priorityField) => (
                  <PriorityMenu
                    value={priorityField.state.value}
                    onChange={priorityField.handleChange}
                  >
                    <Button
                      justify="flex-start"
                      fullWidth
                      radius={0}
                      color="gray"
                      variant="subtle"
                    >
                      Set Priority
                    </Button>
                  </PriorityMenu>
                )}
              />

              <form.Field
                name={`subtasks[${index}].complexity`}
                children={(complexityField) => (
                  <ComplexityMenu
                    value={complexityField.state.value}
                    onChange={complexityField.handleChange}
                  >
                    <Button
                      justify="flex-start"
                      fullWidth
                      radius={0}
                      color="gray"
                      variant="subtle"
                    >
                      Set Complexity
                    </Button>
                  </ComplexityMenu>
                )}
              />
              <Divider />
              <Button
                color="red"
                justify="flex-start"
                fullWidth
                variant="subtle"
                leftSection={<IconX size={16} />}
                onClick={onRemove}
              >
                Remove
              </Button>
            </Tabs.Panel>
            <Tabs.Panel value="tags">
              <form.Field
                name={`subtasks[${index}].tags`}
                children={(tagsField) => (
                  <TagsPanel
                    value={tagsField.state.value}
                    tags={tags}
                    onClose={() => setTab("actions")}
                    onChange={tagsField.handleChange}
                    onCreate={onCreateTag}
                  />
                )}
              />
            </Tabs.Panel>
          </Tabs>
        </Popover.Dropdown>
      </Popover>
    );
  },
});

// MARK: Metadata Fields

function ProjectAssigner({
  value,
  projects,
  onChange,
  onCreate,
  onClose,
}: {
  value: Project["id"] | undefined | null;
  projects: Project[];
  onChange: (updater: Updater<Project["id"] | undefined | null>) => void;
  onCreate?: (
    input: ProjectInput,
    callback: (project: Project) => void,
  ) => void;
  onClose: () => void;
}) {
  const [isCreating, createPanel] = useDisclosure(false);
  const [search, setSearch] = useInputState("");

  const form = useProjectForm({
    ...projectFormOpts,
    onSubmit: ({ value }) => {
      createPanel.close();
      onCreate?.(value, (project) => {
        form.reset();
        onChange(project.id);
      });
    },
  });

  const trimmedSearch = search.trim();
  const filteredOptions = projects.filter((tag) => {
    if (!trimmedSearch) return true;
    return tag.name.toLowerCase().includes(trimmedSearch.toLowerCase());
  });

  return (
    <Box className="w-48">
      <Collapse in={!isCreating}>
        <Divider />
        <ScrollArea
          scrollbars="y"
          className="h-32"
          classNames={{
            scrollbar: cn("pt-10!"),
          }}
        >
          <Box className="sticky top-0 z-10 backdrop-blur-xs">
            <Flex align="center">
              <ActionIcon
                radius={0}
                variant="subtle"
                color="gray"
                h={38}
                onClick={onClose}
              >
                <IconChevronLeft size={16} />
              </ActionIcon>
              <TextInput
                placeholder="Search Project"
                className="m-1"
                autoFocus
                value={search}
                size="xs"
                onChange={setSearch}
                rightSection={
                  <ActionIcon
                    className={cn("transition-opacity", {
                      "opacity-0": !trimmedSearch,
                    })}
                    variant="subtle"
                    color="gray"
                    size="xs"
                    onClick={() => setSearch("")}
                  >
                    <IconX size={12} />
                  </ActionIcon>
                }
              />
            </Flex>
            <Divider />
          </Box>

          {filteredOptions.map((project) => (
            <NavLink
              key={project.id}
              component="button"
              className="py-1!"
              active={value?.includes(project.id)}
              color="gray"
              onClick={() => onChange(project.id)}
              label={project.name}
              leftSection={
                <ProjectAvatar
                  project={project}
                  size="xs"
                  tooltipProps={{ disabled: true }}
                />
              }
            />
          ))}
        </ScrollArea>
        <Divider />

        <Button
          variant="light"
          size="xs"
          radius={0}
          fullWidth
          onClick={createPanel.open}
        >
          Create New Project
        </Button>
      </Collapse>
      <Divider />
      <Collapse in={isCreating}>
        <Flex gap={4} align="center" pr="md">
          <ActionIcon
            radius={0}
            variant="subtle"
            color="gray"
            onClick={createPanel.close}
          >
            <IconChevronLeft size={16} />
          </ActionIcon>
          New Project
        </Flex>
        <Divider />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
        >
          <ProjectForm
            form={form}
            p="xs"
            gap="xs"
            withImage={false}
            NameFieldProps={{ size: "xs" }}
            DescriptionFieldProps={{ size: "xs", rows: 2 }}
          />
          <Divider />
          <form.Subscribe
            selector={(state) => state.isValid && state.isDirty}
            children={(isValid) => (
              <Button
                radius={0}
                size="xs"
                className="transition-colors"
                fullWidth
                type="submit"
                disabled={!isValid}
              >
                Create Project
              </Button>
            )}
          />
        </form>
      </Collapse>
    </Box>
  );
}

function TagsPanel({
  value,
  tags,
  onClose,
  onChange,
  onCreate,
}: {
  value: Tag["id"][] | undefined;
  tags: Tag[];
  onClose: () => void;
  onChange: (updater: Updater<Tag["id"][] | undefined>) => void;
  onCreate?: (input: TagInput, callback: (tag: Tag) => void) => void;
}) {
  const [isCreating, createPanel] = useDisclosure(false);
  const [search, setSearch] = useInputState("");

  const handleValueSelect = (val: string) => {
    onChange((current = []) => {
      const next = current.includes(val)
        ? current.filter((v) => v !== val)
        : [...current, val];
      // if (next.length === 0) return undefined;
      return next;
    });
  };

  const form = useTagForm({
    ...tagFormOpts,
    onSubmit: ({ value }) => {
      createPanel.close();
      onCreate?.(value, (tag) => {
        form.reset();
        handleValueSelect(tag.id);
      });
    },
  });

  const orderedOptions = [...tags].sort((a, b) => {
    if (value?.includes(a.id)) return -1;
    if (value?.includes(b.id)) return 1;
    return a.name.localeCompare(b.name);
  });

  const trimmedSearch = search.trim();
  const filteredOptions = orderedOptions.filter((tag) => {
    if (!trimmedSearch) return true;

    return tag.name.toLowerCase().includes(trimmedSearch.toLowerCase());
  });

  return (
    <Box className="w-48">
      <Collapse in={!isCreating}>
        <Divider />
        <ScrollArea
          scrollbars="y"
          className="h-32"
          classNames={{
            scrollbar: cn("pt-10!"),
          }}
        >
          <Box className="sticky top-0 backdrop-blur-xs">
            <Flex align="center">
              <ActionIcon
                radius={0}
                variant="subtle"
                color="gray"
                h={38}
                onClick={onClose}
              >
                <IconChevronLeft size={16} />
              </ActionIcon>
              <TextInput
                placeholder="Search Tag"
                className="m-1"
                autoFocus
                value={search}
                size="xs"
                onChange={setSearch}
                rightSection={
                  <ActionIcon
                    className={cn("transition-opacity", {
                      "opacity-0": !trimmedSearch,
                    })}
                    variant="subtle"
                    color="gray"
                    size="xs"
                    onClick={() => setSearch("")}
                  >
                    <IconX size={12} />
                  </ActionIcon>
                }
              />
            </Flex>
            <Divider />
          </Box>

          {filteredOptions.map((tag) => (
            <NavLink
              key={tag.id}
              component="button"
              className="py-1!"
              active={value?.includes(tag.id)}
              color="gray"
              onClick={() => handleValueSelect(tag.id)}
              label={tag.name}
            />
          ))}
        </ScrollArea>
        <Divider />

        <Button
          variant="light"
          size="xs"
          radius={0}
          fullWidth
          onClick={createPanel.open}
        >
          Create New Tag
        </Button>
      </Collapse>
      <Divider />
      <Collapse in={isCreating}>
        <Flex gap={4} align="center" pr="md">
          <ActionIcon
            radius={0}
            variant="subtle"
            color="gray"
            onClick={createPanel.close}
          >
            <IconChevronLeft size={16} />
          </ActionIcon>
          New Tag
        </Flex>
        <Divider />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
        >
          <TagForm
            form={form}
            p="xs"
            gap="xs"
            NameFieldProps={{ size: "xs" }}
            DescriptionFieldProps={{ size: "xs", rows: 2 }}
          />
          <Divider />
          <form.Subscribe
            selector={(state) => state.isValid && state.isDirty}
            children={(isValid) => (
              <Button
                radius={0}
                size="xs"
                className="transition-colors"
                fullWidth
                type="submit"
                disabled={!isValid}
              >
                Create Tag
              </Button>
            )}
          />
        </form>
      </Collapse>
    </Box>
  );
}

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
  );
}

function PriorityMenu({
  value,
  onChange,
  children,
  ...props
}: {
  value: TaskPriority | undefined | null;
  onChange: (updater: TaskPriority) => void;
  children: ReactElement;
} & Omit<MenuProps, "onChange">) {
  return (
    <Menu position="bottom-start" {...props}>
      <Menu.Target>{children}</Menu.Target>
      <Menu.Dropdown>
        {taskPriorityEnum.options.map((option) => (
          <Menu.Item
            key={option}
            color={value === option ? "primary" : undefined}
            onClick={() => onChange(option)}
          >
            {option.toUpperCase()}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}

function ComplexityMenu({
  value,
  onChange,
  children,
  ...props
}: {
  value: TaskComplexity | undefined | null;
  onChange: (updater: TaskComplexity) => void;
  children: ReactElement;
} & Omit<MenuProps, "onChange">) {
  return (
    <Menu position="bottom-start" {...props}>
      <Menu.Target>{children}</Menu.Target>
      <Menu.Dropdown>
        {taskComplexityEnum.options.map((option) => (
          <Menu.Item
            key={option}
            color={value === option ? "primary" : undefined}
            onClick={() => onChange(option)}
          >
            {option.toUpperCase()}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
