/* eslint-disable max-lines */
"use client";

import Link from "next/link";
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
import { useTranslations } from "next-intl";

import type { SprintPlan } from "@/core/deep-work";
import type { TaskId, TaskInput } from "@/core/task-management";
import type { FocusSessionPlannerProps } from "@/ui/deep-work";
import { Main } from "@/app/(shell)/shell";
import { api } from "@/trpc/react";
import { FocusSessionPlanner, useSessionPlanningState } from "@/ui/deep-work";
import { useActiveFocusSessionStorage } from "@/ui/deep-work/focus-session/useActiveFocusSessionStorage";
import { useTimeTravel } from "@/ui/hooks/useTimeTravel";
import { cn } from "@/ui/utils";

export default function SessionPage() {
  const router = useRouter();
  const t = useTranslations("SessionPlanner");

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

  const utils = api.useUtils();

  // useHotkeys([
  //   ["mod+z", timeTravel.undo],
  //   ["mod+shift+z", timeTravel.redo],
  // ]);

  // MARK: Task Collector

  const taskPool = api.tasks.getSelection.useQuery(planning.tasks);

  const isLoading = taskPool.isLoading || !planning.ready;

  const { mutateAsync: createTask } = api.tasks.create.useMutation();
  const { mutateAsync: updateTask } = api.tasks.update.useMutation();
  const { mutateAsync: deleteTask } = api.tasks.delete.useMutation();

  const { data: importableTasks = [] } = api.tasks.list.useQuery({
    status: "todo",
  });

  const projects = api.projects.list.useQuery();

  const createProject = api.projects.create.useMutation({
    onSuccess(newProject) {
      if (!newProject) return;
      utils.projects.list.setData(
        undefined,
        (prev) => prev && [newProject, ...prev],
      );
    },
  });

  const handleCreateTask: FocusSessionPlannerProps["onCreateTask"] =
    timeTravel.createAction({
      name: "create-task",
      apply: (input: TaskInput) =>
        createTask(
          { ...input, status: "pending" },
          {
            onSuccess: (task) => {
              if (!task) return;
              planning.addTasks([{ id: task.id, parentId: task.parentId }]);
            },
          },
        ),
      revert: (task) => {
        // if (!task) return;
        // planning.removeTasks([task.id]);
        // void deleteTask({ id: task.id });
      },
    });

  const handleAddTasks: FocusSessionPlannerProps["onAddTasks"] =
    timeTravel.createAction({
      name: "add-tasks",
      apply: async (taskIds) => {
        await Promise.all(
          taskIds.map((task) =>
            updateTask(
              { id: task.id, updates: { status: "pending" } },
              {
                onSuccess() {
                  void utils.tasks.list.invalidate({ status: "todo" });
                },
              },
            ),
          ),
        );

        planning.addTasks(taskIds);

        return taskIds;
      },
      revert: (taskIds) => {
        void Promise.all(
          taskIds.map((task) =>
            updateTask({ id: task.id, updates: { status: "todo" } }),
          ),
        );

        planning.removeTasks(taskIds);
      },
    });

  const handleRemoveTasks: FocusSessionPlannerProps["onRemoveTasks"] =
    timeTravel.createAction({
      name: "remove-tasks",
      apply: async (tasks) => {
        planning.removeTasks(tasks);
        await Promise.all(
          tasks
            .filter(({ shouldDelete }) => !shouldDelete)
            .map((task) =>
              updateTask(
                { id: task.id, updates: { status: "todo" } },
                {
                  onSuccess() {
                    void utils.tasks.list.invalidate({ status: "todo" });
                  },
                },
              ),
            ),
        );

        const tasksToRestore = await Promise.all(
          tasks
            .filter(({ shouldDelete }) => shouldDelete)
            .map((task) => deleteTask({ id: task.id })),
        );

        return { tasks, tasksToRestore };
      },
      revert: ({ tasks, tasksToRestore }) => {
        planning.addTasks(tasks);

        if (tasksToRestore)
          tasksToRestore.forEach((task) => task && void createTask(task));
      },
    });

  const handleUpdateTask: FocusSessionPlannerProps["onUpdateTask"] =
    timeTravel.createAction({
      name: "update-task",
      apply: (id, updates) => {
        return updateTask({
          id,
          updates,
        });
      },
      revert: () => {
        // TODO Revert to previous state
        // if (!prevState) return;
        // await createTask(prevState);
        // TODO This should only revert the actual change, not the whole task
        // as some fields might have been chnaged externally
        // taskCollectorFormRef.current?.resetTask(prevState.id, prevState);
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

  // MARK: Session
  const {
    data: createdSession,
    mutateAsync: createSession,
    isPending: isCreatingSession,
  } = api.focusSessions.create.useMutation();

  const { session, setSession } = useActiveFocusSessionStorage();

  // MARK: User Actions

  const handleFinishPlanning = async () => {
    const validSprints = planning.sprints.filter(
      (sprint) => sprint.tasks.length > 0,
    );
    if (validSprints.length === 0) return;
    const { sessionId, sprintIds } = await createSession(validSprints);
    setSession({
      id: sessionId,
      status: "idle",
      currentSprintId: sprintIds[0]!,
    });
  };

  const handleStartSession = () => {
    router.push(`/`);
    planning.reset();
  };

  const [
    isDeleteModalOpen,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);

  const handleReset = () => {
    if (planning.tasks.length) return openDeleteModal();
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
            className={cn(
              "h-full min-h-0 transition-opacity delay-300 duration-500",
              {
                "opacity-0": isLoading,
              },
            )}
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
            projects={projects.data ?? []}
            onCreateProject={(input) => createProject.mutate(input)}
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
            {t("cta.resetSession")}
          </Button>
          <Button
            size="lg"
            radius="md"
            disabled={planning.sprints.every(({ tasks }) => tasks.length === 0)}
            onClick={handleFinishPlanning}
          >
            {t("cta.finishPlanning")}
          </Button>
        </Flex>
      </Main>

      <Modal
        centered
        closeOnEscape={false}
        closeOnClickOutside={false}
        withCloseButton={false}
        radius="md"
        size="xs"
        opened={
          session !== null || isCreatingSession || createdSession !== undefined
        }
        onClose={() => void 0}
      >
        <Button
          fullWidth
          size="lg"
          loading={isCreatingSession}
          component={Link}
          onClick={handleStartSession}
          href={`/focus`}
          target="_blank"
        >
          {t("cta.startSession")}
        </Button>
      </Modal>

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
          {t("ResetModal.message")}
        </Text>
        <Space h="lg" />
        <SimpleGrid cols={2}>
          <Button
            color="red"
            variant="light"
            onClick={() => {
              void Promise.all(
                planning.tasks.map((task) => deleteTask({ id: task.id })),
              );
              handleCleanUp();
            }}
          >
            {t("ResetModal.deleteTasks")}
          </Button>
          <Button onClick={handleCleanUp}>{t("ResetModal.keepTasks")}</Button>
        </SimpleGrid>
      </Modal>
    </>
  );
}
