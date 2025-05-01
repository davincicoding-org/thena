import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { FlatTask } from "@/core/task-management";

import { TaskPool } from "./TaskPool";

const TASKS: FlatTask[] = [
  {
    taskId: "task1",
    subtaskId: null,
    title: "Standup meeting",
  },

  {
    taskId: "app",
    subtaskId: "1",
    parentTitle: "Building an app",
    title: "Gather requirements",
  },
  {
    taskId: "2",
    subtaskId: null,
    parentTitle: "Building an app",
    title: "Design the UI",
  },
  {
    taskId: "3",
    subtaskId: null,
    parentTitle: "Building an app",
    title: "Implement the UI",
  },
  {
    taskId: "4",
    subtaskId: null,
    parentTitle: "Building an app",
    title: "Test the app",
  },
  {
    taskId: "task2",
    subtaskId: null,
    title: "Code review PR-123",
  },
  {
    taskId: "task3",
    subtaskId: null,
    title: "Reply to client emails",
  },
  {
    taskId: "website",
    subtaskId: "w1",
    parentTitle: "Company website redesign",
    title: "Analyze current website",
  },
  {
    taskId: "w2",
    subtaskId: null,
    parentTitle: "Company website redesign",
    title: "Create wireframes",
  },
  {
    taskId: "w3",
    subtaskId: null,
    parentTitle: "Company website redesign",
    title: "Design new pages",
  },
  {
    taskId: "marketing",
    subtaskId: "m1",
    parentTitle: "Marketing campaign",
    title: "Define target audience",
  },
  {
    taskId: "marketing",
    subtaskId: "m1",
    parentTitle: "Marketing campaign",
    title: "Define target audience",
  },
  {
    taskId: "marketing",
    subtaskId: "m2",
    parentTitle: "Marketing campaign",
    title: "Create content strategy",
  },
  {
    taskId: "task4",
    subtaskId: null,
    title: "Update sprint board",
  },

  {
    taskId: "api",
    subtaskId: "a1",
    parentTitle: "API development",
    title: "Design endpoints",
  },
  {
    taskId: "api",
    subtaskId: "a2",
    parentTitle: "API development",
    title: "Implement auth system",
  },
  {
    taskId: "api",
    subtaskId: "a3",
    parentTitle: "API development",
    title: "Write documentation",
  },
  {
    taskId: "task5",
    subtaskId: null,
    title: "Quick bug fix for nav menu",
  },
  {
    taskId: "database",
    subtaskId: "d1",
    parentTitle: "Database optimization",
    title: "Analyze performance issues",
  },
  {
    taskId: "database",
    subtaskId: "d2",
    parentTitle: "Database optimization",
    title: "Implement indexing strategy",
  },
  {
    taskId: "task5",
    subtaskId: null,
    title: "Quick bug fix for nav menu",
  },
];

const meta = {
  component: TaskPool,
  parameters: {
    layout: "centered",
  },
  args: {
    tasks: TASKS,
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
