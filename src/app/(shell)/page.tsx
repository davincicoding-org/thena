"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  Card,
  Center,
  Flex,
  FocusTrap,
  Loader,
  Modal,
  Stack,
} from "@mantine/core";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";

import type { ProjectSelect } from "@/core/task-management";
import { Main } from "@/app/(shell)/shell";
import { countTasks } from "@/core/task-management";
import { api } from "@/trpc/react";
import { IntelligenceTile } from "@/ui/intelligence";
import {
  ProjectCreator,
  ProjectOverview,
  ProjectsCard,
  useProjectCreator,
  useProjects,
} from "@/ui/task-management";
import { cn, derive } from "@/ui/utils";

const MotionLoader = m.create(Loader);

export default function HomePage() {
  const { user } = useUser();

  // TODOS

  const { data: tasks = [], isLoading: loadingTodos } = api.tasks.list.useQuery(
    { status: "todo" },
  );
  const taskCount = countTasks(tasks);

  const todosLabel = derive(() => {
    if (taskCount === 0) return "-";
    if (taskCount <= 100) return taskCount.toString();
    return "100+";
  });

  // Projects

  const projects = useProjects();
  const [openedProject, setOpenedProject] = useState<ProjectSelect | null>(
    null,
  );
  const projectCreator = useProjectCreator((input) =>
    projects.create.mutateAsync(input),
  );

  // Intelligence

  const intelligenceSummary = api.intelligence.summary.useQuery();

  return (
    <Main display="grid">
      <Center>
        <Stack gap="xl" className="w-full max-w-2xl" p="lg">
          <p
            className={cn(
              "my-0 text-5xl leading-none font-light transition-opacity",
              {
                "opacity-0": !user?.fullName,
              },
            )}
          >
            Hello, {user?.firstName}
          </p>

          <Flex gap="lg" align="center">
            <Card
              component={Link}
              href="/tasks"
              withBorder
              className={cn(
                "h-40 w-40 shrink-0 cursor-pointer transition-transform hover:scale-105",
                {
                  "pointer-events-none": loadingTodos,
                },
              )}
              radius="md"
            >
              <AnimatePresence>
                {loadingTodos ? (
                  <MotionLoader
                    size="xl"
                    m="auto"
                    color="gray"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                ) : (
                  <m.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="m-auto text-5xl font-bold"
                  >
                    {todosLabel}
                  </m.span>
                )}
              </AnimatePresence>

              <span className="text-center text-2xl leading-none font-light">
                TODOS
              </span>
            </Card>

            <ProjectsCard
              loading={projects.isLoading}
              items={projects.items}
              className="min-w-0 grow-0"
              onCreateProject={projectCreator.open}
              onViewProject={setOpenedProject}
            />
          </Flex>

          <IntelligenceTile
            loading={intelligenceSummary.isLoading}
            summary={intelligenceSummary.data}
          />
        </Stack>
      </Center>

      <ProjectCreator
        opened={projectCreator.opened}
        onClose={projectCreator.close}
        onCreate={projectCreator.create}
      />

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
