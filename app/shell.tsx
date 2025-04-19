"use client";

import Link from "next/link";
import { AppShell, Button, Flex } from "@mantine/core";

export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>
        <Flex py="sm" px="md" gap="sm">
          <Button component={Link} href="/backlog" variant="default">
            Backlog
          </Button>
          <Button component={Link} href="/tasks" variant="default">
            Task Wizard
          </Button>
          <Button component={Link} href="/session" variant="default">
            Session
          </Button>
          <Button component={Link} href="/chat" variant="default">
            Chat
          </Button>
          <Button component={Link} href="/speech" variant="default">
            Speech
          </Button>
          <Button component={Link} href="/config" variant="default" ml="auto">
            Config
          </Button>
        </Flex>
      </AppShell.Header>

      {children}
    </AppShell>
  );
}
