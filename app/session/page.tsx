"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AppShell,
  Box,
  Button,
  Flex,
  Group,
  HoverCard,
  LoadingOverlay,
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
} from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconChevronRight, IconTransfer } from "@tabler/icons-react";
import { z } from "zod";

import { minimalSprintPlanSchema } from "@/core/deep-work";
import { BacklogTask, taskSchema } from "@/core/task-management";
import { SidePanel } from "@/ui/components/SidePanel";
import {
  FocusSession,
  SprintBuilder,
  useFocusSession,
  useSprintBuilder,
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
import { cn } from "@/ui/utils";

export default function SessionPage() {
  const router = useRouter();

  // MARK: State

  const [stage, setStage] = useState<"task-collector" | "sprint-builder">();

  const taskList = useTaskList();

  const sprintBuilder = useSprintBuilder(taskList.tasks);

  const localStorageSync = useLocalStorageSync({
    key: "session-page",
    state: {
      tasks: taskList.tasks,
      sprints: sprintBuilder.minimalSprints,
    },
    schema: z.object({
      tasks: taskSchema.array(),
      sprints: minimalSprintPlanSchema.array(),
    }),
    read: (storedState) => {
      if (storedState === null) return setStage("task-collector");
      taskList.setTasks(storedState.tasks);
      sprintBuilder.setSprints(storedState.sprints);
      if (storedState.tasks.length === 0) return setStage("task-collector");
      if (storedState.sprints.length === 0) return setStage("task-collector");
      return setStage("sprint-builder");
    },
  });

  const [isSessionModalOpen, sessionModal] = useDisclosure(false);

  // MARK: Tasks

  const updateTask = useDebouncedCallback(taskList.updateTask, 1_000);

  const { projects, createProject } = useProjects();
  const { tags, createTag } = useTags();

  const backlog = useBacklog();
  const { filterTasks, ...backlogQueryoptions } = useBacklogQueryOptions();
  const backlogTasks = useMemo(
    () => filterTasks(backlog.tasks).sort(backlogQueryoptions.sortFn),
    [backlog.tasks, filterTasks, backlogQueryoptions.sortFn],
  );
  const [isBacklogPanelOpen, backlogPanel] = useDisclosure();
  const [tasksToPullFromBacklog, setTasksToPullFromBacklog] = useState<
    BacklogTask["id"][]
  >([]);

  // MARK: Focus Session

  const focusSession = useFocusSession({
    breakDuration: { seconds: 10 },
  });

  // MARK: User Actions

  const handleShowTaskCollector = () => {
    setStage("task-collector");
    taskList.history.reset();
  };

  const handleShowSprintBuilder = () => {
    if (sprintBuilder.sprints.length === 0) sprintBuilder.addSprints([{}, {}]);
    setStage("sprint-builder");
    taskList.history.reset();
  };

  const handleStartSession = () => {
    const validSprints = sprintBuilder.sprints.filter(
      (sprint) => sprint.tasks.length > 0,
    );
    if (validSprints.length === 0) return;
    focusSession.initialize({ sprints: validSprints });
    sessionModal.open();
  };

  useHotkeys([
    ["mod+z", taskList.history.undo],
    ["mod+shift+z", taskList.history.redo],
  ]);

  const [
    isDeleteModalOpen,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);

  const handleReset = () => {
    if (taskList.tasks.length > 0) return openDeleteModal();
    localStorageSync.clear();
    taskList.history.reset();
    router.push("/");
  };

  return (
    <>
      <LoadingOverlay
        loaderProps={{ type: "dots" }}
        visible={!localStorageSync.initialized}
      />
      <AppShell.Main display="flex" className="h-dvh flex-col">
        <Tabs
          value={stage}
          // m="auto"
          className="flex! h-full min-h-0 grow-0 flex-col!"
          classNames={{
            panel: "my-auto min-h-0",
            tabLabel: "text-5xl font-thin",
          }}
        >
          <Tabs.Panel value="task-collector" py="xl">
            <TaskCollector
              className="mx-auto max-h-full"
              items={taskList.tasks}
              onUpdateTask={updateTask}
              onRemoveTask={taskList.removeTask}
              onMoveTaskToBacklog={(task) => {
                taskList.removeTask(task.id);
                backlog.addTask(task);
              }}
              onAddTask={taskList.addTask}
              projects={projects}
              onCreateProject={createProject}
              tags={tags}
              onCreateTag={createTag}
              allowPullFromBacklog={backlog.tasks.length > 0}
              onRequestToPullFromBacklog={backlogPanel.open}
            />
          </Tabs.Panel>
          <Tabs.Panel value="sprint-builder" px="lg">
            <SprintBuilder
              className="mx-auto max-h-[70dvh] min-h-[400px] w-fit"
              sprints={sprintBuilder.sprints}
              unassignedTasks={sprintBuilder.unassignedTasks}
              onAddSprint={(callback) => sprintBuilder.addSprint({}, callback)}
              onDropSprint={sprintBuilder.dropSprint}
              onSprintChange={sprintBuilder.updateSprint}
              onAssignTasksToSprint={sprintBuilder.assignTasks}
              onUnassignTasksFromSprint={sprintBuilder.unassignTasks}
              onMoveTasks={sprintBuilder.moveTasks}
            />
          </Tabs.Panel>

          <Box
            p="lg"
            className={cn(
              "grid grid-cols-[1fr_auto_1fr] items-center transition-transform duration-500",
              {
                "translate-y-full": stage === undefined,
              },
            )}
          >
            <Button
              mr="auto"
              size="md"
              variant="subtle"
              color="gray"
              onClick={handleReset}
            >
              Reset
            </Button>

            <Group>
              <Button
                size="md"
                variant="light"
                color={stage === "task-collector" ? "primary" : "gray"}
                onClick={handleShowTaskCollector}
              >
                Collect Tasks
              </Button>
              <HoverCard disabled={taskList.tasks.length > 0} position="top">
                <HoverCard.Target>
                  <Box>
                    <Button
                      size="md"
                      disabled={taskList.tasks.length === 0}
                      variant="light"
                      color={stage === "sprint-builder" ? "primary" : "gray"}
                      onClick={handleShowSprintBuilder}
                    >
                      Define Sprints
                    </Button>
                  </Box>
                </HoverCard.Target>
                <HoverCard.Dropdown maw={250}>
                  <Text className="text-pretty">
                    Before you can define sprints, you need to collect some
                    tasks.
                  </Text>
                </HoverCard.Dropdown>
              </HoverCard>
            </Group>

            <HoverCard
              disabled={sprintBuilder.unassignedTasks.length === 0}
              position="top-end"
            >
              <HoverCard.Target>
                <Box ml="auto">
                  <Button
                    size="md"
                    rightSection={<IconChevronRight />}
                    disabled={
                      sprintBuilder.unassignedTasks.length > 0 ||
                      sprintBuilder.sprints.filter(
                        (sprint) => sprint.tasks.length === 0,
                      ).length > 0
                    }
                    onClick={handleStartSession}
                  >
                    Start Session
                  </Button>
                </Box>
              </HoverCard.Target>
              <HoverCard.Dropdown maw={250}>
                <Text>
                  You have unassigned tasks. Add them to a sprint or drop them
                  to start the session.
                </Text>
              </HoverCard.Dropdown>
            </HoverCard>
          </Box>
        </Tabs>
      </AppShell.Main>

      <Modal.Root
        opened={isSessionModalOpen}
        fullScreen
        transitionProps={{ transition: "pop" }}
        onClose={sessionModal.close}
      >
        <Modal.Content>
          <FocusSession
            currentSprint={focusSession.currentSprint}
            sessionBreak={focusSession.sessionBreak}
            status={focusSession.status}
            onFinishSprint={focusSession.finishSprint}
            onFinishBreak={focusSession.finishBreak}
          />
        </Modal.Content>
      </Modal.Root>

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
              backlog.addTasks(taskList.tasks);
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
            selectedTasks={tasksToPullFromBacklog}
            onToggleTaskSelection={(taskId) =>
              setTasksToPullFromBacklog((prev) =>
                prev.includes(taskId)
                  ? prev.filter((id) => id !== taskId)
                  : [...prev, taskId],
              )
            }
          />
          <Button
            disabled={tasksToPullFromBacklog.length === 0}
            fullWidth
            onClick={() => {
              const tasks = backlog.tasks.filter((task) =>
                tasksToPullFromBacklog.includes(task.id),
              );
              taskList.addTasks(tasks, {
                apply: () => {
                  console.log("backlog.deleteTasks", tasksToPullFromBacklog);
                  backlog.deleteTasks(tasksToPullFromBacklog);
                },
                revert: () => {
                  backlog.addTasks(tasks);
                  notifications.show({
                    message:
                      tasks.length === 1
                        ? "Moved Task Back to Backlog"
                        : "Moved Tasks Back to Backlog",
                    // color: "primary",
                    autoClose: 5000,
                    icon: <IconTransfer size={20} />,
                    position: "bottom-center",
                  });
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
