"use client";

import { AppShell } from "@mantine/core";

import { TaskList, useTaskList } from "@/ui/task-management";

export default function TasksPage() {
  const { tasks, addTask, updateTask, removeTask } = useTaskList();

  return (
    <AppShell.Main display="grid" className="items-center justify-center">
      <TaskList
        w="90vw"
        maw={500}
        items={tasks}
        onUpdateTask={updateTask}
        onRemoveTask={removeTask}
        onAddTask={addTask}
      />
    </AppShell.Main>
  );
}
