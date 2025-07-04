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

import { Main } from "@/app/(shell)/shell";
import { countTasks } from "@/core/task-management";
import { api } from "@/trpc/react";
import { IntelligenceTile } from "@/ui/intelligence";
import {
  ProjectForm,
  projectFormOpts,
  ProjectsTile,
  useProjectForm,
  useProjects,
} from "@/ui/task-management";

export default function HomePage() {
  const intelligenceSummary = api.intelligence.summary.useQuery();

  // Tasks

  const { data: tasks = [] } = api.tasks.list.useQuery({ status: "todo" });

  const taskCount = countTasks(tasks);

  // Projects
  const projects = useProjects();
  const [isAddingProject, projectFormModal] = useDisclosure();

  const projectForm = useProjectForm({
    ...projectFormOpts,
    onSubmit: ({ value }) => {
      projects.create.mutate(value);
      projectFormModal.close();
      projectForm.reset();
    },
  });

  return (
    <Main display="grid">
      <Center>
        <Stack gap="lg" className="w-md" p="lg">
          <IntelligenceTile
            loading={intelligenceSummary.isLoading}
            summary={intelligenceSummary.data}
          />
          <Button
            size="xl"
            radius="md"
            fullWidth
            component={Link}
            href="/focus"
          >
            Start Focus Session
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
              <Button variant="light" fullWidth component={Link} href="/tasks">
                View
              </Button>
            </Card>
            <ProjectsTile
              flex={1}
              loading={projects.isLoading}
              items={projects.items}
              onCreate={projectFormModal.open}
            />
          </Flex>
        </Stack>
      </Center>
      <Modal
        opened={isAddingProject}
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
        onClose={projectFormModal.close}
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
    </Main>
  );
}
