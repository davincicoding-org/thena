"use client";

import type { BoxProps, ButtonProps, MantineColor } from "@mantine/core";
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
import {
  IconArrowBigUpLinesFilled,
  IconBrain,
  IconCube,
  IconCubeOff,
  IconPencil,
} from "@tabler/icons-react";
import * as m from "motion/react-m";
import { useTranslations } from "next-intl";

import type { ProjectSelect } from "@/core/task-management";
import { ComplexityIcon } from "@/ui/task-management/metadata/ComplexityIcon";
import { cn } from "@/ui/utils";

import { PriorityIcon } from "../metadata/PriorityIcon";
import { ProjectAvatar } from "../project/ProjectAvatar";
import { taskFormOpts, withTaskForm } from "./useTaskForm";

export type TaskFormProps = {
  ref?: Ref<HTMLDivElement>;
  readOnly?: boolean;
  disableHover?: boolean;
  disableRightSection?: boolean;
  rightSection?: ReactNode;
  actions?: (
    | "assign-project"
    | "edit-priority"
    | "edit-complexity"
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
  hideProject?: boolean;
  onCreateProject?: (
    callback: (projectId: ProjectSelect["id"]) => void,
  ) => void;
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
    hideProject,
    onCreateProject,
    className,
    ...boxProps
  }) => {
    /* eslint-disable react-hooks/rules-of-hooks */
    const t = useTranslations("task");
    const [isActionsPanelOpen, actionsPanel] = useDisclosure(false);
    const actionsPanelRef = useClickOutside(() => actionsPanel.close());
    const [tab, setTab] = useState<
      "actions" | "tags" | "projects" | "priority" | "complexity"
    >("actions");

    const [isHovering, setIsHovering] = useState(false);
    const [isInputFocused, setIsInputFocused] = useState(false);
    /* eslint-enable react-hooks/rules-of-hooks */

    const isRightSectionOpen =
      !disableRightSection && !isInputFocused && isHovering;

    return (
      <Popover
        position="bottom-end"
        opened={isActionsPanelOpen}
        offset={{
          mainAxis: 0,
          crossAxis: -2,
        }}
        transitionProps={{
          transition: "scale-y",
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
            className={cn("group overflow-clip py-2 pr-0.5 pl-1.5", className)}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            {...boxProps}
          >
            <m.div
              key="left-section"
              // initial={{
              //   width: "auto",
              //   opacity: 1,
              // }}
              // animate={
              //   isInputFocused
              //     ? {
              //         width: 0,
              //         opacity: 0,
              //       }
              //     : {
              //         width: "auto",
              //         opacity: 1,
              //       }
              // }
            >
              <form.Field
                name="projectId"
                children={({ state: { value } }) => {
                  if (hideProject) return null;
                  const project = projects.find(
                    (project) => project.id === value,
                  );
                  if (!project) return null;

                  return (
                    <Tooltip label={project.title} withArrow>
                      <ProjectAvatar
                        ml={4}
                        mr={4}
                        project={project}
                        size="sm"
                      />
                    </Tooltip>
                  );
                }}
              />
            </m.div>
            <form.Field
              name="title"
              children={(field) => (
                <TextInput
                  size="md"
                  flex={1}
                  readOnly={readOnly}
                  classNames={{
                    input: cn(
                      "h-8! min-h-0! truncate !bg-transparent px-1! transition-colors not-focus:border-transparent! read-only:border-transparent!",
                      {
                        "group-hover:not-focus:!bg-white/5": !disableHover,
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

            <m.div
              className="mr-2 flex items-center gap-1 overflow-hidden"
              animate={
                isInputFocused
                  ? {
                      width: 0,
                      opacity: 0,
                    }
                  : {
                      width: "auto",
                      opacity: 1,
                    }
              }
            >
              <form.Field
                name="complexity"
                children={(complexityField) => {
                  if (complexityField.state.value === "0") return null;
                  return (
                    <Tooltip
                      label={t(
                        `complexity.labels.${complexityField.state.value}`,
                      )}
                      withArrow
                      position="bottom"
                      transitionProps={{
                        transition: "scale-y",
                      }}
                      py={1}
                      px={6}
                      classNames={{
                        tooltip: "text-xs",
                      }}
                    >
                      <ComplexityIcon
                        className="last:mx-2"
                        complexity={complexityField.state.value}
                        size="sm"
                      />
                    </Tooltip>
                  );
                }}
              />
              <form.Field
                name="priority"
                children={(priorityField) => {
                  if (priorityField.state.value === "0") return null;
                  return (
                    <Tooltip
                      label={t(`priority.labels.${priorityField.state.value}`)}
                      withArrow
                      position="bottom"
                      transitionProps={{
                        transition: "scale-y",
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
                      />
                    </Tooltip>
                  );
                }}
              />
            </m.div>
            {!readOnly && (
              <m.div
                key="task-actions"
                layoutId="right-section"
                className="flex empty:hidden"
                onFocus={() => setIsHovering(true)}
                onBlur={() => setIsHovering(false)}
                animate={
                  isRightSectionOpen
                    ? {
                        width: "auto",
                        opacity: 1,
                      }
                    : {
                        width: 0,
                        opacity: 0,
                      }
                }
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
              </m.div>
            )}
          </Flex>
        </Popover.Target>

        <Popover.Dropdown
          p={0}
          ref={actionsPanelRef}
          className="!overflow-clip !rounded-t-none"
        >
          <Tabs value={tab}>
            <Tabs.Panel value="actions">
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
                    <Button
                      key="edit-priority"
                      justify="flex-start"
                      leftSection={<IconArrowBigUpLinesFilled size={16} />}
                      fullWidth
                      radius={0}
                      color="gray"
                      variant="subtle"
                      onClick={() => setTab("priority")}
                    >
                      Priority
                    </Button>
                  );

                if (action === "edit-complexity")
                  return (
                    <Button
                      key="edit-complexity"
                      justify="flex-start"
                      leftSection={<IconBrain size={16} />}
                      fullWidth
                      radius={0}
                      color="gray"
                      variant="subtle"
                      onClick={() => setTab("complexity")}
                    >
                      Complexity
                    </Button>
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
              <form.AppField
                name="projectId"
                children={(field) => (
                  <field.ProjectPicker
                    projects={projects}
                    onClose={() => setTab("actions")}
                    onClosePanel={() => actionsPanel.close()}
                    onCreate={(callback) => {
                      actionsPanel.close();
                      onCreateProject?.(callback);
                    }}
                  />
                )}
              />
            </Tabs.Panel>

            <Tabs.Panel value="priority">
              <form.AppField
                name="priority"
                children={(field) => (
                  <field.PriorityPicker
                    onClose={() => setTab("actions")}
                    onClosePanel={() => actionsPanel.close()}
                  />
                )}
              />
            </Tabs.Panel>
            <Tabs.Panel value="complexity">
              <form.AppField
                name="complexity"
                children={(field) => (
                  <field.ComplexityPicker
                    onClose={() => setTab("actions")}
                    onClosePanel={() => actionsPanel.close()}
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
