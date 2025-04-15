import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { useArgs } from "@storybook/preview-api";

import { TaskWizard, TaskWizardProps } from "./TaskWizard";

const meta = {
  component: TaskWizard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof TaskWizard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Showcase: Story = {};
