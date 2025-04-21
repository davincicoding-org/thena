"use client";

import { AppShell, Center } from "@mantine/core";

import { SessionPlanner, useSessionPlanner } from "@/ui/deep-work";

export default function SessionPlannerPage() {
  const sessionPlanner = useSessionPlanner(
    [
      {
        id: "task1",
        title: "Standup meeting",
      },

      {
        id: "app",
        title: "Building an app",
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
      },
      {
        id: "task3",
        title: "Reply to client emails",
      },
      {
        id: "website",
        title: "Company website redesign",
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
      },

      {
        id: "api",
        title: "API development",
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
      },
    ],
    {
      sprintCount: 3,
      sprintDuration: 25,
    },
  );

  return (
    <AppShell.Main className="grid">
      <Center className="items-center" p="lg">
        <SessionPlanner
          mah="70dvh"
          className="w-full max-w-4/5"
          sprints={sessionPlanner.sprints}
          unassignedTasks={sessionPlanner.unassignedTasks}
          onAddSprint={() => sessionPlanner.addSprint({})}
          onDropSprint={sessionPlanner.dropSprint}
          onSprintChange={sessionPlanner.updateSprint}
          onAssignTasksToSprint={sessionPlanner.assignTasks}
          onUnassignTasksFromSprint={sessionPlanner.unassignTasks}
          onMoveTasks={sessionPlanner.moveTasks}
        />
      </Center>
    </AppShell.Main>
  );
}
