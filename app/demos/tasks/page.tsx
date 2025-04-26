"use client";

import { AppShell } from "@mantine/core";

import {
  TaskCollector,
  useProjects,
  useTags,
  useTaskList,
} from "@/ui/task-management";

export default function TasksPage() {
  const { projects, createProject } = useProjects();
  const { tags, createTag } = useTags();
  const { tasks, addTask, updateTask, removeTask } = useTaskList();

  return (
    <AppShell.Main display="grid" className="items-center justify-center">
      <TaskCollector
        w="90vw"
        maw={500}
        allowPullFromBacklog={true}
        items={tasks}
        projects={projects}
        tags={tags}
        onUpdateTask={(taskId, updates) => updateTask(taskId, updates)}
        onRemoveTask={(taskId) => removeTask(taskId)}
        onAddTask={(task) => addTask(task)}
        onCreateProject={createProject}
        onCreateTag={createTag}
      />
    </AppShell.Main>
  );
}
