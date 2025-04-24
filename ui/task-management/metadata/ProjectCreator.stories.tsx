import { fn } from "@storybook/test";

import type { Meta, StoryObj } from "@storybook/react";

import { ProjectCreator } from "./ProjectCreator";

const meta = {
  component: ProjectCreator,
  parameters: {
    layout: "centered",
  },
  args: {
    onCreate: fn(),
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
