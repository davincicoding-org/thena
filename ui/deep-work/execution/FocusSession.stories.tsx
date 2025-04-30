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
        duration: 1000,
        tasks: [],
      },
      {
        id: "2",
        duration: 1000,
        tasks: [],
      },
      {
        id: "3",
        duration: 1000,
        tasks: [],
      },
      {
        id: "4",
        duration: 1000,
        tasks: [],
      },
      {
        id: "5",
        duration: 1000,
        tasks: [],
      },
    ],
    className: "h-dvh",
    currentSprint: undefined,
    sessionBreak: undefined,
    status: "sprint",
    onFinishSprint: fn(),
    onFinishBreak: fn(),
  },
} satisfies Meta<typeof FocusSession>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Showcase: Story = {};
