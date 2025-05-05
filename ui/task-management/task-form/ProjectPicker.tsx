import {
  ActionIcon,
  Box,
  Button,
  Collapse,
  Divider,
  Flex,
  NavLink,
  ScrollArea,
  TextInput,
} from "@mantine/core";
import { useDisclosure, useInputState } from "@mantine/hooks";
import { IconChevronLeft, IconX } from "@tabler/icons-react";

import type {
  ProjectInsertExtended,
  ProjectSelect,
  TaskInsert,
} from "@/core/task-management";
import { cn } from "@/ui/utils";

import { ProjectAvatar } from "../project/ProjectAvatar";
import { ProjectForm } from "../project/ProjectForm";
import { projectFormOpts, useProjectForm } from "../project/useProjectForm";

export interface ProjectPickerProps {
  projects: ProjectSelect[];
  onChange: (value: NonNullable<TaskInsert["projectId"]>) => void;
  onCreate?: (
    input: ProjectInsertExtended,
    callback: (project: ProjectSelect | undefined) => void,
  ) => void;
  onClose: () => void;
}

export function ProjectPicker({
  projects,
  onChange,
  onCreate,
  onClose,
}: ProjectPickerProps) {
  const [isCreating, createPanel] = useDisclosure(false);
  const [search, setSearch] = useInputState("");

  const form = useProjectForm({
    ...projectFormOpts,
    onSubmit: ({ value }) => {
      createPanel.close();
      onCreate?.(value, (project) => {
        if (!project) return;
        form.reset();
        onChange(project.uid);
      });
    },
  });

  const trimmedSearch = search.trim();
  const filteredOptions = projects.filter((project) => {
    if (!trimmedSearch) return true;
    return project.title.toLowerCase().includes(trimmedSearch.toLowerCase());
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
              key={project.uid}
              component="button"
              className="py-1!"
              color="gray"
              onClick={() => onChange(project.uid)}
              label={project.title}
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
