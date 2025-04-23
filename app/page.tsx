"use client";

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
  RingProgress,
  ScrollArea,
  Space,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { useProjects } from "@/ui/task-management";

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
  const { projects } = useProjects({
    initialProjects: [
      { id: "con", name: "ConcentrAID", color: "teal" },
      { id: "koc", name: "KOCO", color: "violet" },
      { id: "dvc", name: "DAVINCI CODING", image: "/dvc.png" },
      { id: "swi", name: "Swissinfluece" },
      { id: "t4c", name: "T4 Capital", color: "blue" },
    ],
  });

  const [isBacklogPanelOpen, backlogPanel] = useDisclosure(false);

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
                3 Tasks
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
                          component={Link}
                          href={`/projects/${project.id}`}
                          display="inline-block"
                          size="md"
                          radius="md"
                          src={project.image}
                          color={project.color || "gray"}
                          name={project.name}
                          onClick={(e) => {
                            e.preventDefault();
                            alert("Coming soon!");
                          }}
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

      <Drawer
        opened={isBacklogPanelOpen}
        position="right"
        withCloseButton={false}
        offset={24}
        radius="md"
        onClose={backlogPanel.close}
      >
        <Text size="xl">Coming soon!</Text>
      </Drawer>
    </AppShell.Main>
  );
}
