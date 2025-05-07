"use client";

import Link from "next/link";
import {
  AppShell,
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

import { countTasks } from "@/core/task-management";
import { SidePanel } from "@/ui/components/SidePanel";
import { IntelligenceTile } from "@/ui/intelligence";
import {
  Backlog,
  ProjectsTile,
  useCreateProject,
  useDeleteTask,
  useProjectsQuery,
  useTasksQueryOptions,
  useTasksWithSubtasksQuery,
  useUpdateTask,
} from "@/ui/task-management";
import { ProjectForm } from "@/ui/task-management/project/ProjectForm";
import {
  projectFormOpts,
  useProjectForm,
} from "@/ui/task-management/project/useProjectForm";

export default function HomePage() {
  const { data: projects = [], isLoading: loadingProjects } =
    useProjectsQuery();
  const { mutate: createProject } = useCreateProject();
  const [isCreatingProject, projectCreatorModal] = useDisclosure();

  const tasks = useTasksWithSubtasksQuery({
    ids: [],
    where: "exclude",
  });
  const taskCount = countTasks(tasks.data ?? []);

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
  const tasks = useTasksWithSubtasksQuery({
    ids: [],
    where: "exclude",
  });

  const { mutate: updateTask } = useUpdateTask();
  const { mutate: deleteTask } = useDeleteTask();

  const { data: projects = [] } = useProjectsQuery();
  const { mutate: createProject } = useCreateProject();

  const { filters, filterTasks, updateFilters, sort, sortFn, updateSort } =
    useTasksQueryOptions();

  const items = filterTasks(tasks.data ?? []).sort(sortFn);

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
          tasks={items}
          className="min-h-0 rounded-b-none!"
          filters={filters}
          onFiltersUpdate={updateFilters}
          sort={sort}
          onSortUpdate={updateSort}
          projects={projects}
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
          onCreateProject={createProject}
        />
      </Flex>
    </SidePanel>
  );
}
