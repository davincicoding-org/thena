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
  const taskList = useTaskList();

  return (
    <AppShell.Main display="grid" className="items-center justify-center">
      <TaskCollector
        w="90vw"
        maw={500}
        allowPullFromBacklog={true}
        items={taskList.items}
        projects={projects}
        tags={tags}
        onUpdateTask={taskList.updateTask}
        onRemoveTask={taskList.removeTask}
        onAddTask={taskList.addTask}
        onCreateProject={createProject}
        onCreateTag={createTag}
      />
    </AppShell.Main>
  );
}
