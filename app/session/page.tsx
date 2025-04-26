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
  useLocalStorage,
} from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconChevronRight } from "@tabler/icons-react";

import { sprintPlanSchema } from "@/core/deep-work";
import { BacklogTask, taskSchema } from "@/core/task-management";
import { SidePanel } from "@/ui/components/SidePanel";
import { SessionPlanner, useSessionPlanner } from "@/ui/deep-work";
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

type Stage = "task-collector" | "session-planner" | "session-runner";

export default function SessionPage() {
  const router = useRouter();

  const [localState, setLocalState, removeLocalState] = useLocalStorage<{
    stage: Stage;
  }>({
    key: "session-planner",
    defaultValue: {
      stage: "task-collector",
    },
  });

  // ------- Task List -------

  const taskList = useTaskList({});
  const taskListSync = useLocalStorageSync({
    key: "session-task-list",
    state: taskList.tasks,
    schema: taskSchema.array(),
    read: (tasks) => tasks && taskList.setTasks(tasks),
  });

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

  // ------- Sprints -------

  const sessionPlanner = useSessionPlanner(taskList.tasks, {
    initialSprints: 3,
  });
  const sessionPlannerSync = useLocalStorageSync({
    key: "session-sprint-plans",
    state: sessionPlanner.sprints,
    schema: sprintPlanSchema.array(),
    read: (sprints) => sprints && sessionPlanner.setSprints(sprints),
  });

  // ------- User Actions -------

  useHotkeys([
    ["mod+z", taskList.history.undo],
    ["mod+shift+z", taskList.history.redo],
  ]);

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
      <AppShell.Main display="flex" className="h-full flex-col">
        <Tabs value={localState.stage} m="auto" className="w-full min-w-0">
          <Tabs.Panel value="task-collector">
            <LoadingOverlay
              loaderProps={{ type: "dots" }}
              visible={!taskListSync.initialized}
            />
            <TaskCollector
              className="mx-auto w-sm"
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
          </Tabs.Panel>
          <Tabs.Panel value="session-planner" px="lg">
            <LoadingOverlay
              loaderProps={{ type: "dots" }}
              visible={!sessionPlannerSync.initialized}
            />

            <SessionPlanner
              className="mx-auto max-h-[70dvh] min-h-[400px] w-fit"
              sprints={sessionPlanner.sprints}
              unassignedTasks={sessionPlanner.unassignedTasks}
              onAddSprint={() => sessionPlanner.addSprint({})}
              onDropSprint={sessionPlanner.dropSprint}
              onSprintChange={sessionPlanner.updateSprint}
              onAssignTasksToSprint={sessionPlanner.assignTasks}
              onUnassignTasksFromSprint={sessionPlanner.unassignTasks}
              onMoveTasks={sessionPlanner.moveTasks}
            />
          </Tabs.Panel>
          <Tabs.Panel value="session-runner">COMING SOON</Tabs.Panel>
        </Tabs>

        <Flex p="lg">
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
          {localState.stage === "task-collector" && (
            <Button
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
          )}
          {localState.stage === "session-planner" && (
            <HoverCard
              disabled={sessionPlanner.unassignedTasks.length === 0}
              position="top-end"
            >
              <HoverCard.Target>
                <Box pos="absolute" right={24} bottom={24}>
                  <Button
                    rightSection={<IconChevronRight />}
                    disabled={sessionPlanner.unassignedTasks.length > 0}
                    onClick={() =>
                      setLocalState((prev) => ({
                        ...prev,
                        stage: "session-runner",
                      }))
                    }
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
                  backlog.deleteTasks(tasksToPullFromBacklog);
                },
                revert: () => {
                  notifications.show({
                    message: "Moved Tasks Back to Backlog",
                    color: "green",
                    autoClose: 5000,
                    position: "bottom-center",
                  });
                  backlog.addTasks(tasks);
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
