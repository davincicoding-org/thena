"use client";

import { AppShell, Center } from "@mantine/core";
import { TaskWizard } from "@/ui/task-manager/TaskWizard";
export default function TasksPage() {
  return (
    <AppShell.Main display="flex">
      <Center m="auto">
        <TaskWizard />
      </Center>
    </AppShell.Main>
  );
}
