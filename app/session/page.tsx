/* eslint-disable max-lines */
"use client";

import { useRouter } from "next/navigation";
import {
  Button,
  Container,
  Flex,
  LoadingOverlay,
  Modal,
  SimpleGrid,
  Space,
  Text,
  Transition,
} from "@mantine/core";
import { useDebouncedCallback, useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";

import type { SprintPlan } from "@/core/deep-work";
import type { TaskId, TaskInput } from "@/core/task-management";
import type { FocusSessionPlannerProps } from "@/ui/deep-work";
import { Main } from "@/app/shell";
import {
  FocusSession,
  FocusSessionPlanner,
  useSessionPlanningState,
} from "@/ui/deep-work";
import { useTimeTravel } from "@/ui/hooks/useTimeTravel";
import {
  useCreateProject,
  useCreateTask,
  useDeleteTask,
  useFlatTasksQuery,
  useProjectsQuery,
  useUpdateTask,
} from "@/ui/task-management";
import { cn } from "@/ui/utils";

export default function SessionPage() {
  const router = useRouter();

  const planning = useSessionPlanningState();

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

  const taskPool = useFlatTasksQuery({
    ids: planning.tasks,
    where: "include",
  });

  const isLoading = taskPool.isLoading || !planning.ready;

  const { mutateAsync: createTask } = useCreateTask();
  const { mutateAsync: updateTask } = useUpdateTask();
  const { mutateAsync: deleteTask } = useDeleteTask();

  const { data: importableTasks = [] } = useFlatTasksQuery({
    ids: planning.tasks,
    where: "exclude",
  });

  const { data: projects = [] } = useProjectsQuery();
  const { mutate: createProject } = useCreateProject();

  const handleCreateTask: FocusSessionPlannerProps["onCreateTask"] =
    timeTravel.createAction({
      name: "create-task",
      apply: (input: TaskInput) =>
        createTask(input, {
          onSuccess: (task) => {
            if (!task) return;
            planning.addTasks([task.uid]);
            if (task.parentTaskId) planning.removeTasks([task.parentTaskId]);
          },
        }),
      revert: (task) => {
        if (!task) return;
        planning.removeTasks([task.uid]);
        void deleteTask(task.uid);
      },
    });

  const handleAddTasks: FocusSessionPlannerProps["onAddTasks"] =
    timeTravel.createAction({
      name: "add-tasks",
      apply: (taskIds) => {
        planning.addTasks(taskIds);

        return taskIds;
      },
      revert: (taskIds) => {
        planning.removeTasks(taskIds);
      },
    });

  const handleRemoveTasks: FocusSessionPlannerProps["onRemoveTasks"] =
    timeTravel.createAction({
      name: "remove-tasks",
      apply: async (taskIds, shouldDelete = false) => {
        planning.removeTasks(taskIds);

        if (!shouldDelete) return { ids: taskIds };

        const tasksToRestore = await Promise.all(
          taskIds.map((taskId) => deleteTask(taskId)),
        );

        return { ids: taskIds, tasksToRestore };
      },
      revert: ({ ids, tasksToRestore }) => {
        planning.addTasks(ids);

        if (tasksToRestore)
          tasksToRestore.forEach((task) => task && void createTask(task));
      },
    });

  const handleUpdateTask: FocusSessionPlannerProps["onUpdateTask"] =
    timeTravel.createAction({
      name: "update-task",
      apply: (uid, updates) =>
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

  const handleAddSprint: FocusSessionPlannerProps["onAddSprint"] =
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

  const handleUpdateSprint: FocusSessionPlannerProps["onUpdateSprint"] =
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

  const handleDropSprint: FocusSessionPlannerProps["onDropSprint"] =
    timeTravel.createAction({
      name: "drop-sprint",
      apply: (sprint) =>
        new Promise<SprintPlan>((resolve) => {
          planning.removeSprint(sprint.id);
          resolve(sprint);
        }),
      revert: (sprint) => planning.insertSprint({ sprint }),
    });

  const handleReorderSprints: FocusSessionPlannerProps["onReorderSprints"] =
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

  const handleAssignTasksToSprint: FocusSessionPlannerProps["onAssignTasksToSprint"] =
    timeTravel.createAction({
      name: "assign-tasks-to-sprint",
      apply: ({ sprintId, tasks }) => {
        planning.addTasksToSprint({ sprintId, tasks });

        return { sprintId, tasks };
      },
      revert: ({ sprintId, tasks }) =>
        planning.removeTasksFromSprint({ sprintId, tasks }),
    });

  const handleUnassignTasksFromSprint: FocusSessionPlannerProps["onUnassignTasksFromSprint"] =
    timeTravel.createAction({
      name: "unassign-tasks-from-sprint",
      apply: ({ sprintId, tasks }) => {
        planning.removeTasksFromSprint({ sprintId, tasks });
        return { sprintId, tasks };
      },
      revert: ({ sprintId, tasks }) =>
        planning.addTasksToSprint({ sprintId, tasks }),
    });

  const handleMoveTasks: FocusSessionPlannerProps["onMoveTask"] =
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

  const handleReorderSprintTasks: FocusSessionPlannerProps["onReorderSprintTasks"] =
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

  // MARK: User Actions

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
    if (planning.tasks.length) return openDeleteModal();
    // localStorageSync.clear();
    // taskList.history.reset();
    router.push("/");
  };

  const handleCleanUp = () => {
    planning.reset();
    timeTravel.reset();
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
      <Main display="flex" className="h-dvh flex-col">
        <Container className="min-h-0 py-16" fluid>
          <FocusSessionPlanner
            className={cn("h-full min-h-0 transition-opacity duration-500", {
              "opacity-0": isLoading,
            })}
            tasks={taskPool.data ?? []}
            importableTasks={importableTasks}
            onUpdateTask={handleUpdateTaskDebounced}
            onRemoveTasks={handleRemoveTasks}
            onCreateTask={handleCreateTask}
            onAddTasks={handleAddTasks}
            sprints={planning.sprints}
            onAddSprint={handleAddSprint}
            onUpdateSprint={handleUpdateSprint}
            onDropSprint={handleDropSprint}
            onReorderSprints={handleReorderSprints}
            onAssignTasksToSprint={handleAssignTasksToSprint}
            onUnassignTasksFromSprint={handleUnassignTasksFromSprint}
            onMoveTask={handleMoveTasks}
            onReorderSprintTasks={handleReorderSprintTasks}
            projects={projects}
            onCreateProject={createProject}
          />
        </Container>
        <Flex
          justify="space-between"
          p="lg"
          gap="md"
          className={cn("mt-auto transition-transform duration-500", {
            "translate-y-full": isLoading,
          })}
        >
          <Button
            size="lg"
            radius="md"
            color="grey"
            variant="subtle"
            onClick={() => handleReset()}
          >
            Reset Session
          </Button>
          <Button
            size="lg"
            radius="md"
            disabled={planning.sprints.every(({ tasks }) => tasks.length === 0)}
            onClick={handleStartSession}
          >
            Start Session
          </Button>
        </Flex>
      </Main>

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
        radius="md"
        transitionProps={{ transition: "pop" }}
        withCloseButton={false}
        opened={isDeleteModalOpen}
        onClose={closeDeleteModal}
      >
        <Text className="text-center text-balance">
          Do you want to keep your tasks or delete them permanently?
        </Text>
        <Space h="lg" />
        <SimpleGrid cols={2}>
          <Button
            color="red"
            variant="light"
            onClick={() => {
              void Promise.all(planning.tasks.map((task) => deleteTask(task)));
              handleCleanUp();
            }}
          >
            Delete
          </Button>
          <Button
            onClick={() => {
              handleCleanUp();
            }}
          >
            Keep
          </Button>
        </SimpleGrid>
      </Modal>
    </>
  );
}
