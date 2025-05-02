/* eslint-disable max-lines */
"use client";

import { useRef, useState } from "react";
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
import { IconChevronRight } from "@tabler/icons-react";
import { z } from "zod";

import type { Task, TaskInput } from "@/core/task-management";
import type { TaskCollectorRef } from "@/ui/task-management";
import { sprintPlanSchema } from "@/core/deep-work";
import { taskSchema } from "@/core/task-management";
import { SidePanel } from "@/ui/components/SidePanel";
import { FocusSession, SprintBuilder, useSprintBuilder } from "@/ui/deep-work";
import { useLocalStorageSync } from "@/ui/hooks/useLocalStorageSync";
import { useTimeTravel } from "@/ui/hooks/useTimeTravel";
import {
  Backlog,
  TaskCollector,
  useMinimalTaskList,
  useProjects,
  useTags,
  useTasks,
  useTaskSelection,
  useTasksQueryOptions,
} from "@/ui/task-management";
import { cn } from "@/ui/utils";

const TIME_TRAVEL_ENABLED = true;

export default function SessionPage() {
  const router = useRouter();

  const tasks = useTasks();

  const taskList = useMinimalTaskList(tasks.items);

  const taskCollectorFormRef = useRef<TaskCollectorRef>(null);

  // MARK: State

  const [stage, setStage] = useState<"task-collector" | "sprint-builder">();

  const sprintBuilder = useSprintBuilder(taskList.tasks, {
    onError: (error) => console.error(error),
  });

  const localStorageSync = useLocalStorageSync({
    key: "session-page",
    state: {
      tasks: taskList.taskIds,
      sprints: sprintBuilder.sprints,
    },
    schema: z.object({
      tasks: taskSchema.shape.id.array(),
      sprints: sprintPlanSchema.array(),
    }),
    read: (storedState) => {
      if (storedState === null) return setStage("task-collector");
      taskList.setTaskIds(storedState.tasks);
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

  const importableTasks = tasks.loading
    ? []
    : tasks.items.filter((task) => !taskList.taskIds.includes(task.id));

  const { projects, createProject } = useProjects();
  const { tags, createTag } = useTags();

  const { filterTasks, ...backlogQueryoptions } = useTasksQueryOptions();
  const backlogTasks = filterTasks(importableTasks).sort(
    backlogQueryoptions.sortFn,
  );
  const [isBacklogPanelOpen, backlogPanel] = useDisclosure();
  const backlogTaskSelection = useTaskSelection();

  // MARK: User Actions

  const handleShowTaskCollector = () => {
    setStage("task-collector");
    // taskList.history.reset();
  };

  const handleShowSprintBuilder = () => {
    if (sprintBuilder.sprints.length === 0) sprintBuilder.addSprints([{}, {}]);
    setStage("sprint-builder");
    // taskList.history.reset();
  };

  const handleStartSession = () => {
    const validSprints = sprintBuilder.sprints.filter(
      (sprint) => sprint.tasks.length > 0,
    );
    if (validSprints.length === 0) return;
    sessionModal.open();
  };

  const timeTravel = useTimeTravel({
    onNavigated: ({ event, action }) => {
      if (event === "push") return;
      notifications.show({
        title: event,
        message: action,
        position: "top-right",
      });
    },
  });

  const handleCreateTask = TIME_TRAVEL_ENABLED
    ? timeTravel.createAction({
        name: "create-task",
        apply: (input: TaskInput) =>
          tasks.addTask(input).then((task) => {
            taskList.addTask(task.id);
            // QUICKFIX - This is needed because new tasks are not displayed in the form anymore after updating an existing task
            taskCollectorFormRef.current?.reset();
            return task;
          }),
        revert: (task) => {
          taskList.removeTask(task.id);
          void tasks.deleteTask(task.id);
          // QUICKFIX - This is needed because new tasks are not displayed in the form anymore after updating an existing task
          taskCollectorFormRef.current?.reset();
        },
      })
    : (input: TaskInput) =>
        void tasks.addTask(input).then((task) => {
          taskList.addTask(task.id);
          // QUICKFIX - This is needed because new tasks are not displayed in the form anymore after updating an existing task
          taskCollectorFormRef.current?.reset();
        });

  const handleAddTasks = TIME_TRAVEL_ENABLED
    ? timeTravel.createAction({
        name: "add-tasks",
        apply: (taskIds: Task["id"][]) => {
          taskList.addTasks(taskIds);
          // QUICKFIX - This is needed because new tasks are not displayed in the form anymore after updating an existing task
          taskCollectorFormRef.current?.reset();
          return taskIds;
        },
        revert: (taskIds) => {
          taskList.removeTasks(taskIds);
          // QUICKFIX - This is needed because new tasks are not displayed in the form anymore after updating an existing task
          taskCollectorFormRef.current?.reset();
        },
      })
    : (taskIds: Task["id"][]) => {
        taskList.addTasks(taskIds);
        // QUICKFIX - This is needed because new tasks are not displayed in the form anymore after updating an existing task
        taskCollectorFormRef.current?.reset();
      };

  const handleRemoveTask = TIME_TRAVEL_ENABLED
    ? timeTravel.createAction({
        name: "remove-task",
        apply: async (taskId: Task["id"], shouldDelete = false) => {
          taskList.removeTask(taskId);
          const taskToRestore = shouldDelete
            ? await tasks.deleteTask(taskId)
            : undefined;
          return {
            taskId,
            taskToRestore,
          };
        },
        revert: ({ taskId, taskToRestore }) => {
          taskList.addTask(taskId);
          if (taskToRestore) void tasks.insertTask(taskToRestore);
        },
      })
    : (taskId: Task["id"], shouldDelete = false) => {
        taskList.removeTask(taskId);
        if (shouldDelete) void tasks.deleteTask(taskId);
      };

  const handleUpdateTask = TIME_TRAVEL_ENABLED
    ? timeTravel.createAction({
        name: "update-task",
        apply: (taskId: Task["id"], updates: Partial<TaskInput>) =>
          tasks.updateTask(taskId, updates).then((state) => state?.prev),
        revert: (prevState) => {
          if (!prevState) return;
          tasks.insertTask(prevState);

          // TODO This should only revert the actual change, not the whole task
          // as some fields might have been chnaged externally
          taskCollectorFormRef.current?.resetTask(prevState.id, prevState);
        },
      })
    : (taskId: Task["id"], updates: Partial<TaskInput>) =>
        void tasks.updateTask(taskId, updates);

  const handleUpdateTaskDebounced = useDebouncedCallback(
    handleUpdateTask,
    1_000,
  );

  useHotkeys(
    TIME_TRAVEL_ENABLED
      ? [
          ["mod+z", timeTravel.undo],
          ["mod+shift+z", timeTravel.redo],
        ]
      : [],
  );

  const [
    isDeleteModalOpen,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);

  const handleReset = () => {
    if (taskList.tasks.length > 0) return openDeleteModal();
    localStorageSync.clear();
    // taskList.history.reset();
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
              ref={taskCollectorFormRef}
              onUpdateTask={handleUpdateTaskDebounced}
              onRemoveTask={handleRemoveTask}
              onAddTask={handleCreateTask}
              projects={projects}
              onCreateProject={createProject}
              tags={tags}
              onCreateTag={createTag}
              allowImport={importableTasks.length > 0}
              onRequestImport={backlogPanel.open}
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
              size="md"
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
                    size="md"
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
                    size="md"
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
              // backlog.addTasks(taskList.tasks);
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

              handleAddTasks(taskIds);

              backlogTaskSelection.clearSelection();
              backlogPanel.close();
            }}
          >
            {backlogTaskSelection.selection.length === 0
              ? "Select Tasks to Add"
              : "Add Tasks"}
          </Button>
        </Flex>
      </SidePanel>
    </>
  );
}
