/* eslint-disable max-lines */
"use client";

import { useEffect, useRef, useState } from "react";
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
  Transition,
} from "@mantine/core";
import { useDebouncedCallback, useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconChevronRight } from "@tabler/icons-react";
import { s } from "vitest/dist/types-198fd1d9.js";

import type { SprintPlan } from "@/core/deep-work";
import type {
  TaskId,
  TaskInsert,
  TaskTree,
  TaskUpdate,
} from "@/core/task-management";
import type { SprintBuilderProps } from "@/ui/deep-work";
import { SidePanel } from "@/ui/components/SidePanel";
import {
  FocusSession,
  SprintBuilder,
  useSessionPlanningState,
} from "@/ui/deep-work";
import { useTimeTravel } from "@/ui/hooks/useTimeTravel";
import {
  Backlog,
  TaskCollector,
  useCreateProject,
  useCreateTask,
  useDeleteTask,
  useProjectsQuery,
  useTaskSelection,
  useTasksQueryOptions,
  useTasksWithSubtasksQuery,
  useUpdateTask,
} from "@/ui/task-management";
import { cn } from "@/ui/utils";

export default function SessionPage() {
  const router = useRouter();

  const planning = useSessionPlanningState();
  const [status, setStatus] = useState<"task-collector" | "sprint-builder">();
  useEffect(() => {
    if (status) return;
    if (!planning.ready) return;
    if (planning.sprints.length > 0) return setStatus("sprint-builder");
    return setStatus("task-collector");
  }, [planning.tasks, planning.sprints, planning.ready, status]);

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

  // useHotkeys([
  //   ["mod+z", timeTravel.undo],
  //   ["mod+shift+z", timeTravel.redo],
  // ]);

  // MARK: Task Collector

  const taskPool = useTasksWithSubtasksQuery({
    ids: planning.tasks,
    where: "include",
  });

  const isLoading = taskPool.isLoading || status === undefined;

  const { mutateAsync: createTask } = useCreateTask();
  const { mutateAsync: updateTask } = useUpdateTask();
  const { mutateAsync: deleteTask } = useDeleteTask();

  const { data: importableTasks = [] } = useTasksWithSubtasksQuery({
    ids: planning.tasks,
    where: "exclude",
  });

  const { data: projects = [] } = useProjectsQuery();
  const { mutate: createProject } = useCreateProject();

  const { filterTasks, ...backlogQueryoptions } = useTasksQueryOptions();
  const backlogTasks = filterTasks(importableTasks).sort(
    backlogQueryoptions.sortFn,
  );
  const [isBacklogPanelOpen, backlogPanel] = useDisclosure();
  const backlogTaskSelection = useTaskSelection();

  const handleCreateTask = timeTravel.createAction({
    name: "create-task",
    apply: (input: TaskInsert) =>
      createTask(input, {
        onSuccess: (task) => {
          if (!task) return;
          planning.addTasks([task.uid]);
        },
      }),
    revert: (task) => {
      if (!task) return;
      planning.removeTasks([task.uid]);
      void deleteTask(task.uid);
    },
  });

  const handleAddTasks = timeTravel.createAction({
    name: "add-tasks",
    apply: (taskIds: TaskTree["uid"][]) => {
      planning.addTasks(taskIds);

      return taskIds;
    },
    revert: (taskIds) => {
      planning.removeTasks(taskIds);
    },
  });

  const handleRemoveTask = timeTravel.createAction({
    name: "remove-task",
    apply: async (taskId: TaskTree["uid"], shouldDelete = false) => {
      planning.removeTasks([taskId]);

      if (!shouldDelete) return { uid: taskId };

      const taskToRestore = await deleteTask(taskId);
      void taskPool.refetch();

      return { uid: taskId, taskToRestore };
    },
    revert: ({ uid, taskToRestore }) => {
      planning.addTasks([uid]);

      if (taskToRestore) void createTask(taskToRestore);
    },
  });

  // TODO On update subtask, query might need to be refetched
  const handleUpdateTask = timeTravel.createAction({
    name: "update-task",
    apply: (uid: TaskId, updates: TaskUpdate) =>
      updateTask({
        uid,
        ...updates,
      }),
    revert: () => {
      // TODO Revert to previous state
      // if (!prevState) return;
      // await createTask(prevState);
      // TODO This should only revert the actual change, not the whole task
      // as some fields might have been chnaged externally
      // taskCollectorFormRef.current?.resetTask(prevState.uid, prevState);
    },
  });

  const handleUpdateTaskDebounced = useDebouncedCallback(
    handleUpdateTask,
    1_000,
  );

  // MARK: Sprint Builder

  const handleAddSprint: SprintBuilderProps["onAddSprint"] =
    timeTravel.createAction({
      name: "add-sprint",
      apply: (tasks, callback) =>
        new Promise<SprintPlan["id"]>((resolve) => {
          planning.createSprint(
            { duration: { minutes: 25 }, tasks },
            (sprint) => {
              callback?.(sprint.id);
              resolve(sprint.id);
            },
          );
        }),
      revert: (sprintId) => planning.removeSprint(sprintId),
    });

  const handleUpdateSprint: SprintBuilderProps["onUpdateSprint"] =
    timeTravel.createAction({
      name: "update-sprint",
      apply: (sprintId, updates) =>
        new Promise<{
          sprintId: SprintPlan["id"];
          previous: Partial<SprintPlan>;
        }>((resolve) => {
          planning.updateSprint(
            { id: sprintId, data: updates },
            ({ previous }) => {
              resolve({ sprintId, previous });
            },
          );
        }),
      revert: ({ sprintId, previous }) =>
        planning.updateSprint({ id: sprintId, data: previous }),
    });

  const handleDropSprint: SprintBuilderProps["onDropSprint"] =
    timeTravel.createAction({
      name: "drop-sprint",
      apply: (sprint) =>
        new Promise<SprintPlan>((resolve) => {
          planning.removeSprint(sprint.id);
          resolve(sprint);
        }),
      revert: (sprint) => planning.insertSprint({ sprint }),
    });

  const handleReorderSprints: SprintBuilderProps["onReorderSprints"] =
    timeTravel.createAction({
      name: "reorder-sprints",
      apply: (from, to) =>
        new Promise<{ from: number; to: number }>((resolve) => {
          planning.reorderSprints({ from, to }, ({ from, to }) => {
            resolve({ from, to });
          });
        }),
      revert: ({ from, to }) => planning.reorderSprints({ from: to, to: from }),
    });

  const handleAssignTasksToSprint: SprintBuilderProps["onAssignTasksToSprint"] =
    timeTravel.createAction({
      name: "assign-tasks-to-sprint",
      apply: ({ sprintId, tasks }) => {
        planning.addTasksToSprint({ sprintId, tasks });

        return { sprintId, tasks };
      },
      revert: ({ sprintId, tasks }) =>
        planning.removeTasksFromSprint({ sprintId, tasks }),
    });

  const handleUnassignTasksFromSprint: SprintBuilderProps["onUnassignTasksFromSprint"] =
    timeTravel.createAction({
      name: "unassign-tasks-from-sprint",
      apply: ({ sprintId, tasks }) => {
        planning.removeTasksFromSprint({ sprintId, tasks });
        return { sprintId, tasks };
      },
      revert: ({ sprintId, tasks }) =>
        planning.addTasksToSprint({ sprintId, tasks }),
    });

  const handleMoveTasks: SprintBuilderProps["onMoveTask"] =
    timeTravel.createAction({
      name: "move-tasks",
      apply: ({ sourceSprint, targetSprint, tasks, targetIndex }) =>
        new Promise<{
          sourceSprint: SprintPlan["id"];
          targetSprint: SprintPlan["id"];
          tasks: TaskId[];
          sourceIndex?: number;
        }>((resolve) => {
          planning.moveTasksBetweenSprints(
            {
              sourceSprint,
              targetSprint,
              tasks,
              targetIndex,
            },
            ({ sourceIndex }) => {
              resolve({ sourceSprint, targetSprint, tasks, sourceIndex });
            },
          );
        }),
      revert: ({ sourceSprint, targetSprint, tasks, sourceIndex }) =>
        planning.moveTasksBetweenSprints({
          sourceSprint: targetSprint,
          targetSprint: sourceSprint,
          tasks,
          targetIndex: sourceIndex,
        }),
    });

  const handleReorderSprintTasks: SprintBuilderProps["onReorderSprintTasks"] =
    timeTravel.createAction({
      name: "reorder-sprint-tasks",
      apply: ({ sprintId, from, to }) => {
        planning.reorderSprintTasks({ sprintId, from, to });

        return { sprintId, from, to };
      },
      revert: ({ sprintId, from, to }) =>
        planning.reorderSprintTasks({ sprintId, from: to, to: from }),
    });

  // MARK: State

  const [isSessionModalOpen, sessionModal] = useDisclosure(false);

  // TODO Move to useLocalFocusSessionPlan
  const sprintBuilderError = (() => {
    if (!taskPool.data?.length)
      return "Before you can define sprints, you need to collect your tasks.";
  })();

  // TODO Move to useLocalFocusSessionPlan
  const startSessionError = (() => {
    if (planning.sprints.length === 0)
      return "Before you start the session, you need to define your sprints.";
    if (planning.sprints.every(({ tasks }) => tasks.length === 0))
      return "Before you start the session, you need to assign some tasks to your sprints.";
  })();

  // MARK: User Actions

  const handleShowTaskCollector = () => {
    setStatus("task-collector");
  };

  const handleShowSprintBuilder = () => {
    if (planning.sprints.length === 0)
      planning.createSprint({ duration: { minutes: 25 }, tasks: [] });
    setStatus("sprint-builder");
  };

  const handleStartSession = () => {
    const validSprints = planning.sprints.filter(
      (sprint) => sprint.tasks.length > 0,
    );
    if (validSprints.length === 0) return;
    sessionModal.open();
  };

  const [
    isDeleteModalOpen,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);

  const handleReset = () => {
    if (taskPool.data?.length) return openDeleteModal();
    // localStorageSync.clear();
    // taskList.history.reset();
    router.push("/");
  };

  return (
    <>
      <Transition mounted={isLoading} transition="fade" duration={500}>
        {(styles) => (
          <LoadingOverlay
            loaderProps={{ type: "dots" }}
            visible
            overlayProps={{ backgroundOpacity: 0 }}
            style={styles}
          />
        )}
      </Transition>
      <AppShell.Main display="flex" className="h-dvh flex-col">
        <Tabs
          value={status}
          className={cn(
            "flex! h-full min-h-0 grow-0 flex-col! transition-opacity duration-500",
            {
              "opacity-0": isLoading,
            },
          )}
          classNames={{
            panel: cn("my-auto min-h-0"),
            tabLabel: "text-5xl font-thin",
          }}
        >
          <Tabs.Panel value="task-collector" py="xl">
            <TaskCollector
              className="mx-auto max-h-full"
              items={taskPool.data ?? []}
              onUpdateTask={handleUpdateTaskDebounced}
              onRemoveTask={handleRemoveTask}
              onAddTask={handleCreateTask}
              projects={projects}
              onCreateProject={createProject}
              allowImport={importableTasks.length > 0}
              onRequestImport={backlogPanel.open}
            />
          </Tabs.Panel>
          <Tabs.Panel value="sprint-builder" px="lg">
            <SprintBuilder
              className="mx-auto max-h-[70dvh] min-h-[400px] w-fit"
              sprints={planning.sprints}
              taskPool={taskPool.data ?? []}
              onAddSprint={handleAddSprint}
              onUpdateSprint={handleUpdateSprint}
              onDropSprint={handleDropSprint}
              onReorderSprints={handleReorderSprints}
              onAssignTasksToSprint={handleAssignTasksToSprint}
              onUnassignTasksFromSprint={handleUnassignTasksFromSprint}
              onMoveTask={handleMoveTasks}
              onReorderSprintTasks={handleReorderSprintTasks}
            />
          </Tabs.Panel>

          <Box
            className={cn("mt-auto transition-transform delay-500", {
              "translate-y-full": isLoading,
            })}
          >
            <Divider />

            <Flex align="center" px="xl" py="lg" gap={4}>
              <Button
                size="md"
                flex={1}
                fullWidth
                variant="light"
                color={status === "task-collector" ? "primary" : "gray"}
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
                      color={status === "sprint-builder" ? "primary" : "gray"}
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
            sprints={planning.sprints}
            tasks={taskPool.data ?? []}
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
            onFiltersUpdate={backlogQueryoptions.updateFilters}
            onSortUpdate={backlogQueryoptions.updateSort}
            selectedTasks={backlogTaskSelection.selection}
            onToggleTaskSelection={backlogTaskSelection.toggleTaskSelection}
          />
          <Button
            disabled={backlogTaskSelection.selection.length === 0}
            fullWidth
            onClick={() => {
              const taskIds = backlogTaskSelection.selection;

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
