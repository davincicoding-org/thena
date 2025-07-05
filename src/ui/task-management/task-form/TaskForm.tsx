import type { BoxProps, ButtonProps, MantineColor } from "@mantine/core";
import type { UseMutateFunction } from "@tanstack/react-query";
import type { ReactElement, ReactNode, Ref } from "react";
import type { Simplify } from "type-fest";
import { cloneElement, isValidElement, useState } from "react";
import {
  ActionIcon,
  Button,
  Divider,
  Flex,
  Popover,
  Tabs,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useClickOutside, useDisclosure } from "@mantine/hooks";
import { IconCube, IconCubeOff, IconPencil } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

import type { ProjectInput, ProjectSelect } from "@/core/task-management";
import { cn } from "@/ui/utils";

import { PriorityIcon } from "../metadata/PriorityIcon";
import { ProjectAvatar } from "../project/ProjectAvatar";
import { ProjectPicker } from "./ProjectPicker";
import { taskFormOpts, withTaskForm } from "./useTaskForm";

// MARK: Component

export type TaskFormProps = {
  ref?: Ref<HTMLDivElement>;
  readOnly?: boolean;
  actions?: (
    | "assign-project"
    | "edit-priority"
    | "-"
    | {
        name: string;
        icon?: ReactNode;
        label: ReactNode;
        variant?: ButtonProps["variant"];
        color?: MantineColor;
        onClick: () => void;
      }
    | ReactElement<{ onCloseActions?: () => void }>
    | null
  )[];
  projects: ProjectSelect[];
  onCreateProject?: UseMutateFunction<
    ProjectSelect | undefined,
    Error,
    ProjectInput
  >;
  dragHandle?: ReactNode;
} & Simplify<BoxProps>;

export const TaskForm = withTaskForm({
  ...taskFormOpts,
  props: {} as TaskFormProps,
  render: ({
    form,
    readOnly,
    dragHandle,
    ref,
    actions = [],
    projects,
    onCreateProject,
    className,
    ...boxProps
  }) => {
    /* eslint-disable react-hooks/rules-of-hooks */
    const t = useTranslations("task");
    const [isActionsPanelOpen, actionsPanel] = useDisclosure(false);
    const actionsPanelRef = useClickOutside(() => actionsPanel.close());
    const [tab, setTab] = useState<"actions" | "tags" | "projects">("actions");
    /* eslint-enable react-hooks/rules-of-hooks */

    return (
      <Popover
        position="right-start"
        withArrow
        arrowPosition="center"
        opened={isActionsPanelOpen}
        offset={{
          mainAxis: 8,
        }}
        onClose={() => {
          setTimeout(() => {
            setTab("actions");
          }, 300);
        }}
      >
        <Popover.Target>
          <Flex
            align="center"
            p={4}
            ref={ref}
            className={cn("group !gap-1.5", className)}
            {...boxProps}
          >
            <form.Field
              name="priority"
              children={(priorityField) => {
                if (!priorityField.state.value) return null;

                return (
                  <Tooltip
                    label={t(`priority.labels.${priorityField.state.value}`)}
                    withArrow
                    position="bottom-start"
                    transitionProps={{
                      transition: "pop-top-left",
                    }}
                    py={1}
                    px={6}
                    classNames={{
                      tooltip: "text-xs",
                    }}
                  >
                    <PriorityIcon
                      priority={priorityField.state.value}
                      size="xs"
                      className="ml-1"
                    />
                  </Tooltip>
                );
              }}
            />

            <form.Field
              name="projectId"
              children={({ state: { value } }) => {
                const project = projects.find(
                  (project) => project.id === value,
                );
                if (!project) return null;

                return (
                  <ProjectAvatar ml={4} mr={4} project={project} size="sm" />
                );
              }}
            />
            <form.Field
              name="title"
              children={(field) => (
                <TextInput
                  size="md"
                  flex={1}
                  readOnly={readOnly}
                  classNames={{
                    input: cn(
                      "mr-auto h-8! min-h-0! truncate !bg-transparent px-1! not-focus:border-transparent! group-hover:not-focus:!border-[var(--paper-border-color)] read-only:border-transparent!",
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

            {!readOnly && (
              <div className="flex items-center opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 empty:hidden">
                {actions.length > 0 && (
                  <ActionIcon
                    aria-label="Task Actions"
                    className="disabled:cursor-default!"
                    disabled={isActionsPanelOpen}
                    variant="subtle"
                    color="gray"
                    onClick={actionsPanel.open}
                  >
                    <IconPencil size={16} />
                  </ActionIcon>
                )}
                {dragHandle}
              </div>
            )}
          </Flex>
        </Popover.Target>

        <Popover.Dropdown p={0} ref={actionsPanelRef}>
          <Tabs value={tab}>
            <Tabs.Panel
              value="actions"
              className="*:first:!rounded-t-[0.175rem] *:last:!rounded-b-[0.175rem]"
            >
              {actions.map((action, index) => {
                if (!action) return null;

                if (action === "-") return <Divider key={`divider-${index}`} />;

                if (action === "assign-project")
                  return (
                    <form.Field
                      key="assign-project"
                      name="projectId"
                      children={(projectField) => {
                        if (projectField.state.value)
                          return (
                            <Button
                              variant="subtle"
                              justify="flex-start"
                              leftSection={<IconCubeOff size={16} />}
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
                            leftSection={<IconCube size={16} />}
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
                  );

                if (action === "edit-priority")
                  return (
                    <form.AppField
                      key="edit-priority"
                      name="priority"
                      children={(field) => <field.PriorityPicker />}
                    />
                  );

                if (isValidElement(action))
                  return cloneElement(action, {
                    onCloseActions: actionsPanel.close,
                  });

                return (
                  <Button
                    key={action.name}
                    variant={action.variant ?? "subtle"}
                    justify="flex-start"
                    fullWidth
                    radius={0}
                    color={action.color ?? "gray"}
                    leftSection={action.icon}
                    onClick={() => {
                      action.onClick();
                      actionsPanel.close();
                    }}
                  >
                    {action.label}
                  </Button>
                );
              })}
            </Tabs.Panel>
            <Tabs.Panel value="projects">
              <form.Field
                name="projectId"
                children={(projectField) => (
                  <ProjectPicker
                    projects={projects}
                    onClose={() => setTab("actions")}
                    onChange={(projectId) => {
                      projectField.handleChange(projectId);
                      actionsPanel.close();
                    }}
                    onCreate={(project, callback) => {
                      onCreateProject?.(project, {
                        onSuccess: callback,
                      });
                      actionsPanel.close();
                    }}
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
