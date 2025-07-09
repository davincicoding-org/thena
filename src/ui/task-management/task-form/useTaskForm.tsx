import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Flex,
  NavLink,
  ScrollArea,
  Text,
  TextInput,
} from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { IconChevronLeft, IconPlus, IconX } from "@tabler/icons-react";
import {
  createFormHook,
  createFormHookContexts,
  formOptions,
} from "@tanstack/react-form";
import { useTranslations } from "next-intl";

import type { ProjectSelect, TaskFormValues } from "@/core/task-management";
import { taskFormSchema } from "@/core/task-management";
import { ProjectAvatar } from "@/ui/task-management/project/ProjectAvatar";
import { cn } from "@/ui/utils";

export const { fieldContext, formContext, useFieldContext } =
  createFormHookContexts();

export const { useAppForm: useTaskForm, withForm: withTaskForm } =
  createFormHook({
    fieldComponents: {
      PriorityPicker: ({
        onClose,
        onClosePanel,
      }: {
        onClose: () => void;
        onClosePanel: () => void;
      }) => {
        const field = useFieldContext<TaskFormValues["priority"]>();
        const t = useTranslations("task");

        const handleClickOption = (value: TaskFormValues["priority"]) => {
          onClosePanel();
          field.handleChange(value);
        };

        return (
          <Box className="w-48 overflow-clip rounded-[0.175rem]">
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
                <Text>Priority</Text>
              </Flex>
              <Divider />
            </Box>
            <div className="bg-black/30">
              <NavLink
                component="button"
                className="py-1!"
                active={field.state.value === "2"}
                onClick={() => handleClickOption("2")}
                label={t("priority.options.2")}
              />
              <NavLink
                component="button"
                active={field.state.value === "1"}
                onClick={() => handleClickOption("1")}
                label={t("priority.options.1")}
              />
              <NavLink
                component="button"
                active={field.state.value === "0"}
                onClick={() => handleClickOption("0")}
                label={t("priority.options.0")}
              />
              <NavLink
                component="button"
                active={field.state.value === "-1"}
                onClick={() => handleClickOption("-1")}
                label={t("priority.options.-1")}
              />
            </div>
          </Box>
        );
      },
      ComplexityPicker: ({
        onClose,
        onClosePanel,
      }: {
        onClose: () => void;
        onClosePanel: () => void;
      }) => {
        const field = useFieldContext<TaskFormValues["complexity"]>();
        const t = useTranslations("task");

        const handleClickOption = (value: TaskFormValues["complexity"]) => {
          onClosePanel();
          field.handleChange(value);
        };

        return (
          <Box className="w-48 overflow-clip rounded-[0.175rem]">
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
                <Text>Complexity</Text>
              </Flex>
              <Divider />
            </Box>
            <div className="bg-black/30">
              <NavLink
                component="button"
                active={field.state.value === "1"}
                onClick={() => handleClickOption("1")}
                label={t("complexity.options.1")}
              />
              <NavLink
                component="button"
                active={field.state.value === "0"}
                onClick={() => handleClickOption("0")}
                label={t("complexity.options.0")}
              />
              <NavLink
                component="button"
                active={field.state.value === "-1"}
                onClick={() => handleClickOption("-1")}
                label={t("complexity.options.-1")}
              />
            </div>
          </Box>
        );
      },
      ProjectPicker: ({
        projects,
        onClosePanel,
        onCreate,
        onClose,
      }: {
        projects: Pick<ProjectSelect, "id" | "title" | "image" | "color">[];
        onClosePanel: () => void;
        onCreate?: (callback: (projectId: ProjectSelect["id"]) => void) => void;
        onClose: () => void;
      }) => {
        const field = useFieldContext<TaskFormValues["projectId"]>();
        const handleSelect = (projectId: ProjectSelect["id"]) => {
          onClosePanel();
          field.handleChange(projectId);
        };

        const handleCreate = () => {
          onCreate?.((projectId) => {
            field.handleChange(projectId);
          });
          onClosePanel();
        };

        const [search, setSearch] = useInputState("");

        const trimmedSearch = search.trim();
        const filteredOptions = projects.filter((project) => {
          if (!trimmedSearch) return true;
          return project.title
            .toLowerCase()
            .includes(trimmedSearch.toLowerCase());
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
                  onClick={() => handleSelect(project.id)}
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
                  onClick={() => handleCreate()}
                >
                  Create Project
                </Button>
              </div>
            )}
          </Box>
        );
      },
    },
    formComponents: {},
    fieldContext,
    formContext,
  });

export const taskFormOpts = formOptions({
  defaultValues: {
    title: "",
  } as TaskFormValues,
  validators: {
    onChange: taskFormSchema,
  },
});
