import { useEffect, useState } from "react";
import { useArgs } from "@storybook/preview-api";
import { fn } from "@storybook/test";

import type { Meta, StoryObj } from "@storybook/react";

import { Backlog, BacklogProps } from "./Backlog";
import { useBacklog } from "./useBacklog";

const meta = {
  component: Backlog,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    tasks: [
      {
        id: "1",
        title: "Build a task management app",
        projectId: "con8",
        tags: ["work"],
        subtasks: [
          { id: "3", title: "Engineer requirements" },
          { id: "1", title: "Define tech stack" },
          { id: "2", title: "Setup codebase" },
        ],
        addedAt: "2025-04-18T00:32:10.504Z",
      },
      {
        id: "2",
        title: "Reply to client email",
        addedAt: "2025-04-18T00:32:10.504Z",
      },
      {
        id: "3",
        title: "Buy groceries",
        addedAt: "2025-04-18T00:32:10.504Z",
        tags: ["personal"],
      },
    ],
    filters: {},
    sort: { sortBy: "addedAt", direction: "desc" },
    projects: [
      { id: "dercampus", name: "dercampus" },
      { id: "con8", name: "Con8", color: "yellow" },
    ],
    tags: [
      { id: "work", name: "Work" },
      { id: "personal", name: "Personal", color: "green" },
    ],
  },
} satisfies Meta<typeof Backlog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: (args) => {
    const [{ tasks, filters, sort }, updateArgs] = useArgs<BacklogProps>();
    const backlog = useBacklog({
      initialTasks: tasks,
      stateAdapter: () => [
        tasks,
        (updates) =>
          updateArgs({
            tasks: typeof updates === "function" ? updates(tasks) : updates,
          }),
      ],
      filterStateAdapter: () => [
        filters,
        (updates) =>
          updateArgs({
            filters: typeof updates === "function" ? updates(filters) : updates,
          }),
      ],
      sortStateAdapter: () => [
        sort,
        (updates) =>
          updateArgs({
            sort: typeof updates === "function" ? updates(sort) : updates,
          }),
      ],
    });
    return (
      <Backlog
        {...args}
        tasks={backlog.tasks}
        filters={backlog.filters}
        onFiltersUpdate={backlog.updateFilters}
        sort={backlog.sort}
        onSortUpdate={backlog.updateSort}
      />
    );
  },
};
