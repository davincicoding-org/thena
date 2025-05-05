"use client";

import Link from "next/link";
import { AppShell, Button, Flex } from "@mantine/core";

export default function DemosPage() {
  return (
    <AppShell.Main display="grid">
      <Flex gap="lg" className="my-auto justify-center px-4 max-sm:flex-col">
        {/* <Button
          component={Link}
          href="/demos/task-wizard"
          size="xl"
          variant="default"
        >
          Task Wizard
        </Button> */}
        <Button component={Link} href="/demos/chat" size="xl" variant="default">
          Chat
        </Button>
        <Button
          component={Link}
          href="/demos/speech"
          size="xl"
          variant="default"
        >
          Speech
        </Button>
      </Flex>
    </AppShell.Main>
  );
}
