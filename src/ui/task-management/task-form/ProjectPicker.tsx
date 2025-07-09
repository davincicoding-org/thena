import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Flex,
  NavLink,
  ScrollArea,
  TextInput,
} from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { IconChevronLeft, IconPlus, IconX } from "@tabler/icons-react";

import type { ProjectSelect, TaskFormValues } from "@/core/task-management";
import { cn } from "@/ui/utils";

import { ProjectAvatar } from "../project/ProjectAvatar";

export interface ProjectPickerProps {
  projects: Pick<ProjectSelect, "id" | "title" | "image" | "color">[];
  onChange: (value: NonNullable<TaskFormValues["projectId"]>) => void;
  onCreate?: () => void;
  onClose: () => void;
}

export function ProjectPicker({
  projects,
  onChange,
  onCreate,
  onClose,
}: ProjectPickerProps) {
  const [search, setSearch] = useInputState("");

  const trimmedSearch = search.trim();
  const filteredOptions = projects.filter((project) => {
    if (!trimmedSearch) return true;
    return project.title.toLowerCase().includes(trimmedSearch.toLowerCase());
  });

  return (
    <Box className="w-48 overflow-clip rounded-[0.175rem]">
      <ScrollArea
        scrollbars="y"
        className="h-40"
        classNames={{
          scrollbar: cn("pt-10!"),
        }}
      >
        <Box className="sticky top-0 z-10 backdrop-blur-xs">
          <Flex align="center" className="gap-1.5 pr-1.5">
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
            color="gray"
            onClick={() => onChange(project.id)}
            label={project.title}
            leftSection={<ProjectAvatar project={project} size="sm" />}
          />
        ))}
      </ScrollArea>
      {onCreate && (
        <div className="p-1">
          <Button
            variant="light"
            fullWidth
            size="xs"
            leftSection={<IconPlus size={16} />}
            onClick={onCreate}
          >
            Create Project
          </Button>
        </div>
      )}
    </Box>
  );
}
