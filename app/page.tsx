"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  AppShell,
  Box,
  Button,
  Card,
  Center,
  Collapse,
  Divider,
  Flex,
  Modal,
  Space,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";

import type { TaskInput } from "@/core/task-management";
import { SidePanel } from "@/ui/components/SidePanel";
import { IntelligenceTile } from "@/ui/intelligence";
import {
  Backlog,
  ProjectCreator,
  ProjectsTile,
  taskFormOpts,
  useBacklog,
  useBacklogQueryOptions,
  useProjects,
  useTags,
  useTaskForm,
} from "@/ui/task-management";

export default function HomePage() {
  const { projects, createProject, loading: loadingProjects } = useProjects();
  const [isCreatingProject, projectCreatorModal] = useDisclosure();

  const { tasks } = useBacklog();
  const taskCount = tasks.reduce(
    (acc, task) => acc + (task.subtasks?.length ?? 1),
    0,
  );

  const [isBacklogPanelOpen, backlogPanel] = useDisclosure();
  return (
    <AppShell.Main display="grid">
      <Center>
        <Stack gap="lg" className="w-fit" maw={500} p="lg">
          <IntelligenceTile />
          <Button
            size="xl"
            radius="md"
            fullWidth
            component={Link}
            href="/session"
          >
            Focus Session
          </Button>

          <Divider />

          <Flex gap="md">
            <Card radius="md" shadow="sm">
              <Text className="text-2xl!" my="auto">
                {taskCount === 0 && "No Tasks"}
                {taskCount === 1 && "1 Task"}
                {taskCount > 1 &&
                  `${taskCount > 100 ? "100+" : taskCount} Tasks`}
              </Text>
              <Space h="xs" />
              <Button variant="light" fullWidth onClick={backlogPanel.open}>
                Open Backlog
              </Button>
            </Card>
            <ProjectsTile
              flex={1}
              loading={loadingProjects}
              items={projects}
              onCreate={projectCreatorModal.open}
            />
          </Flex>
        </Stack>
      </Center>

      <Modal
        opened={isCreatingProject}
        centered
        radius="md"
        classNames={{
          body: "p-0!",
        }}
        transitionProps={{ transition: "pop" }}
        overlayProps={{
          className: "backdrop-blur-xs",
        }}
        withCloseButton={false}
        onClose={projectCreatorModal.close}
      >
        <ProjectCreator
          onCreate={(project) => {
            createProject(project);
            projectCreatorModal.close();
          }}
        />
      </Modal>

      <BacklogPanel isOpen={isBacklogPanelOpen} onClose={backlogPanel.close} />
    </AppShell.Main>
  );
}

function BacklogPanel({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const backlog = useBacklog();
  const { projects, createProject } = useProjects();
  const { tags, createTag } = useTags();

  const { filters, filterTasks, updateFilters, sort, sortFn, updateSort } =
    useBacklogQueryOptions();

  const tasks = filterTasks(backlog.tasks).sort(sortFn);

  // ------- Task Adder -------

  return (
    // TODO: Make side panel close on escape. Setting closeOnEscape={false} is a workaround, because pressing escape on the task adder form would the side panel.
    <SidePanel
      opened={isOpen}
      size="sm"
      closeOnEscape={false}
      onClose={onClose}
    >
      <Flex className="h-full" direction="column">
        <Backlog
          mode="edit"
          flex={1}
          tasks={tasks}
          className="min-h-0 rounded-b-none!"
          filters={filters}
          onFiltersUpdate={updateFilters}
          sort={sort}
          onSortUpdate={updateSort}
          projects={projects}
          tags={tags}
          onUpdateTask={backlog.updateTask}
          onDeleteTask={backlog.deleteTask}
          onCreateProject={createProject}
          onCreateTag={createTag}
        />
        <BacklogTaskAdder onSubmit={backlog.addTask} />
      </Flex>
    </SidePanel>
  );
}

// TODO Align with TaskCollector
function BacklogTaskAdder({
  onSubmit,
}: {
  onSubmit: (task: TaskInput) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isAdding, { open: showForm, close: hideForm }] = useDisclosure(false);

  const form = useTaskForm({
    ...taskFormOpts,
    onSubmit: ({ value, formApi }) => {
      onSubmit({ title: value.title });
      formApi.reset();
      hideForm();
    },
  });

  return (
    <Box>
      <Collapse in={!isAdding}>
        <Button
          variant="light"
          radius={0}
          fullWidth
          size="md"
          leftSection={<IconPlus />}
          onClick={(e) => {
            e.currentTarget.blur();
            showForm();
            setTimeout(() => inputRef.current?.focus(), 100);
          }}
        >
          New Task
        </Button>
      </Collapse>

      <Collapse in={isAdding}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
        >
          <Stack gap="sm" p="sm">
            <form.Field name="title">
              {(titleField) => (
                <TextInput
                  ref={inputRef}
                  size="md"
                  placeholder="New Task"
                  value={titleField.state.value}
                  onChange={(e) => titleField.handleChange(e.target.value)}
                  onBlur={hideForm}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      e.preventDefault();
                      e.stopPropagation();
                      e.currentTarget.blur();
                    }
                  }}
                />
              )}
            </form.Field>

            <form.Subscribe
              selector={(state) => state.isValid && state.isDirty}
            >
              {(canSubmit) => (
                <Button fullWidth disabled={!canSubmit} type="submit">
                  Create Task
                </Button>
              )}
            </form.Subscribe>
          </Stack>
        </form>
      </Collapse>
    </Box>
  );
}
