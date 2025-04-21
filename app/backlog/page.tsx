"use client";

import { AppShell, Center } from "@mantine/core";

import {
  Backlog,
  useBacklog,
  useProjects,
  useTags,
} from "@/ui/task-management";

export default function BacklogPage() {
  const { projects } = useProjects();
  const { tags } = useTags();
  const backlog = useBacklog({
    initialTasks: [
      {
        id: "task1",
        title: "Standup meeting",
        addedAt: "2025-04-21T16:15:29.548Z",
      },

      {
        id: "app",
        title: "Building an app",
        addedAt: "2025-04-21T16:00:29.548Z",
        subtasks: [
          {
            id: "1",
            title: "Gather requirements",
          },
          {
            id: "2",
            title: "Design the UI",
          },
          {
            id: "3",
            title: "Implement the UI",
          },
          {
            id: "4",
            title: "Test the app",
          },
        ],
      },
      {
        id: "task2",
        title: "Code review PR-123",
        addedAt: "2025-04-21T16:01:29.548Z",
      },
      {
        id: "task3",
        title: "Reply to client emails",
        addedAt: "2025-04-21T16:02:29.548Z",
      },
      {
        id: "website",
        title: "Company website redesign",
        addedAt: "2025-04-21T16:03:29.548Z",
        subtasks: [
          {
            id: "w1",
            title: "Analyze current website",
          },
          {
            id: "w2",
            title: "Create wireframes",
          },
          {
            id: "w3",
            title: "Design new pages",
          },
        ],
      },
      {
        id: "marketing",
        title: "Marketing campaign",
        addedAt: "2025-04-21T16:04:29.548Z",
        subtasks: [
          {
            id: "m1",
            title: "Define target audience",
          },
          {
            id: "m2",
            title: "Create content strategy",
          },
        ],
      },
      {
        id: "task4",
        title: "Update sprint board",
        addedAt: "2025-04-21T16:05:29.548Z",
      },

      {
        id: "api",
        title: "API development",
        addedAt: "2025-04-21T16:06:29.548Z",
        subtasks: [
          {
            id: "a1",
            title: "Design endpoints",
          },
          {
            id: "a2",
            title: "Implement auth system",
          },
          {
            id: "a3",
            title: "Write documentation",
          },
        ],
      },
      {
        id: "database",
        title: "Database optimization",
        addedAt: "2025-04-21T16:07:29.548Z",
        subtasks: [
          {
            id: "d1",
            title: "Analyze performance issues",
          },
          {
            id: "d2",
            title: "Implement indexing strategy",
          },
        ],
      },
      {
        id: "task5",
        title: "Quick bug fix for nav menu",
        addedAt: "2025-04-21T16:08:29.548Z",
      },
    ],
  });

  return (
    <AppShell.Main className="grid">
      <Center className="items-center" p="lg">
        <Backlog
          projects={projects}
          tags={tags}
          tasks={backlog.tasks}
          filters={backlog.filters}
          sort={backlog.sort}
          onFiltersUpdate={backlog.updateFilters}
          onSortUpdate={backlog.updateSort}
        />
      </Center>
    </AppShell.Main>
  );
}
