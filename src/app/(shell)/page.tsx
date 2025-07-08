"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Button,
  Card,
  Center,
  Divider,
  Flex,
  FocusTrap,
  Modal,
  Space,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";

import type { ProjectSelect } from "@/core/task-management";
import { Main } from "@/app/(shell)/shell";
import { countTasks } from "@/core/task-management";
import { api } from "@/trpc/react";
import { IntelligenceTile } from "@/ui/intelligence";
import {
  ProjectForm,
  projectFormOpts,
  ProjectOverview,
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
  const [openedProject, setOpenedProject] = useState<ProjectSelect | null>(
    null,
  );

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
              onSelect={setOpenedProject}
            />
          </Flex>
        </Stack>
      </Center>

      {/* Project Form */}
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

      {/* Project Overview */}
      <Modal
        opened={openedProject !== null}
        centered
        radius="md"
        classNames={{
          body: "p-0!",
        }}
        transitionProps={{ transition: "pop", duration: 300 }}
        overlayProps={{
          className: "backdrop-blur-xs",
        }}
        withCloseButton={false}
        onClose={() => setOpenedProject(null)}
      >
        <FocusTrap.InitialFocus />
        <AnimatePresence>
          {openedProject && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProjectOverview
                project={openedProject}
                onDeleteProject={() => {
                  projects.delete.mutate(openedProject);
                  setOpenedProject(null);
                }}
              />
            </m.div>
          )}
        </AnimatePresence>
      </Modal>
    </Main>
  );
}
