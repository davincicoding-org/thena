"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AppShell,
  Box,
  Button,
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
} from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconChevronRight, IconTransfer } from "@tabler/icons-react";
import { z } from "zod";

import { sprintPlanSchema } from "@/core/deep-work";
import { BacklogTask, taskSchema } from "@/core/task-management";
import { SidePanel } from "@/ui/components/SidePanel";
import {
  FocusSession,
  SessionPlanner,
  useSessionPlanner,
} from "@/ui/deep-work";
import { useFocusSession } from "@/ui/deep-work/execution/useFocusSession";
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

  const [stage, setStage] = useState<"task-collector" | "session-planner">();

  const taskList = useTaskList();

  const sessionPlanner = useSessionPlanner(taskList.tasks);

  const localStorageSync = useLocalStorageSync({
    key: "session-page",
    state: {
      tasks: taskList.tasks,
      sprints: sessionPlanner.sprints,
    },
    schema: z.object({
      tasks: taskSchema.array(),
      sprints: sprintPlanSchema.array(),
    }),
    read: (storedState) => {
      if (storedState === null) return setStage("task-collector");
      taskList.setTasks(storedState.tasks);
      sessionPlanner.setSprints(storedState.sprints);
      if (storedState.sprints.length > 0) return setStage("session-planner");

      return setStage("task-collector");
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
    breakDuration: { minutes: 1 },
  });

  // MARK: User Actions

  const handleCompleteTaskCollection = () => {
    if (sessionPlanner.sprints.length === 0)
      sessionPlanner.addSprints([{}, {}]);
    setStage("session-planner");
    taskList.history.reset();
  };

  const handleStartSession = () => {
    focusSession.initialize({ sprints: sessionPlanner.sprints });
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
    localStorageSync.clear();
    taskList.history.reset();
  };

  const handleDelete = () => {
    if (taskList.tasks.length > 0) return openDeleteModal();
    handleReset();
    router.push("/");
  };

  return (
    <>
      <LoadingOverlay
        loaderProps={{ type: "dots" }}
        visible={!localStorageSync.initialized}
      />
      <AppShell.Main display="flex" className="h-dvh flex-col">
        <Tabs value={stage} m="auto" className="min-h-0 w-full grow-0" px="lg">
          <Tabs.Panel value="task-collector" className="h-full" py="xl">
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
          <Tabs.Panel value="session-planner" px="lg">
            <SessionPlanner
              className="mx-auto max-h-[70dvh] min-h-[400px] w-fit"
              sprints={sessionPlanner.sprints}
              unassignedTasks={sessionPlanner.unassignedTasks}
              onAddSprint={(callback) => sessionPlanner.addSprint({}, callback)}
              onDropSprint={sessionPlanner.dropSprint}
              onSprintChange={sessionPlanner.updateSprint}
              onAssignTasksToSprint={sessionPlanner.assignTasks}
              onUnassignTasksFromSprint={sessionPlanner.unassignTasks}
              onMoveTasks={sessionPlanner.moveTasks}
            />
          </Tabs.Panel>
        </Tabs>

        <Flex
          p="lg"
          justify="space-between"
          align="end"
          className={cn("transition-transform duration-500", {
            "translate-y-full": stage === undefined,
          })}
        >
          <Menu position="top-start">
            <Menu.Target>
              <Button variant="outline" color="gray">
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

          {stage === "task-collector" && (
            <Button
              size="md"
              disabled={taskList.tasks.length === 0}
              rightSection={<IconChevronRight />}
              onClick={handleCompleteTaskCollection}
            >
              Plan Session
            </Button>
          )}
          {stage === "session-planner" && (
            <HoverCard
              disabled={sessionPlanner.unassignedTasks.length === 0}
              position="top-end"
            >
              <HoverCard.Target>
                <Box pos="absolute" right={24} bottom={24}>
                  <Button
                    size="md"
                    rightSection={<IconChevronRight />}
                    disabled={sessionPlanner.unassignedTasks.length > 0}
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
          )}
        </Flex>
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
