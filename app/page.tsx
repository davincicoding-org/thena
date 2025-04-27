"use client";

import { useMemo, useRef } from "react";
import Link from "next/link";
import {
  AppShell,
  Avatar,
  Box,
  Button,
  Card,
  Center,
  Collapse,
  Divider,
  Fieldset,
  Flex,
  RingProgress,
  ScrollArea,
  Space,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";

import { TaskInput } from "@/core/task-management";
import { SidePanel } from "@/ui/components/SidePanel";
import {
  Backlog,
  taskFormOpts,
  useBacklog,
  useBacklogQueryOptions,
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
  const { tasks } = useBacklog();
  const taskCount = useMemo(
    () => tasks.reduce((acc, task) => acc + (task.subtasks?.length || 1), 0),
    [tasks],
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
  const backlog = useBacklog();
  const { projects, createProject } = useProjects();
  const { tags, createTag } = useTags();

  const { filters, filterTasks, updateFilters, sort, sortFn, updateSort } =
    useBacklogQueryOptions();

  const tasks = useMemo(
    () => filterTasks(backlog.tasks).sort(sortFn),
    [backlog.tasks, filterTasks, sortFn],
  );

  // ------- Task Adder -------

  return (
    // TODO: Make side panel close on escape. Setting closeOnEscape={false} is a workaround, because pressing escape on the task adder form would the side panel.
    <SidePanel opened={isOpen} closeOnEscape={false} onClose={onClose}>
      <Flex className="h-full" direction="column" gap="md">
        <Backlog
          mode="edit"
          flex={1}
          tasks={tasks}
          className="min-h-0"
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
        <Divider className="-mx-4" />
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
            form.handleSubmit();
          }}
        >
          <Stack gap="sm">
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
