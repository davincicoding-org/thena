import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { SessionBreak } from "./SessionBreak";

const meta = {
  component: SessionBreak,
  parameters: {
    layout: "centered",
  },
  args: {
    duration: { minutes: 10 },
    sprintsLeft: 3,
    running: true,
    onResume: fn(),
  },
} satisfies Meta<typeof SessionBreak>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Showcase: Story = {};

// export const TimeUp: Story = {
//   args: {
//     timeElapsed: 10,
//   },
// };

export const BeforeLastSprint: Story = {
  args: {
    sprintsLeft: 1,
  },
};
