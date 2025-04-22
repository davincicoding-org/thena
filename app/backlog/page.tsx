"use client";

import { AppShell } from "@mantine/core";

import { Backlog, useBacklog } from "@/ui/task-management";

export default function BacklogPage() {
  const backlog = useBacklog({
    initialTasks: [
      {
        id: "task1",
        title: "Standup meeting",
        addedAt: "2025-04-21T16:15:29.548Z",
        projectId: "t4c",
        tags: ["man"],
      },

      {
        id: "app",
        title: "Building an app",
        addedAt: "2025-04-21T16:00:29.548Z",
        projectId: "con",
        subtasks: [
          {
            id: "1",
            title: "Gather requirements",
            tags: ["res"],
          },
          {
            id: "2",
            title: "Design the UI",
            tags: ["des"],
          },
          {
            id: "3",
            title: "Implement the UI",
            tags: ["dev"],
          },
          {
            id: "4",
            title: "Test the app",
          },
        ],
      },
      {
        id: "task3",
        title: "Walk the dog",
        addedAt: "2025-04-21T16:02:29.548Z",
      },
      {
        id: "task2",
        title: "Code review PR-123",
        addedAt: "2025-04-21T16:01:29.548Z",
      },
      {
        id: "website",
        title: "Company website redesign",
        addedAt: "2025-04-21T16:03:29.548Z",
        projectId: "koc",
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
        projectId: "swi",
        subtasks: [
          {
            id: "m1",
            title: "Define target audience",
            tags: ["mar"],
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
        projectId: "dvc",
        tags: ["man"],
      },
      {
        id: "database",
        title: "Database optimization",
        addedAt: "2025-04-21T16:07:29.548Z",
        projectId: "con",
        subtasks: [
          {
            id: "d1",
            title: "Analyze performance issues",
            tags: ["res"],
          },
          {
            id: "d2",
            title: "Implement indexing strategy",
            tags: ["dev"],
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
      <Backlog
        mah="70dvh"
        w={500}
        mt="10dvh"
        mx="auto"
        mb="auto"
        projects={[
          { id: "con", name: "ConcentrAID", color: "teal" },
          { id: "koc", name: "KOCO", color: "violet" },
          { id: "dvc", name: "DAVINCI CODING", image: "/dvc.png" },
          { id: "swi", name: "Swissinfluece" },
          { id: "t4c", name: "T4 Capital", color: "blue" },
        ]}
        tags={[
          { id: "res", name: "Research", color: "yellow" },
          { id: "des", name: "Design", color: "green" },
          { id: "dev", name: "Development", color: "cyan" },
          { id: "mar", name: "Marketing", color: "grape" },
          { id: "man", name: "Management" },
        ]}
        tasks={backlog.tasks}
        filters={backlog.filters}
        sort={backlog.sort}
        onFiltersUpdate={backlog.updateFilters}
        onSortUpdate={backlog.updateSort}
      />
    </AppShell.Main>
  );
}
