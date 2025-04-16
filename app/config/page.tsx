"use client";

import { AppShell, Card, Center } from "@mantine/core";

import { Configuration } from "@/ui/Configuration";

export default function ConfigPage() {
  return (
    <AppShell.Main className="grid">
      <Center>
        <Card withBorder>
          <Configuration />
        </Card>
      </Center>
    </AppShell.Main>
  );
}
