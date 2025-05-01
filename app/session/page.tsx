"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AppShell,
  Box,
  Button,
  Divider,
  Flex,
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

import { sprintPlanSchema } from "@/core/deep-work";
import { taskSchema } from "@/core/task-management";
import { SidePanel } from "@/ui/components/SidePanel";
import { FocusSession, SprintBuilder, useSprintBuilder } from "@/ui/deep-work";
import { useLocalStorageSync } from "@/ui/hooks/useLocalStorageSync";
import {
  Backlog,
  TaskCollector,
  useBacklog,
  useBacklogQueryOptions,
  useProjects,
  useTags,
  useTaskList,
  useTaskSelection,
} from "@/ui/task-management";
import { cn } from "@/ui/utils";

export default function SessionPage() {
  const router = useRouter();

  // MARK: State

  const [stage, setStage] = useState<"task-collector" | "sprint-builder">();

  const taskList = useTaskList();

  const sprintBuilder = useSprintBuilder(taskList.tasks, {
    onError: (error) => console.error(error),
  });

  const localStorageSync = useLocalStorageSync({
    key: "session-page",
    state: {
      tasks: taskList.tasks,
      sprints: sprintBuilder.sprints,
    },
    schema: z.object({
      tasks: taskSchema.array(),
      sprints: sprintPlanSchema.array(),
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

  const sprintBuilderError = (() => {
    if (taskList.tasks.length === 0)
      return "Before you can define sprints, you need to collect your tasks.";
  })();

  const startSessionError = (() => {
    if (sprintBuilder.sprints.length === 0)
      return "Before you start the session, you need to define your sprints.";
    if (sprintBuilder.sprints.every(({ tasks }) => tasks.length === 0))
      return "Before you start the session, you need to assign some tasks to your sprints.";
  })();

  // MARK: Tasks

  const handleUpdateTask = useDebouncedCallback(taskList.updateTask, 1_000);

  const { projects, createProject } = useProjects();
  const { tags, createTag } = useTags();

  const backlog = useBacklog();
  const { filterTasks, ...backlogQueryoptions } = useBacklogQueryOptions();
  const backlogTasks = filterTasks(backlog.tasks).sort(
    backlogQueryoptions.sortFn,
  );
  const [isBacklogPanelOpen, backlogPanel] = useDisclosure();
  const backlogTaskSelection = useTaskSelection();

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
          className={cn(
            "flex! h-full min-h-0 grow-0 flex-col! transition-opacity duration-500",
            {
              "opacity-0": !localStorageSync.initialized,
            },
          )}
          classNames={{
            panel: "my-auto min-h-0",
            tabLabel: "text-5xl font-thin",
          }}
        >
          <Tabs.Panel value="task-collector" py="xl">
            <TaskCollector
              className="mx-auto max-h-full"
              items={taskList.tasks}
              onUpdateTask={handleUpdateTask}
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
              tasks={sprintBuilder.tasks}
              unassignedTasks={sprintBuilder.unassignedTasks}
              onAddSprint={(callback) => sprintBuilder.addSprint({}, callback)}
              onDropSprint={sprintBuilder.dropSprint}
              onReorderSprints={sprintBuilder.reorderSprints}
              onSprintChange={sprintBuilder.updateSprint}
              onAssignTasksToSprint={sprintBuilder.assignTasks}
              onUnassignTasksFromSprint={sprintBuilder.unassignTasks}
              onMoveTasks={sprintBuilder.moveTasks}
              onReorderSprintTasks={sprintBuilder.reorderSprintTasks}
            />
          </Tabs.Panel>

          <Divider />

          <Flex align="center" px="xl" py="lg" gap={4}>
            <Button
              size="xl"
              flex={1}
              fullWidth
              variant="light"
              color={stage === "task-collector" ? "primary" : "gray"}
              onClick={handleShowTaskCollector}
            >
              Collect Tasks
            </Button>
            <IconChevronRight size={32} stroke={1.5} opacity={0.5} />
            <HoverCard
              disabled={sprintBuilderError === undefined}
              position="top"
            >
              <HoverCard.Target>
                <Box flex={1}>
                  <Button
                    size="xl"
                    fullWidth
                    disabled={sprintBuilderError !== undefined}
                    variant="light"
                    color={stage === "sprint-builder" ? "primary" : "gray"}
                    onClick={handleShowSprintBuilder}
                  >
                    Define Sprints
                  </Button>
                </Box>
              </HoverCard.Target>
              <HoverCard.Dropdown maw={250}>
                <Text className="text-pretty">{sprintBuilderError}</Text>
              </HoverCard.Dropdown>
            </HoverCard>
            <IconChevronRight size={32} stroke={1.5} opacity={0.5} />
            <HoverCard
              disabled={startSessionError === undefined}
              position="top-end"
            >
              <HoverCard.Target>
                <Box>
                  <Button
                    size="xl"
                    disabled={startSessionError !== undefined}
                    onClick={handleStartSession}
                  >
                    Start Session
                  </Button>
                </Box>
              </HoverCard.Target>
              <HoverCard.Dropdown maw={250}>
                <Text className="text-pretty">{startSessionError}</Text>
              </HoverCard.Dropdown>
            </HoverCard>
          </Flex>

          <Box
            p="lg"
            className={cn(
              "grid hidden! grid-cols-[1fr_auto_1fr] items-center transition-transform duration-500",
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
          </Box>
        </Tabs>
      </AppShell.Main>

      <Modal.Root
        opened={isSessionModalOpen}
        fullScreen
        transitionProps={{ transition: "fade", duration: 1000 }}
        onClose={sessionModal.close}
      >
        <Modal.Content>
          <FocusSession
            sprints={sprintBuilder.sprints}
            tasks={taskList.tasks}
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
          backlogTaskSelection.clearSelection();
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
            selectedTasks={backlogTaskSelection.selection}
            onToggleTaskSelection={backlogTaskSelection.toggleTaskSelection}
          />
          <Button
            disabled={backlogTaskSelection.selection.length === 0}
            fullWidth
            onClick={() => {
              const taskIds = backlogTaskSelection.selection.map(
                ({ taskId }) => taskId,
              );

              const tasksToAdd = backlogTasks.filter(({ id }) =>
                taskIds.includes(id),
              );

              taskList.addTasks(tasksToAdd, {
                apply: () => {
                  backlog.deleteTasks(
                    backlogTaskSelection.selection.map(({ taskId }) => taskId),
                  );
                },
                revert: () => {
                  backlog.addTasks(tasksToAdd);
                  notifications.show({
                    message:
                      tasksToAdd.length === 1
                        ? "Moved Task Back to Backlog"
                        : "Moved Tasks Back to Backlog",
                    autoClose: 5000,
                    icon: <IconTransfer size={20} />,
                    position: "bottom-center",
                  });
                },
              });

              backlogTaskSelection.clearSelection();
              backlogPanel.close();
            }}
          >
            {backlogTaskSelection.selection.length === 0
              ? "Select Tasks to Pull"
              : "Pull Tasks"}
          </Button>
        </Flex>
      </SidePanel>
    </>
  );
}
