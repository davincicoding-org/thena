import type { Meta, StoryObj } from "@storybook/react";

import { SprintBuilder } from "./SprintBuilder";
import { useSprintBuilder } from "./useSprintBuilder";

const Playground = () => {
  const {
    sprints,
    tasks,
    unassignedTasks,
    updateSprint,
    assignTasks,
    unassignTasks,
    moveTasks,
    addSprint,
    dropSprint,
    reorderSprints,
    reorderSprintTasks,
  } = useSprintBuilder(
    [
      {
        id: "app",
        title: "Building an app",
        subtasks: [
          {
            id: "1",
            title: "Gather requirements",
          },
          {
            id: "2",
            title: "Design the UI",
          },
          {
            id: "3",
            title: "Implement the UI",
          },
          {
            id: "4",
            title: "Test the app",
          },
        ],
      },
      {
        id: "website",
        title: "Company website redesign",
        subtasks: [
          {
            id: "w1",
            title: "Analyze current website",
          },
          {
            id: "w2",
            title: "Create wireframes",
          },
          {
            id: "w3",
            title: "Design new pages",
          },
        ],
      },
      {
        id: "marketing",
        title: "Marketing campaign",
        subtasks: [
          {
            id: "m1",
            title: "Define target audience",
          },
          {
            id: "m2",
            title: "Create content strategy",
          },
        ],
      },
      {
        id: "api",
        title: "API development",
        subtasks: [
          {
            id: "a1",
            title: "Design endpoints",
          },
          {
            id: "a2",
            title: "Implement auth system",
          },
          {
            id: "a3",
            title: "Write documentation",
          },
        ],
      },
      {
        id: "database",
        title: "Database optimization",
        subtasks: [
          {
            id: "d1",
            title: "Analyze performance issues",
          },
          {
            id: "d2",
            title: "Implement indexing strategy",
          },
        ],
      },
    ],
    {
      initialSprints: 3,
    },
  );
  return (
    <SprintBuilder
      mah="70dvh"
      sprints={sprints}
      tasks={tasks}
      unassignedTasks={unassignedTasks}
      onSprintChange={updateSprint}
      onAssignTasksToSprint={assignTasks}
      onUnassignTasksFromSprint={unassignTasks}
      onMoveTasks={moveTasks}
      onAddSprint={() => addSprint({})}
      onDropSprint={dropSprint}
      onReorderSprintTasks={reorderSprintTasks}
      onReorderSprints={reorderSprints}
    />
  );
};

const meta = {
  component: Playground,
} satisfies Meta<typeof Playground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Showcase: Story = {};
