"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  AppShell,
  Avatar,
  Button,
  Card,
  Center,
  Drawer,
  Fieldset,
  Flex,
  Modal,
  RingProgress,
  ScrollArea,
  Space,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { useStore } from "zustand";

import {
  Backlog,
  TaskForm,
  taskFormOpts,
  useBacklogQueryOptions,
  useBacklogStore,
  useProjects,
  useTags,
  useTaskForm,
} from "@/ui/task-management";

const DEMO_PAGES = [
  {
    label: "Sprint",
    href: "/demos/sprint",
  },
  {
    label: "Session Planner",
    href: "/demos/session-planner",
  },
  {
    label: "Tasks",
    href: "/demos/tasks",
  },
  {
    label: "Task Wizard",
    href: "/demos/task-wizard",
  },
  {
    label: "Chat",
    href: "/demos/chat",
  },
  {
    label: "Speech",
    href: "/demos/speech",
  },
];

export default function HomePage() {
  const { projects } = useProjects();
  const taskCount = useStore(useBacklogStore, (state) =>
    state.items.reduce((acc, task) => acc + (task.subtasks?.length || 1), 0),
  );

  const [isBacklogPanelOpen, backlogPanel] = useDisclosure();

  return (
    <AppShell.Main display="grid">
      <Center>
        <Stack gap="lg" maw={400}>
          <Card
            p={0}
            radius="md"
            shadow="sm"
            component={Link}
            href="/intelligence"
            className="transition-colors hover:bg-[var(--mantine-color-dark-5)]!"
          >
            <Flex gap="md" pr="sm" justify="space-evenly" align="center">
              <RingProgress
                size={90}
                sections={[{ value: 75, color: "primary" }]}
              />
              <Stack gap={0} ta="center">
                <Text className="text-3xl!">5h 20m</Text>
                <Text size="sm">Total Focus Time</Text>
              </Stack>
              <Stack gap={0} ta="center">
                <Text className="text-3xl!">75%</Text>
                <Text size="sm">Goals achieved</Text>
              </Stack>
            </Flex>
          </Card>
          <Button
            size="xl"
            radius="md"
            fullWidth
            component={Link}
            href="/session"
          >
            New Session
          </Button>

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
            <Card radius="md" shadow="sm" flex={1}>
              <Card.Section>
                <ScrollArea scrollbars="x" scrollHideDelay={300}>
                  <Flex gap="md" p="md">
                    {projects.map((project) => (
                      <Tooltip key={project.id} label={project.name}>
                        <Avatar
                          // component={Link}
                          // href={`/projects/${project.id}`}
                          // aria-label={`Open "${project.name}" project`}
                          display="inline-block"
                          size="md"
                          radius="md"
                          src={project.image}
                          alt={project.name}
                          color={project.color || "gray"}
                          name={project.name}
                        />
                      </Tooltip>
                    ))}
                  </Flex>
                </ScrollArea>
              </Card.Section>
              <Space h="xs" />
              <Button
                variant="light"
                fullWidth
                onClick={() => alert("Coming soon!")}
              >
                Manage Projects
              </Button>
            </Card>
          </Flex>

          <Fieldset legend="Demos" ta="center" p={0}>
            <ScrollArea scrollbars="x" scrollHideDelay={300}>
              <Flex align="center" className="h-full" p="sm" pt={0}>
                {DEMO_PAGES.map((page) => (
                  <Button
                    key={page.label}
                    color="gray"
                    size="compact-sm"
                    variant="subtle"
                    component={Link}
                    href={page.href}
                  >
                    {page.label}
                  </Button>
                ))}
              </Flex>
            </ScrollArea>
          </Fieldset>
        </Stack>
      </Center>

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
  const backlogStore = useBacklogStore();
  const { projects, createProject } = useProjects();
  const { tags, createTag } = useTags();

  const { filters, filterItems, updateFilters, sort, sortFn, updateSort } =
    useBacklogQueryOptions();

  const tasks = useMemo(
    () => filterItems(backlogStore.items).sort(sortFn),
    [backlogStore.items, filterItems, sortFn],
  );

  const [isAddingTask, taskAdder] = useDisclosure(false);

  const taskAdderForm = useTaskForm({
    ...taskFormOpts,
    onSubmit: ({ value, formApi }) => {
      backlogStore.addTask(value);
      formApi.reset();
      taskAdder.close();
    },
  });

  return (
    <Drawer
      opened={isOpen}
      size="md"
      position="right"
      closeOnEscape={!isAddingTask}
      withCloseButton={false}
      offset={24}
      radius="md"
      classNames={{
        body: "h-full",
      }}
      onClose={onClose}
    >
      <Flex className="h-full" direction="column" gap="md">
        <Backlog
          flex={1}
          tasks={tasks}
          className="min-h-0"
          filters={filters}
          onFiltersUpdate={updateFilters}
          sort={sort}
          onSortUpdate={updateSort}
          projects={projects}
          tags={tags}
          onUpdateTask={backlogStore.updateTask}
          onDeleteTask={backlogStore.removeTask}
          onCreateProject={createProject}
          onCreateTag={createTag}
        />
        <Button
          variant="light"
          fullWidth
          leftSection={<IconPlus />}
          onClick={taskAdder.open}
        >
          New Task
        </Button>
      </Flex>
      <Modal
        size="xs"
        centered
        radius="md"
        withCloseButton={false}
        transitionProps={{ transition: "pop" }}
        opened={isAddingTask}
        onClose={taskAdder.close}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            taskAdderForm.handleSubmit();
          }}
        >
          <Stack>
            <TaskForm
              form={taskAdderForm}
              projects={projects}
              tags={tags}
              onAssignToNewProject={() => {}}
              onAttachNewTag={() => {}}
            />
            <taskAdderForm.Subscribe
              selector={(state) => state.isValid && state.isDirty}
            >
              {(canSubmit) => (
                <Button fullWidth disabled={!canSubmit} type="submit">
                  Create Task
                </Button>
              )}
            </taskAdderForm.Subscribe>
          </Stack>
        </form>
      </Modal>
    </Drawer>
  );
}
