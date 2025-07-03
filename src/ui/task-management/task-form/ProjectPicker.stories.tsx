import type { Meta, StoryObj } from "@storybook/react";
import { Paper } from "@mantine/core";
import { useArgs } from "@storybook/preview-api";
import { fn } from "@storybook/test";

import { ProjectPicker } from "./ProjectPicker";

const meta = {
  component: ProjectPicker,
  parameters: {
    layout: "centered",
  },
  args: {
    projects: [
      {
        id: "thena",
        title: "Thena",
        image: null,
      },
      {
        id: "dercampus",
        title: "dercampus",
        image: null,
      },
      {
        id: "dvc",
        title: "DAVINCI CODING",
        image: null,
      },
    ],
    onChange: fn(),
    onClose: fn(),
  },
  decorators: [
    (Story) => (
      <Paper shadow="sm" radius={0} withBorder>
        <Story />
      </Paper>
    ),
  ],
} satisfies Meta<typeof ProjectPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Showcase: Story = {};

export const Empty: Story = {
  args: {
    projects: [],
  },
};
