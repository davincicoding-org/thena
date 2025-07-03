import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { TaskWrapper } from "./TaskWrapper";

const MockTask = ({ onAddSubtask }: { onAddSubtask?: () => void }) => {
  return (
    <div className="flex justify-between p-1 text-lg">
      Task
      <button className="text-xs!" onClick={onAddSubtask}>
        Add Subtask
      </button>
    </div>
  );
};

const meta = {
  component: TaskWrapper,
  args: {
    task: <MockTask />,
    subtasks: [
      <div className="p-1">Subtask 1</div>,
      <div className="p-1">Subtask 2</div>,
      <div className="p-1">Subtask 3</div>,
    ],
    onAddSubtask: fn(),
  },
} satisfies Meta<typeof TaskWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Showcase: Story = {};
