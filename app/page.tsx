"use client";

import Link from "next/link";
import {
  Button,
  Card,
  Center,
  Divider,
  Flex,
  Modal,
  Space,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { Main } from "@/app/shell";
import { countTasks } from "@/core/task-management";
import { api } from "@/trpc/react";
import { SidePanel } from "@/ui/components/SidePanel";
import { IntelligenceTile } from "@/ui/intelligence";
import {
  Backlog,
  ProjectForm,
  projectFormOpts,
  ProjectsTile,
  useProjectForm,
  useTasksQueryOptions,
} from "@/ui/task-management";

export default function HomePage() {
  const intelligenceSummary = api.intelligence.summary.useQuery();

  const utils = api.useUtils();
  // Tasks

  const { data: tasks = [] } = api.tasks.list.useQuery({ status: "todo" });
  // const { mutateAsync: createTask } = api.tasks.create.useMutation();
  const { mutateAsync: updateTask } = api.tasks.update.useMutation();
  const { mutateAsync: deleteTask } = api.tasks.delete.useMutation({
    onSuccess: (_, { id }) => {
      void utils.tasks.list.setData({ status: "todo" }, (tasks) =>
        tasks?.filter((task) => task.id !== id),
      );
    },
  });

  const taskCount = countTasks(tasks);

  const { filters, filterTasks, updateFilters, sort, sortFn, updateSort } =
    useTasksQueryOptions();

  const filteredTasks = filterTasks(tasks).sort(sortFn);

  // Projects
  const { data: projects = [], isLoading: loadingProjects } =
    api.projects.list.useQuery();
  const { mutate: createProject } = api.projects.create.useMutation();
  const [isCreatingProject, projectCreatorModal] = useDisclosure();

  const projectForm = useProjectForm({
    ...projectFormOpts,
    onSubmit: ({ value }) => {
      createProject(value);
      projectCreatorModal.close();
      projectForm.reset();
    },
  });

  const [isBacklogPanelOpen, backlogPanel] = useDisclosure();

  return (
    <Main display="grid">
      <Center>
        <Stack gap="lg" className="w-fit" maw={500} p="lg">
          <IntelligenceTile
            loading={intelligenceSummary.isLoading}
            summary={intelligenceSummary.data}
          />
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void projectForm.handleSubmit();
          }}
        >
          <ProjectForm form={projectForm} />

          <Divider />
          <projectForm.Subscribe
            selector={(state) => state.isValid && state.isDirty}
            children={(isValid) => (
              <Button
                fullWidth
                radius={0}
                size="md"
                type="submit"
                disabled={!isValid}
              >
                Create Project
              </Button>
            )}
          />
        </form>
      </Modal>
      {/* TODO: Make side panel close on escape. Setting closeOnEscape={false} is
      a workaround, because pressing escape on the task adder form would the
      side panel. */}
      <SidePanel
        opened={isBacklogPanelOpen}
        size="sm"
        closeOnEscape={false}
        onClose={backlogPanel.close}
      >
        <Flex className="h-full" direction="column">
          <Backlog
            mode="edit"
            flex={1}
            tasks={filteredTasks}
            className="min-h-0 rounded-b-none!"
            filters={filters}
            onFiltersUpdate={updateFilters}
            sort={sort}
            onSortUpdate={updateSort}
            projects={projects}
            onUpdateTask={(taskId, updates) =>
              updateTask({ id: taskId, updates })
            }
            onDeleteTask={(taskId) => deleteTask({ id: taskId })}
            onCreateProject={(input) => createProject(input)}
          />
        </Flex>
      </SidePanel>
    </Main>
  );
}
