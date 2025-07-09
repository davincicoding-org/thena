"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Card, Center, Flex, Loader, Stack } from "@mantine/core";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";

import type { ProjectSelect } from "@/core/task-management";
import { Main } from "@/app/(shell)/shell";
import { api } from "@/trpc/react";
import { IntelligenceTile } from "@/ui/intelligence";
import {
  ProjectCreator,
  ProjectsCard,
  useProjectCreator,
  useProjects,
  useTodos,
} from "@/ui/task-management";
import { ProjectModal } from "@/ui/task-management/project/ProjectModal";
import { cn, derive } from "@/ui/utils";

const MotionLoader = m.create(Loader);

export default function HomePage() {
  const { user } = useUser();

  // TODOS

  const todos = useTodos();
  const todosCount = todos.tasks.reduce((acc, task) => {
    if (task.subtasks.length > 0) return acc + task.subtasks.length;
    return acc + 1;
  }, 0);

  const todosLabel = derive(() => {
    if (todosCount <= 100) return todosCount;
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

          <Flex gap="lg" align="stretch">
            <Card
              component={Link}
              href="/focus"
              withBorder
              className={cn(
                "h-40 w-40 shrink-0 cursor-pointer transition-transform hover:scale-105",
                {
                  "pointer-events-none": todos.isLoading,
                },
              )}
              radius="md"
            >
              <AnimatePresence>
                {todos.isLoading ? (
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
              className="min-w-0 flex-1"
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

      <ProjectModal
        project={openedProject}
        onClose={() => setOpenedProject(null)}
      />
    </Main>
  );
}
