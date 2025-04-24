import { fn } from "@storybook/test";

import type { Meta, StoryObj } from "@storybook/react";

import { SprintPanel } from "./SprintPanel";

const meta = {
  component: SprintPanel,
  parameters: {
    layout: "centered",
  },
  args: {
    title: "Sprint 1",
    sprint: {
      id: "1",
      duration: 25,
      tasks: [
        {
          id: "task1",
          title: "Standup meeting",
        },
        {
          id: "task2",
          title: "Code review PR-123",
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
      ],
    },
    disabled: false,
    canAddTasks: true,
    sprintOptions: [
      { id: "1", title: "Sprint 1" },
      { id: "2", title: "Sprint 2" },
      { id: "2", title: "Sprint 2" },
    ],
    onDrop: fn(),
    onDurationChange: fn(),
    onAddTasks: fn(),
    onUnassignTask: fn(),
    onMoveTasks: fn(),
  },
} satisfies Meta<typeof SprintPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Showcase: Story = {};

export const Empty: Story = {
  args: {
    sprint: {
      id: "1",
      duration: 25,
      tasks: [],
    },
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
export const EmptyAndDisabled: Story = {
  args: {
    disabled: true,
    sprint: {
      id: "1",
      duration: 25,
      tasks: [],
    },
  },
};

export const NoAddTasks: Story = {
  args: {
    canAddTasks: false,
  },
};

export const NoAddTasksAndEmpty: Story = {
  args: {
    canAddTasks: false,
    sprint: {
      id: "1",
      duration: 25,
      tasks: [],
    },
  },
};
