"use client";

import { AppShell } from "@mantine/core";

import { TaskWizard } from "@/ui/task-management/TaskWizard";

export default function TasksPage() {
  return (
    <AppShell.Main display="grid">
      <TaskWizard />
    </AppShell.Main>
  );
}
