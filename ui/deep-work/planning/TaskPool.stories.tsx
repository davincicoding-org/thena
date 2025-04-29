import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { TaskPool } from "./TaskPool";

const TASKS = [
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
];

const meta = {
  component: TaskPool,
  parameters: {
    layout: "centered",
  },
  args: {
    items: TASKS,
    selectionEnabled: false,
    sprintOptions: [
      { id: "sprint1", title: "Sprint 1" },
      { id: "sprint2", title: "Sprint 2" },
      { id: "sprint3", title: "Sprint 3" },
      { id: "sprint4", title: "Sprint 4" },
      { id: "sprint5", title: "Sprint 5" },
    ],
    onSubmitSelection: fn(),
    onAbortSelection: fn(),
    onAssignTasksToSprint: fn(),
    mah: "70dvh",
    w: 400,
  },
} satisfies Meta<typeof TaskPool>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Showcase: Story = {};

export const SelectionEnabled: Story = {
  args: {
    selectionEnabled: true,
  },
};
