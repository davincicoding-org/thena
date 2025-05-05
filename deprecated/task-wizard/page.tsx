"use client";

import { AppShell } from "@mantine/core";

import { TaskWizard } from "@/ui/assistant";

export default function TaskWizardPage() {
  return (
    <AppShell.Main display="grid">
      <TaskWizard />
    </AppShell.Main>
  );
}
