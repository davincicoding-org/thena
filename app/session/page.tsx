"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AppShell,
  Box,
  Button,
  Center,
  Flex,
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
import { SidePanel } from "@/ui/components/SidePanel";
import {
  initializeSprints,
  SessionPlanner,
  useSessionPlanner,
} from "@/ui/deep-work";
import { useDerivedStateUpdater, useTemporalState } from "@/ui/hooks";
import {
  Backlog,
  TaskCollector,
  useBacklog,
  useBacklogQueryOptions,
  useProjects,
  useTags,
  useTaskList,
} from "@/ui/task-management";
import { StateSetter } from "@/ui/utils";

type Stage = "task-collector" | "session-planner" | "session-runner";

export default function SessionPage() {
  const router = useRouter();

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

  // FIXME: Taks get pulled from backlog -> user undos action -> pulled tasks are permanently deleted
  const [{ stage, tasks, sprints }, setState, history] = useTemporalState({
    externalState: [localState, setLocalState],
  });

  useHotkeys([
    ["mod+z", history.undo],
    ["mod+shift+z", history.redo],
  ]);

  // ------- Tasks -------

  const setTasks = useDerivedStateUpdater(setState, {
    get: ({ tasks }) => tasks,
    set: (prev, tasks) => ({ ...prev, tasks }),
  });

  const setTasksDebounced = useDebouncedCallback<StateSetter<Task[]>>(
    setTasks,
    1_000,
  );

  const taskList = useTaskList({
    externalState: [tasks, setTasksDebounced],
  });

  const { projects, createProject } = useProjects();
  const { tags, createTag } = useTags();

  const backlog = useBacklog();
  const backlogQuery = useBacklogQueryOptions();
  const backlogTasks = useMemo(
    () => backlogQuery.filterItems(backlog.tasks),
    [backlog.tasks, backlogQuery.filterItems],
  );
  const [isBacklogPanelOpen, backlogPanel] = useDisclosure();
  const [tasksToPullFromBacklog, setTasksToPullFromBacklog] = useState<Task[]>(
    [],
  );

  // ------- Sprints -------

  const setSprints = useDerivedStateUpdater(setState, {
    get: ({ sprints }) => sprints,
    set: (prev, sprints) => ({ ...prev, sprints }),
  });

  // ------- Abort -------

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
    <>
      <AppShell.Main display="grid">
        <Center>
          <Tabs value={stage}>
            <Tabs.Panel value="task-collector">
              <TaskCollector
                className="w-sm"
                items={taskList.items}
                onUpdateTask={taskList.updateTask}
                onRemoveTask={taskList.removeTask}
                onAddTask={taskList.addTask}
                projects={projects}
                onCreateProject={createProject}
                tags={tags}
                onCreateTag={createTag}
                allowPullFromBacklog={backlog.tasks.length > 0}
                onRequestToPullFromBacklog={backlogPanel.open}
              />
              <Button
                pos="absolute"
                right={24}
                bottom={24}
                size="lg"
                disabled={tasks.length === 0}
                rightSection={<IconChevronRight />}
                onClick={() => {
                  setState((prev) => ({ ...prev, stage: "session-planner" }));
                  history.reset();
                }}
              >
                Plan Session
              </Button>
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
      </AppShell.Main>

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
              backlog.addTasks(tasks);
              handleReset();
              router.push("/");
            }}
          >
            Move to Backlog
          </Button>
        </SimpleGrid>
      </Modal>

      <SidePanel
        opened={isBacklogPanelOpen}
        onClose={() => {
          setTasksToPullFromBacklog([]);
          backlogPanel.close();
        }}
      >
        <Flex className="h-full" direction="column" gap="md">
          <Backlog
            flex={1}
            className="min-h-0"
            mode="select"
            tasks={backlogTasks}
            filters={backlogQuery.filters}
            sort={backlogQuery.sort}
            projects={projects}
            tags={tags}
            onFiltersUpdate={backlogQuery.updateFilters}
            onSortUpdate={backlogQuery.updateSort}
            onTaskSelectionChange={setTasksToPullFromBacklog}
          />
          <Button
            disabled={tasksToPullFromBacklog.length === 0}
            fullWidth
            onClick={() => {
              taskList.addTasks(tasksToPullFromBacklog);
              backlog.deleteTasks(tasksToPullFromBacklog.map(({ id }) => id));
              // QUICKFIX: Since history backlog state is not tracked, we need to reset the history to disable undo
              history.reset();
              setTasksToPullFromBacklog([]);
              backlogPanel.close();
            }}
          >
            {tasksToPullFromBacklog.length === 0
              ? "Select Tasks to Pull"
              : "Pull Tasks"}
          </Button>
        </Flex>
      </SidePanel>
    </>
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
  return <></>;
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
