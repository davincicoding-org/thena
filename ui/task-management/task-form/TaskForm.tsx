import type { UseMutateFunction } from "@tanstack/react-query";
import type { FunctionComponent, ReactNode } from "react";
import { useState } from "react";
import {
  ActionIcon,
  Button,
  Divider,
  Flex,
  Popover,
  Tabs,
  TextInput,
} from "@mantine/core";
import { useClickOutside, useDisclosure } from "@mantine/hooks";
import {
  IconClipboardOff,
  IconClipboardText,
  IconDotsVertical,
  IconPlus,
} from "@tabler/icons-react";

import type {
  ProjectInsertExtended,
  ProjectSelect,
} from "@/core/task-management";
import {
  ComplexityBadge,
  PriorityBadge,
  ProjectAvatar,
} from "@/ui/task-management";
import { cn } from "@/ui/utils";

import { ProjectPicker } from "./ProjectPicker";
import { taskFormOpts, withTaskForm } from "./useTaskForm";

type TaskActionsComponent = FunctionComponent<{
  defaultActions: ReactNode;
  closeMenu: () => void;
}>;

// MARK: Component

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type TaskFormProps = {
  onAddSubtask?: () => void;
  projects: ProjectSelect[];
  onCreateProject?: UseMutateFunction<
    ProjectSelect | undefined,
    Error,
    ProjectInsertExtended
  >;
  readOnly?: boolean;
  TaskActions?: TaskActionsComponent;
};

export const TaskForm = withTaskForm({
  ...taskFormOpts,
  props: {} as TaskFormProps,
  render: ({
    form,
    onAddSubtask,
    projects,
    onCreateProject,
    readOnly,
    TaskActions = (({ defaultActions }) =>
      defaultActions) as TaskActionsComponent,
  }) => {
    /* eslint-disable react-hooks/rules-of-hooks */
    const [isActionsPanelOpen, actionsPanel] = useDisclosure(false);
    const actionsPanelRef = useClickOutside(() => actionsPanel.close());
    const [tab, setTab] = useState<"actions" | "tags" | "projects">("actions");
    /* eslint-enable react-hooks/rules-of-hooks */

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
            onAddSubtask?.();
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
        <Divider />
        <form.AppField
          name="priority"
          children={(field) => <field.PriorityPicker />}
        />
        <form.AppField
          name="complexity"
          children={(field) => <field.ComplexityPicker />}
        />
      </>
    );

    return (
      <Popover
        position="bottom-end"
        opened={isActionsPanelOpen}
        onClose={() => {
          setTimeout(() => {
            setTab("actions");
          }, 300);
        }}
      >
        <Flex align="center" p={4} bg="dark.6">
          <form.Field
            name="projectId"
            children={({ state: { value } }) => {
              const project = projects.find((project) => project.uid === value);
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
                    "mr-auto h-8! min-h-0! truncate px-1.5! not-focus:border-transparent! read-only:border-transparent!",
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
                <PriorityBadge
                  priority={priorityField.state.value}
                  className="cursor-pointer!"
                  size="xs"
                />
              );
            }}
          />
          <form.Field
            name="complexity"
            children={(complexityField) => {
              if (!complexityField.state.value) return null;
              if (complexityField.state.value === "default") return null;

              return (
                <ComplexityBadge
                  className="cursor-pointer!"
                  complexity={complexityField.state.value}
                  size="xs"
                />
              );
            }}
          />
          {!readOnly && (
            <Popover.Target>
              <ActionIcon
                aria-label="Task Actions"
                className="disabled:cursor-default!"
                disabled={isActionsPanelOpen}
                variant="transparent"
                color="gray"
                onClick={actionsPanel.open}
              >
                <IconDotsVertical size={16} />
              </ActionIcon>
            </Popover.Target>
          )}
        </Flex>

        <Popover.Dropdown p={0} ref={actionsPanelRef} className="overflow-clip">
          <Tabs value={tab}>
            <Tabs.Panel value="actions">
              <TaskActions
                defaultActions={defaultActions}
                closeMenu={actionsPanel.close}
              />
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
