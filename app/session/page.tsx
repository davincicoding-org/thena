"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AppShell,
  Box,
  Button,
  Center,
  HoverCard,
  Menu,
  Modal,
  SimpleGrid,
  Space,
  Tabs,
  Text,
} from "@mantine/core";
import {
  useDebouncedCallback,
  useDisclosure,
  useHotkeys,
  useLocalStorage,
} from "@mantine/hooks";
import { IconChevronRight } from "@tabler/icons-react";

import { SprintPlan } from "@/core/deep-work";
import { Task } from "@/core/task-management";
import {
  initializeSprints,
  SessionPlanner,
  useSessionPlanner,
} from "@/ui/deep-work";
import { useDerivedStateUpdater, useTemporalState } from "@/ui/hooks";
import {
  TaskCollector,
  useBacklogStore,
  useProjects,
  useTags,
  useTaskList,
} from "@/ui/task-management";
import { StateSetter } from "@/ui/utils";

type Stage = "task-collector" | "session-planner" | "session-runner";

export default function SessionPage() {
  const [localState, setLocalState, removeLocalState] = useLocalStorage<{
    stage: Stage;
    tasks: Task[];
    sprints: SprintPlan[];
  }>({
    key: "session-planner",
    defaultValue: {
      stage: "task-collector",
      tasks: [],
      sprints: initializeSprints(2),
    },
  });

  const [{ stage, tasks, sprints }, setState, history] = useTemporalState({
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

  const setSprints = useDerivedStateUpdater({
    setState,
    transformer: ({ sprints }) => sprints,
    updater: (prev, sprints) => ({ ...prev, sprints }),
  });

  const router = useRouter();

  const backlogStore = useBacklogStore();

  const [
    isDeleteModalOpen,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);

  const handleReset = () => {
    removeLocalState();
    history.reset();
  };

  const handleDelete = () => {
    if (tasks.length > 0) return openDeleteModal();
    handleReset();
    router.push("/");
  };

  return (
    <AppShell.Main display="grid">
      <Center>
        <Tabs value={stage}>
          <Tabs.Panel value="task-collector">
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
              sprints={sprints}
              setSprints={setSprints}
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
      <Menu position="top-start">
        <Menu.Target>
          <Button
            pos="absolute"
            left={24}
            bottom={24}
            size="lg"
            variant="outline"
            color="gray"
          >
            Cancel
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item component={Link} href="/">
            Save Session
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item color="red" onClick={handleDelete}>
            Delete Session
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Modal
        centered
        size="sm"
        transitionProps={{ transition: "pop" }}
        withCloseButton={false}
        opened={isDeleteModalOpen}
        onClose={closeDeleteModal}
      >
        <Text className="text-center text-balance">
          Do you want to move your tasks to the backlog or delete them
          permanently?
        </Text>
        <Space h="lg" />
        <SimpleGrid cols={2}>
          <Button
            color="red"
            variant="light"
            onClick={() => {
              handleReset();
              router.push("/");
            }}
          >
            Delete
          </Button>
          <Button
            onClick={() => {
              backlogStore.addTasks(tasks);
              handleReset();
              router.push("/");
            }}
          >
            Move to Backlog
          </Button>
        </SimpleGrid>
      </Modal>
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
  const setTasksDebounced = useDebouncedCallback(setTasks, 1_000);
  const taskList = useTaskList({
    externalState: [tasks, setTasksDebounced],
  });
  const { projects, createProject } = useProjects();
  const { tags, createTag } = useTags();
  return (
    <>
      <TaskCollector
        className="w-sm"
        items={taskList.items}
        projects={projects}
        tags={tags}
        onUpdateTask={taskList.updateTask}
        onRemoveTask={taskList.removeTask}
        onAddTask={taskList.addTask}
        onCreateProject={createProject}
        onCreateTag={createTag}
      />
      <Button
        pos="absolute"
        right={24}
        bottom={24}
        size="lg"
        disabled={tasks.length === 0}
        rightSection={<IconChevronRight />}
        onClick={onComplete}
      >
        Plan Session
      </Button>
    </>
  );
}

function PlanSession({
  tasks,
  sprints,
  setSprints,
  onComplete,
}: {
  tasks: Task[];
  sprints: SprintPlan[];
  setSprints: StateSetter<SprintPlan[]>;
  onComplete: (sprints: SprintPlan[]) => void;
}) {
  const sessionPlanner = useSessionPlanner(tasks, {
    externalState: [sprints, setSprints],
  });

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
      <HoverCard
        disabled={sessionPlanner.unassignedTasks.length === 0}
        position="top-end"
      >
        <HoverCard.Target>
          <Box pos="absolute" right={24} bottom={24}>
            <Button
              size="lg"
              pos="absolute"
              right={24}
              bottom={24}
              rightSection={<IconChevronRight />}
              disabled={sessionPlanner.unassignedTasks.length > 0}
              onClick={() => onComplete(sessionPlanner.sprints)}
            >
              Start Session
            </Button>
          </Box>
        </HoverCard.Target>
        <HoverCard.Dropdown maw={250}>
          <Text>
            You have unassigned tasks. Add them to a sprint or drop them to
            start the session.
          </Text>
        </HoverCard.Dropdown>
      </HoverCard>
    </>
  );
}
