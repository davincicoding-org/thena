"use client";

import { AppShell, Button, Center, Tabs } from "@mantine/core";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";
import { IconChevronRight } from "@tabler/icons-react";

import { SprintPlan } from "@/core/deep-work";
import { Task } from "@/core/task-management";
import { SessionPlanner, useSessionPlanner } from "@/ui/deep-work";
import { useDerivedStateUpdater, useTemporalState } from "@/ui/hooks";
import { TaskList, useTaskList } from "@/ui/task-management";
import { StateSetter } from "@/ui/utils";

type Stage = "task-list" | "session-planner" | "session-runner";

export default function SessionPage() {
  const [localState, setLocalState] = useLocalStorage<{
    stage: Stage;
    tasks: Task[];
    sprints: SprintPlan[];
  }>({
    key: "session-planner",
    defaultValue: {
      stage: "task-list",
      tasks: [],
      sprints: [],
    },
  });

  const [{ tasks, stage }, setState, history] = useTemporalState({
    externalState: [localState, setLocalState],
  });

  useHotkeys([
    ["mod+z", history.undo],
    ["mod+shift+z", history.redo],
  ]);

  const setTasks = useDerivedStateUpdater({
    setState,
    transformer: ({ tasks }) => tasks,
    updater: (prev, tasks) => ({ ...prev, tasks }),
  });

  return (
    <AppShell.Main display="grid">
      <Center>
        <Tabs value={stage}>
          <Tabs.Panel value="task-list">
            <CollectTasks
              tasks={tasks}
              setTasks={setTasks}
              onComplete={() => {
                setState((prev) => ({ ...prev, stage: "session-planner" }));
                history.reset();
              }}
            />
          </Tabs.Panel>
          <Tabs.Panel value="session-planner">
            <PlanSession
              tasks={tasks}
              onComplete={(sprints) => {
                setState((prev) => ({
                  ...prev,
                  sprints,
                  stage: "session-runner",
                }));
              }}
            />
          </Tabs.Panel>
          <Tabs.Panel value="session-runner">COMING SOON</Tabs.Panel>
        </Tabs>
      </Center>
    </AppShell.Main>
  );
}

function CollectTasks({
  tasks,
  setTasks,
  onComplete,
}: {
  tasks: Task[];
  setTasks: StateSetter<Task[]>;
  onComplete: () => void;
}) {
  const taskList = useTaskList({
    externalState: [tasks, setTasks],
  });
  return (
    <>
      <TaskList
        className="w-sm"
        items={taskList.items}
        onUpdateTask={taskList.updateTask}
        onRemoveTask={taskList.removeTask}
        onAddTask={taskList.addTask}
      />
      <Center pos="fixed" className="inset-x-0 bottom-0" p="lg">
        <Button
          size="lg"
          disabled={tasks.length === 0}
          rightSection={<IconChevronRight />}
          onClick={onComplete}
        >
          Plan Session
        </Button>
      </Center>
    </>
  );
}

function PlanSession({
  tasks,
  onComplete,
}: {
  tasks: Task[];
  onComplete: (sprints: SprintPlan[]) => void;
}) {
  const sessionPlanner = useSessionPlanner(tasks, { initialSprints: 2 });
  // TODO: Sync with local state
  // TODO: Add more tasks
  // TODO: Drop tasks
  return (
    <>
      <SessionPlanner
        className="max-h-[70dvh] min-h-[400px]"
        sprints={sessionPlanner.sprints}
        unassignedTasks={sessionPlanner.unassignedTasks}
        onAddSprint={() => sessionPlanner.addSprint({})}
        onDropSprint={sessionPlanner.dropSprint}
        onSprintChange={sessionPlanner.updateSprint}
        onAssignTasksToSprint={sessionPlanner.assignTasks}
        onUnassignTasksFromSprint={sessionPlanner.unassignTasks}
        onMoveTasks={sessionPlanner.moveTasks}
      />
      <Center pos="fixed" className="inset-x-0 bottom-0" p="lg">
        <Button
          disabled={sessionPlanner.unassignedTasks.length > 0}
          size="lg"
          rightSection={<IconChevronRight />}
          onClick={() => onComplete(sessionPlanner.sprints)}
        >
          Start Session
        </Button>
      </Center>
    </>
  );
}
