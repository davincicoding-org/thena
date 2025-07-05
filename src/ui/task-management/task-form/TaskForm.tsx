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
import { useClickOutside, useDisclosure, useElementSize } from "@mantine/hooks";
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
  disableHover?: boolean;
  disableRightSection?: boolean;
  rightSection?: ReactNode;
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
} & Simplify<BoxProps>;

export const TaskForm = withTaskForm({
  ...taskFormOpts,
  props: {} as TaskFormProps,
  render: ({
    form,
    readOnly,
    ref,
    disableHover,
    rightSection,
    disableRightSection,
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
    const { ref: rightSectionRef, width: rightSectionWidth } = useElementSize();
    const [isHovering, setIsHovering] = useState(false);
    const [isInputFocused, setIsInputFocused] = useState(false);
    /* eslint-enable react-hooks/rules-of-hooks */

    const isRightSectionOpen =
      !disableRightSection && !isInputFocused && isHovering;

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
            ref={ref}
            className={cn("group overflow-clip py-1 pl-1.5", className)}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
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
                      className="mr-1.5 ml-0.5"
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
                    root: "mr-1.5",
                    input: cn(
                      "h-8! min-h-0! truncate !bg-transparent px-1! not-focus:border-transparent! read-only:border-transparent!",
                      {
                        "group-hover:not-focus:!border-current": !disableHover,
                      },
                    ),
                  }}
                  placeholder="Title"
                  value={field.state.value}
                  error={field.state.meta.errors.length > 0}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
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
              <div
                ref={rightSectionRef}
                className={cn("flex transition-all duration-200 empty:hidden", {
                  "focus-within:!mr-0 focus-within:!opacity-100":
                    !disableRightSection,
                  "opacity-0": !isRightSectionOpen,
                })}
                style={{
                  marginRight: isRightSectionOpen ? 0 : -rightSectionWidth,
                }}
              >
                {actions.length > 0 && (
                  <ActionIcon
                    aria-label="Task Actions"
                    className="mr-1 !h-8 !w-8 !outline-offset-0"
                    variant="light"
                    color="gray"
                    onClick={actionsPanel.open}
                  >
                    <IconPencil size={16} />
                  </ActionIcon>
                )}
                {rightSection}
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
