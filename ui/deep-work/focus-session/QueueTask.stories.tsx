import type { Meta, StoryObj } from "@storybook/react";
import { Paper } from "@mantine/core";
import { fn } from "@storybook/test";

import { QueueTask } from "./QueueTask";

const meta = {
  component: QueueTask,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <Paper shadow="sm" radius={0} withBorder>
        <Story />
      </Paper>
    ),
  ],
  args: {
    onComplete: fn(),
    onSkip: fn(),
    onRunManually: fn(),
  },
} satisfies Meta<typeof QueueTask>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ReadOnly: Story = {
  args: {
    status: "active",
    label: "Active Task",
    readOnly: true,
  },
};

export const WithGroup: Story = {
  args: {
    status: "active",
    label: "Active Task",
    group: "Group",
  },
};

export const Active: Story = {
  args: {
    status: "active",
    label: "Active Task",
  },
};

export const Completed: Story = {
  args: {
    status: "completed",
    label: "Completed Task",
  },
};

export const Skipped: Story = {
  args: {
    status: "skipped",
    label: "Skipped Task",
  },
};

export const Upcoming: Story = {
  args: {
    status: "upcoming",
    label: "Upcoming Task",
  },
};
