"use client";

import { useMemo } from "react";
import { AppShell } from "@mantine/core";

import {
  TaskList,
  TaskListProps,
  useTaskList,
  useTaskStore,
} from "@/ui/task-management";

export default function TasksPage() {
  const taskStore = useTaskStore();

  const storedTasks = useMemo(
    () =>
      Object.entries(taskStore.tasks).map(([id, task]) => ({
        ...task,
        id,
      })),
    [taskStore.tasks],
  );

  console.log(storedTasks.length);

  const taskList = useTaskList();

  const handleAddTask: TaskListProps["onAddTask"] = (task) => {
    const createdTask = taskStore.addTask(task);
    console.log(createdTask);
    taskList.addTask(createdTask);
  };

  const handleUpdateTask: TaskListProps["onUpdateTask"] = (taskId, updates) => {
    const updatedTask = taskStore.updateTask(taskId, updates);
    console.log(updatedTask);
    // taskList.updateTask(updatedTask);
  };

  return (
    <AppShell.Main display="grid" className="items-center justify-center">
      <TaskList
        w="90vw"
        maw={500}
        items={storedTasks.slice(0, 10)}
        onUpdateTask={handleUpdateTask}
        onRemoveTask={taskList.removeTask}
        onAddTask={handleAddTask}
      />
    </AppShell.Main>
  );
}
