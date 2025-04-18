import type { Meta, StoryObj } from "@storybook/react";

import { ProjectCreator } from "../../lib/task-management/projects/ProjectCreator";

const meta = {
  title: "Components/ProjectCreator",
  component: ProjectCreator,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    onProjectCreate: { action: "project created" },
  },
} satisfies Meta<typeof ProjectCreator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithCustomClass: Story = {
  args: {
    className: "max-w-md",
  },
};
