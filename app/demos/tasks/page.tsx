"use client";

import { AppShell } from "@mantine/core";

import { TaskList, useTaskList } from "@/ui/task-management";

export default function TasksPage() {
  const taskList = useTaskList();

  return (
    <AppShell.Main display="grid" className="items-center justify-center">
      <TaskList
        w="90vw"
        maw={500}
        items={taskList.items}
        onUpdateTask={taskList.updateTask}
        onRemoveTask={taskList.removeTask}
        onAddTask={taskList.addTask}
      />
    </AppShell.Main>
  );
}
