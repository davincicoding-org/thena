import {
  Fragment,
  FunctionComponent,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import {
  ActionIcon,
  Box,
  Button,
  Collapse,
  Combobox,
  Divider,
  Flex,
  Group,
  Menu,
  MenuProps,
  Paper,
  PaperProps,
  Popover,
  ScrollArea,
  Text,
  TextInput,
  useCombobox,
} from "@mantine/core";
import { useDisclosure, useInputState } from "@mantine/hooks";
import {
  IconDotsVertical,
  IconInfoCircle,
  IconPlus,
  IconX,
} from "@tabler/icons-react";
import { Updater, useForm } from "@tanstack/react-form";
import { nanoid } from "nanoid";

import {
  baseTaskSchema,
  Project,
  Subtask,
  Tag,
  TaskComplexity,
  taskComplexityEnum,
  TaskPriority,
  taskPriorityEnum,
} from "@/core/task-management";
import {
  ComplexityBadge,
  PriorityBadge,
  ProjectAvatar,
  TagBadge,
} from "@/ui/task-management";
import { cn } from "@/ui/utils";

import { taskFormOpts, withTaskForm } from "./useTaskForm";

type TaskActionsComponent = FunctionComponent<{ defaultActions: ReactNode }>;

export type TaskFormProps = {
  containerProps?: PaperProps;
  projects: Project[];
  onAssignToNewProject: (onCreated: (project: Project) => void) => void;
  tags: Tag[];
  onAttachNewTag: (onCreated: (project: Tag) => void) => void;
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
    tags,
    onAssignToNewProject,
    onAttachNewTag,
    readOnly,
    TaskActions = (({ defaultActions }) =>
      defaultActions) as TaskActionsComponent,
  }) => {
    const [isAddingSubtask, subtaskAdder] = useDisclosure(false);

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
          onClick={subtaskAdder.open}
        >
          Add Subtasks
        </Button>
        <Divider />
        <form.Field
          name="projectId"
          children={(projectField) => (
            <ProjectAssigner
              value={projectField.state.value}
              projects={projects}
              onChange={projectField.handleChange}
              onCreate={() =>
                onAssignToNewProject((project) =>
                  projectField.handleChange(project.id),
                )
              }
            />
          )}
        />
        <form.Field
          name="tags"
          children={(tagField) => (
            <TagSelector
              value={tagField.state.value}
              tags={tags}
              onChange={tagField.handleChange}
            />
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
        <Popover position="bottom-end" disabled={isAddingSubtask}>
          <TaskHeader
            form={form}
            readOnly={readOnly}
            resolveProject={resolveProject}
            resolveTag={resolveTag}
            ActionsTarget={Popover.Target}
          />

          <Popover.Dropdown p={0}>
            <TaskActions defaultActions={defaultActions} />
          </Popover.Dropdown>
        </Popover>
        <form.Field
          name="subtasks"
          mode="array"
          children={(subtasksField) => {
            const handleAddSubtask = (values: Omit<Subtask, "id">) => {
              subtasksField.pushValue({
                id: generateSubtaskId(
                  subtasksField.state.value?.map((subtask) => subtask.id),
                ),
                ...values,
              });
            };
            return (
              <>
                {subtasksField.state.value?.map((subtask, index) => (
                  <Fragment key={subtask.id}>
                    <Divider />
                    <SubtaskForm
                      form={form}
                      index={index}
                      tags={tags}
                      onRemove={() => subtasksField.removeValue(index)}
                    />
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

// ------- Subcomponents -------

type TaskHeaderProps = Pick<TaskFormProps, "readOnly"> & {
  resolveProject: (projectId: Project["id"]) => Project | undefined;
  resolveTag: (tagId: Tag["id"]) => Tag | undefined;
  ActionsTarget: FunctionComponent<{ children: ReactElement }>;
};

const TaskHeader = withTaskForm({
  ...taskFormOpts,
  props: {} as TaskHeaderProps,
  render: ({ form, readOnly, resolveProject, resolveTag, ActionsTarget }) => {
    return (
      <Box bg="dark.6" className="group">
        <Flex align="center" p={4}>
          <form.Field
            name="projectId"
            children={({ state: { value } }) => {
              if (value === undefined) return null;
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
                        form.handleSubmit();
                        e.currentTarget.blur();
                      }
                    }}
                  />
                )}
              />
              <form.Field
                name="priority"
                children={(priorityField) => {
                  if (priorityField.state.value === undefined) return null;
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
                  if (complexityField.state.value === undefined) return null;
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
                    // className="opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                    variant="transparent"
                    color="gray"
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

type SubtaskFormProps = Pick<TaskFormProps, "readOnly"> & {
  index: number;
  tags: Tag[];
  onRemove: () => void;
};

const SubtaskForm = withTaskForm({
  ...taskFormOpts,
  props: {} as SubtaskFormProps,
  render: ({ form, readOnly, index, tags, onRemove }) => {
    return (
      <Popover
        position="bottom-end"
        offset={{ mainAxis: 4, crossAxis: 12 }}
        withinPortal={false}
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
                    "h-7! min-h-0! truncate bg-transparent! px-1.5! not-focus:border-transparent! read-only:border-transparent!",
                  ),
                }}
                value={subField.state.value}
                readOnly={readOnly}
                onChange={(e) => subField.handleChange(e.target.value)}
                error={subField.state.meta.errors.length > 0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    form.handleSubmit();
                    e.currentTarget.blur();
                  }
                }}
              />
            )}
          />

          <form.Field
            name={`subtasks[${index}].priority`}
            children={(priorityField) => {
              if (priorityField.state.value === undefined) return null;
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
              if (complexityField.state.value === undefined) return null;
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
                // className="opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                variant="transparent"
                color="gray"
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

        <Popover.Dropdown p={0}>
          <form.Field
            name={`subtasks[${index}].tags`}
            children={(tagsField) => (
              <TagSelector
                value={tagsField.state.value}
                tags={tags}
                onChange={tagsField.handleChange}
              />
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
        </Popover.Dropdown>
      </Popover>
    );
  },
});

function ProjectAssigner({
  value,
  projects,
  onChange,
  onCreate,
}: {
  value: Project["id"] | undefined;
  projects: Project[];
  onChange: (updater: Updater<Project["id"] | undefined>) => void;
  onCreate: () => void;
}) {
  const [search, setSearch] = useInputState("");
  const projectsCombobox = useCombobox({
    onDropdownClose: () => {
      projectsCombobox.resetSelectedOption();
      projectsCombobox.searchRef.current?.blur();
      setSearch("");
    },
    onDropdownOpen: () => {
      projectsCombobox.focusSearchInput();
    },
  });

  const limit = 3;
  const allOptions = projects
    .filter((project) =>
      project.name.toLowerCase().includes(search.toLowerCase().trim()),
    )
    .map((project) => (
      <Combobox.Option value={project.id} key={project.id}>
        <Group gap="xs" wrap="nowrap">
          <ProjectAvatar
            project={project}
            size="sm"
            tooltipProps={{ disabled: true }}
          />
          <Text truncate>{project.name}</Text>
        </Group>
      </Combobox.Option>
    ));

  const displayOptions = allOptions.slice(0, limit);

  const remainingOptionsCount = allOptions.length - displayOptions.length;

  return (
    <Combobox
      store={projectsCombobox}
      width={200}
      onOptionSubmit={(val) => {
        onChange(val);
        projectsCombobox.closeDropdown();
      }}
    >
      <Combobox.Target withAriaAttributes={false}>
        {value ? (
          <Button
            variant="subtle"
            justify="flex-start"
            fullWidth
            radius={0}
            color="gray"
            onClick={() => onChange(undefined)}
          >
            Unassign from Project
          </Button>
        ) : (
          <Button
            variant="subtle"
            justify="flex-start"
            fullWidth
            radius={0}
            color="gray"
            onClick={() => projectsCombobox.toggleDropdown()}
          >
            Assign to Project
          </Button>
        )}
      </Combobox.Target>

      <Combobox.Dropdown onMouseLeave={() => projectsCombobox.closeDropdown()}>
        <Combobox.Search
          value={search}
          onChange={setSearch}
          placeholder="Search Project"
        />
        <Combobox.Options>
          {displayOptions.length > 0 ? (
            displayOptions
          ) : (
            <Combobox.Empty>Nothing found</Combobox.Empty>
          )}
        </Combobox.Options>
        {remainingOptionsCount > 0 && (
          <Divider
            label={
              remainingOptionsCount === 1
                ? "One more project"
                : `${remainingOptionsCount} more projects`
            }
          />
        )}
        <Button variant="subtle" fullWidth onClick={onCreate}>
          Create New Project
        </Button>
      </Combobox.Dropdown>
    </Combobox>
  );
}

function TagSelector({
  value,
  tags,
  onChange,
}: {
  value: Tag["id"][] | undefined;
  tags: Tag[];
  onChange: (updater: Updater<Tag["id"][] | undefined>) => void;
}) {
  const [search, setSearch] = useInputState("");
  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      combobox.searchRef.current?.blur();
      setSearch("");
    },
    onDropdownOpen: () => {
      combobox.focusSearchInput();
    },
  });

  const selectedOptions = tags
    .filter((tag) => value?.includes(tag.id))
    .map((tag) => (
      <Combobox.Option value={tag.id} key={tag.id} my={2} selected>
        <TagBadge tag={tag} />
      </Combobox.Option>
    ));

  const additionalOptions = tags
    .filter((tag) => {
      if (value?.includes(tag.id)) return false;
      return tag.name.toLowerCase().includes(search.toLowerCase().trim());
    })
    .map((tag) => (
      <Combobox.Option value={tag.id} key={tag.id} my={2} color="blue">
        <TagBadge tag={tag} />
      </Combobox.Option>
    ))
    .slice(0, 5);

  const handleValueSelect = (val: string) => {
    onChange((current = []) => {
      const next = current.includes(val)
        ? current.filter((v) => v !== val)
        : [...current, val];
      if (next.length === 0) return undefined;
      return next;
    });
  };

  return (
    <Combobox store={combobox} width={150} onOptionSubmit={handleValueSelect}>
      <Combobox.Target withAriaAttributes={false}>
        <Button
          variant="subtle"
          justify="flex-start"
          fullWidth
          radius={0}
          color="gray"
          onClick={() => combobox.toggleDropdown()}
        >
          {value ? "Manage Tags" : "Add Tags"}
        </Button>
      </Combobox.Target>

      <Combobox.Dropdown onMouseLeave={() => combobox.closeDropdown()}>
        {selectedOptions.length > 0 && (
          <>
            <Combobox.Options mb="xs">{selectedOptions}</Combobox.Options>
          </>
        )}

        <Combobox.Search
          value={search}
          onChange={setSearch}
          placeholder="Search Tag"
        />
        <Combobox.Options>
          {additionalOptions.length > 0 ? (
            additionalOptions
          ) : (
            <Combobox.Empty>Nothing found</Combobox.Empty>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
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

function PriorityMenu({
  value,
  onChange,
  children,
  ...props
}: {
  value: TaskPriority | undefined;
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
  value: TaskComplexity | undefined;
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

// ------- Utilities -------

export const generateSubtaskId = (
  existingIds: string[] = [],
): Subtask["id"] => {
  const id = nanoid(4);
  if (existingIds.includes(id)) return generateSubtaskId(existingIds);
  return id;
};
