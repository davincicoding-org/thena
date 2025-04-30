import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { FocusSession } from "./FocusSession";

const meta = {
  component: FocusSession,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    sprints: [
      {
        id: "1",
        duration: { minutes: 25 },
        tasks: [
          {
            taskId: "app",
            subtaskId: "1",
          },
          {
            taskId: "app",
            subtaskId: "2",
          },
          {
            taskId: "app",
            subtaskId: "3",
          },
        ],
      },
      {
        id: "2",
        duration: { minutes: 25 },
        tasks: [
          {
            taskId: "app",
            subtaskId: "4",
          },
          {
            taskId: "website",
            subtaskId: "w1",
          },
          {
            taskId: "website",
            subtaskId: "w2",
          },
          {
            taskId: "website",
            subtaskId: "w3",
          },
        ],
      },
      {
        id: "3",
        duration: { minutes: 25 },
        tasks: [
          {
            taskId: "marketing",
            subtaskId: "m1",
          },
          {
            taskId: "marketing",
            subtaskId: "m2",
          },
        ],
      },
    ],
    className: "h-dvh",
    tasks: [
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
    ],
  },
} satisfies Meta<typeof FocusSession>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Showcase: Story = {};
