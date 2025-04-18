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
    fileUploader: async (file: File) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    },
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
