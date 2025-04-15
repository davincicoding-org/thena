import type { Meta, StoryObj } from "@storybook/react";
import { AssistantIndicator } from "./AssistantIndicator";

const meta = {
  component: AssistantIndicator,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    className: "w-48 h-48",
  },
} satisfies Meta<typeof AssistantIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = {
  args: {
    status: "idle",
  },
};

export const Listening: Story = {
  args: {
    status: "listening",
  },
};

export const Thinking: Story = {
  args: {
    status: "thinking",
  },
};

export const Speaking: Story = {
  args: {
    status: "speaking",
  },
};
