import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { TagCreator } from "./TagCreator";

const meta = {
  component: TagCreator,
  parameters: {
    layout: "centered",
  },
  args: {
    onCreate: fn(),
  },
} satisfies Meta<typeof TagCreator>;

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
