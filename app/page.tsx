"use client";

import Link from "next/link";
import { AppShell, Button, Center, NavLink, Text } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";

import { Panel } from "@/ui/components/Panel";

export default function HomePage() {
  return (
    <AppShell.Main display="grid">
      <Center>
        <Button size="xl" radius="md" component={Link} href="/session">
          New Session
        </Button>
      </Center>

      <Panel
        className="absolute right-6 bottom-6 w-48"
        header={
          <Text size="lg" px="sm" ta="center" py={4}>
            Demos
          </Text>
        }
      >
        <NavLink
          component={Link}
          href="/demos/sprint"
          label="Sprint"
          rightSection={<IconChevronRight size={16} />}
        />
        <NavLink
          component={Link}
          href="/demos/session-planner"
          label="Session Planner"
          rightSection={<IconChevronRight size={16} />}
        />
        <NavLink
          component={Link}
          href="/demos/tasks"
          label="Tasks"
          rightSection={<IconChevronRight size={16} />}
        />
        <NavLink
          component={Link}
          href="/demos/task-wizard"
          label="Task Wizard"
          rightSection={<IconChevronRight size={16} />}
        />
        <NavLink
          component={Link}
          href="/demos/chat"
          label="Chat"
          rightSection={<IconChevronRight size={16} />}
        />
        <NavLink
          component={Link}
          href="/demos/speech"
          label="Speech"
          rightSection={<IconChevronRight size={16} />}
        />
        <NavLink
          component={Link}
          href="/backlog"
          label="Backlog"
          rightSection={<IconChevronRight size={16} />}
        />
      </Panel>
    </AppShell.Main>
  );
}
