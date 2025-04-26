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
  LoadingOverlay,
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
import { Task, taskSchema } from "@/core/task-management";
import { SidePanel } from "@/ui/components/SidePanel";
import {
  initializeSprints,
  SessionPlanner,
  useSessionPlanner,
} from "@/ui/deep-work";
import { useLocalStorageSync } from "@/ui/hooks/useLocalStorageSync";
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

  const taskList = useTaskList({});
  const { initialized } = useLocalStorageSync({
    key: "session-task-list",
    state: taskList.tasks,
    schema: taskSchema.array(),
    read: (tasks) => tasks && taskList.setTasks(tasks),
  });

  const [localState, setLocalState, removeLocalState] = useLocalStorage<{
    stage: Stage;
    sprints: SprintPlan[];
  }>({
    key: "session-planner",
    defaultValue: {
      stage: "task-collector",
      sprints: initializeSprints(2),
    },
  });

  useHotkeys([
    ["mod+z", taskList.history.undo],
    ["mod+shift+z", taskList.history.redo],
  ]);

  // ------- Task List -------

  const updateTask = useDebouncedCallback(taskList.updateTask, 1_000);

  const { projects, createProject } = useProjects();
  const { tags, createTag } = useTags();

  const backlog = useBacklog();
  const { filterTasks, ...backlogQueryoptions } = useBacklogQueryOptions();
  const backlogTasks = useMemo(
    () => filterTasks(backlog.tasks),
    [backlog.tasks, filterTasks],
  );
  const [isBacklogPanelOpen, backlogPanel] = useDisclosure();
  const [tasksToPullFromBacklog, setTasksToPullFromBacklog] = useState<Task[]>(
    [],
  );

  // ------- Sprints -------

  // ------- Abort -------

  const [
    isDeleteModalOpen,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);

  const handleReset = () => {
    removeLocalState();
    taskList.history.reset();
  };

  const handleDelete = () => {
    if (taskList.tasks.length > 0) return openDeleteModal();
    handleReset();
    router.push("/");
  };

  return (
    <>
      <AppShell.Main display="grid">
        <LoadingOverlay loaderProps={{ type: "dots" }} visible={!initialized} />
        <Center>
          <Tabs value={localState.stage}>
            <Tabs.Panel value="task-collector">
              <TaskCollector
                className="w-sm"
                items={taskList.tasks}
                onUpdateTask={updateTask}
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
                disabled={taskList.tasks.length === 0}
                rightSection={<IconChevronRight />}
                onClick={() => {
                  setLocalState((prev) => ({
                    ...prev,
                    stage: "session-planner",
                  }));
                  taskList.history.reset();
                }}
              >
                Plan Session
              </Button>
            </Tabs.Panel>
            <Tabs.Panel value="session-planner">
              <PlanSession
                tasks={taskList.tasks}
                sprints={localState.sprints}
                setSprints={console.log}
                onComplete={(sprints) => {
                  setLocalState((prev) => ({
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
              taskList.addTasks(taskList.tasks);
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
            filters={backlogQueryoptions.filters}
            sort={backlogQueryoptions.sort}
            projects={projects}
            tags={tags}
            onFiltersUpdate={backlogQueryoptions.updateFilters}
            onSortUpdate={backlogQueryoptions.updateSort}
            onTaskSelectionChange={setTasksToPullFromBacklog}
          />
          <Button
            disabled={tasksToPullFromBacklog.length === 0}
            fullWidth
            onClick={() => {
              taskList.addTasks(tasksToPullFromBacklog, {
                apply: () => {
                  console.log("Delete tasks from backlog");
                  backlog.deleteTasks(
                    tasksToPullFromBacklog.map(({ id }) => id),
                  );
                },
                revert: () => {
                  console.log("Add tasks back to backlog");
                  backlog.addTasks(tasksToPullFromBacklog);
                },
              });

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
