/* eslint-disable max-lines */
import type { OS } from "@mantine/hooks";
import type { UseMutateFunction } from "@tanstack/react-query";
import type { Ref } from "react";
import { useMemo, useState } from "react";
import { useDndContext } from "@dnd-kit/core";
import {
  Alert,
  Box,
  Button,
  createPolymorphicComponent,
  Divider,
  Flex,
  FocusTrap,
  Kbd,
  Paper,
  ScrollArea,
  SegmentedControl,
  Stack,
  Tabs,
  Text,
  TextInput,
} from "@mantine/core";
import {
  useDisclosure,
  useHotkeys,
  useOs,
  useToggle,
  useWindowEvent,
} from "@mantine/hooks";
import {
  IconCircleCheckFilled,
  IconDownload,
  IconGripVertical,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";

import type { SprintPlan } from "@/core/deep-work";
import type {
  FlatTask,
  ProjectInput,
  ProjectSelect,
  TaskId,
  TaskInput,
  TaskUpdate,
} from "@/core/task-management";
import type { TaskFormProps } from "@/ui/task-management";
import {
  excludeTasksAndCompact,
  isTaskTree,
  taskInputSchema,
  unflattenTasks,
} from "@/core/task-management";
import { HotKeyHint, useHotKeyHint } from "@/ui/components/HotKeyHint";
import { SidePanel } from "@/ui/components/SidePanel";
import { FlatTaskBase } from "@/ui/deep-work/session-planner/components";
import {
  Backlog,
  TaskForm,
  taskFormOpts,
  useTaskForm,
  useTaskSelection,
  useTasksQueryOptions,
} from "@/ui/task-management";
import { SubtaskForm } from "@/ui/task-management/task-form/SubtaskForm";
import { TaskWrapper } from "@/ui/task-management/task-form/TaskWrapper";
import { cn } from "@/ui/utils";

import { DndWrapper, useDraggableTask, useDroppableTaskPool } from "./dnd";
import { SprintBuilder } from "./SprintBuilder";

export interface FocusSessionPlannerProps {
  tasks: FlatTask[];
  importableTasks: FlatTask[];
  onUpdateTask?: (uid: TaskId, updates: TaskUpdate) => void;
  onRemoveTasks?: (tasks: TaskId[], shouldDelete?: boolean) => void;
  onCreateTask?: (task: TaskInput) => void;
  onAddTasks?: (tasks: TaskId[]) => void;
  onRefineTask?: (task: TaskInput) => void;
  sprints: SprintPlan[];
  onAddSprint: (
    tasks: TaskId[],
    callback?: (sprintId: SprintPlan["id"]) => void,
  ) => void;
  onDropSprint: (sprint: SprintPlan) => void;
  onUpdateSprint: (id: string, updates: Partial<SprintPlan>) => void;
  onReorderSprints: (from: number, to: number) => void;
  onAssignTasksToSprint: (options: {
    sprintId: string;
    tasks: TaskId[];
  }) => void;
  onUnassignTasksFromSprint: (options: {
    sprintId: string;
    tasks: TaskId[];
  }) => void;
  onMoveTask: (options: {
    sourceSprint: string;
    targetSprint: string;
    tasks: TaskId[];
    targetIndex?: number;
  }) => void;
  onReorderSprintTasks: (options: {
    sprintId: SprintPlan["id"];
    from: number;
    to: number;
  }) => void;
  projects: ProjectSelect[];
  onCreateProject: UseMutateFunction<
    ProjectSelect | undefined,
    Error,
    ProjectInput
  >;
  className?: string;
}

export function FocusSessionPlanner({
  tasks,
  importableTasks,
  onAddTasks,
  onCreateTask,
  onUpdateTask,
  onRefineTask,
  onRemoveTasks,
  sprints,
  onAddSprint,
  onDropSprint,
  onUpdateSprint,
  onReorderSprints,
  onAssignTasksToSprint,
  onUnassignTasksFromSprint,
  onMoveTask,
  onReorderSprintTasks,
  projects,
  onCreateProject,
  className,
}: FocusSessionPlannerProps) {
  const [mode, toggleMode] = useToggle<"edit" | "dnd">(["edit", "dnd"]);
  const os = useOs();

  useWindowEvent("keydown", (e) => {
    if (e.key === "Alt") {
      toggleMode();
      modeSwitchTip.markAsExecuted();
    }
  });
  const modeSwitchTip = useHotKeyHint();

  const unassignedTasks = useMemo(() => {
    const assignedTasks = sprints.flatMap((sprint) => sprint.tasks);
    return excludeTasksAndCompact(tasks, assignedTasks);
  }, [tasks, sprints]);

  const taskTrees = unflattenTasks(tasks);

  const [isCreatingTask, setIsCreatingTask] = useState(false);

  useHotkeys([
    [
      "space",
      () => {
        if (mode !== "edit") return;
        setIsCreatingTask(true);
        createTaskTip.markAsExecuted();
      },
    ],
  ]);
  const createTaskTip = useHotKeyHint();

  const taskForm = useTaskForm({
    ...taskFormOpts,
    onSubmit: ({ value }) => {
      onCreateTask?.(value);
      setIsCreatingTask(false);
      taskForm.reset();
    },
  });

  const [isImportingTasks, importPanel] = useDisclosure();
  const importTaskSelection = useTaskSelection();

  const { filterTasks, ...backlogQueryoptions } = useTasksQueryOptions();
  const filteredImportableTasks = filterTasks(importableTasks).sort(
    backlogQueryoptions.sortFn,
  );

  return (
    <>
      <DndWrapper
        enabled={mode === "dnd"}
        onAssignTasksToSprint={onAssignTasksToSprint}
        onUnassignTasksFromSprint={onUnassignTasksFromSprint}
        onMoveTask={onMoveTask}
        onReorderSprintTasks={onReorderSprintTasks}
      >
        <Flex gap="xl" align="start" className={className}>
          <Paper
            withBorder
            display="grid"
            radius="md"
            className={cn("max-h-full shrink-0 grid-rows-1 overflow-clip")}
          >
            <ScrollArea
              scrollbars="y"
              scrollHideDelay={300}
              type="never"
              classNames={{
                scrollbar: cn("pt-14!"),
              }}
            >
              <Box className="sticky top-0 z-10 h-12 bg-black/20 backdrop-blur-xs">
                <Flex
                  justify="space-between"
                  align="center"
                  className="h-full pr-1"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <Text
                      size="lg"
                      px="xs"
                      fw={500}
                      component={motion.p}
                      key={mode}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      {mode === "edit" && "TASKS"}
                      {mode === "dnd" && "UNASSIGNED TASKS"}
                    </Text>
                  </AnimatePresence>

                  {tasks.length > 0 && sprints.length > 0 && (
                    <HotKeyHint
                      opened={modeSwitchTip.opened}
                      onClose={modeSwitchTip.close}
                      message={
                        <>
                          Press{" "}
                          <Kbd className="align-text-bottom">
                            {os === "macos" ? "⌥ option" : "Alt"}
                          </Kbd>{" "}
                          to quickly toggle between editing and assigning tasks
                        </>
                      }
                    >
                      <SegmentedControl
                        bg="transparent"
                        classNames={{
                          root: "rounded-none!",
                        }}
                        data={[
                          { label: "Edit", value: "edit" },
                          {
                            label: "Assign",
                            value: "dnd",
                          },
                        ]}
                        value={mode}
                        onMouseEnter={modeSwitchTip.open}
                        onMouseLeave={modeSwitchTip.close}
                        onFocus={modeSwitchTip.close}
                        onChange={(value) =>
                          toggleMode(value as "edit" | "dnd")
                        }
                      />
                    </HotKeyHint>
                  )}
                </Flex>
                <Divider />
              </Box>
              <Tabs value={mode} p="md">
                <Tabs.Panel value="edit">
                  <Stack>
                    <AnimatePresence>
                      {taskTrees.length === 0 && (
                        <Alert
                          radius="sm"
                          className="w-xs"
                          classNames={{
                            message: cn("text-center text-xl! text-balance"),
                          }}
                          color="gray"
                          variant="transparent"
                          opacity={0.5}
                        >
                          Add all the tasks you want to work on today.
                        </Alert>
                      )}
                      {taskTrees.map((task) => (
                        <TaskWrapper
                          component={motion.div}
                          className="w-xs"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 25 }}
                          layoutId={task.uid.toString()}
                          transition={{ duration: 0.3 }}
                          key={task.uid}
                          task={
                            <EditableTask
                              item={task}
                              onUpdate={(updates) =>
                                onUpdateTask?.(task.uid, updates)
                              }
                              projects={projects}
                              onCreateProject={onCreateProject}
                              TaskActions={({ defaultActions, closeMenu }) => (
                                <>
                                  {onRefineTask && (
                                    <>
                                      <Button
                                        fullWidth
                                        variant="subtle"
                                        color="gray"
                                        justify="flex-start"
                                        onClick={() => onRefineTask(task)}
                                      >
                                        Refine
                                      </Button>
                                      <Divider />
                                    </>
                                  )}
                                  {defaultActions}
                                  <Divider />
                                  <Button
                                    fullWidth
                                    variant="subtle"
                                    radius={0}
                                    color="gray"
                                    justify="flex-start"
                                    onClick={() => {
                                      closeMenu();
                                      onRemoveTasks?.(
                                        [
                                          task.uid,
                                          ...task.subtasks.map((t) => t.uid),
                                        ],
                                        false,
                                      );
                                    }}
                                  >
                                    Postpone for later
                                  </Button>
                                  <Divider />
                                  <Button
                                    fullWidth
                                    color="red"
                                    radius={0}
                                    variant="subtle"
                                    justify="flex-start"
                                    leftSection={<IconTrash size={16} />}
                                    onClick={() => {
                                      closeMenu();
                                      onRemoveTasks?.(
                                        [
                                          task.uid,
                                          ...task.subtasks.map((t) => t.uid),
                                        ],
                                        true,
                                      );
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </>
                              )}
                            />
                          }
                          subtasks={
                            isTaskTree(task)
                              ? task.subtasks.map((subtask) => (
                                  <EditableTask
                                    key={subtask.uid}
                                    item={subtask}
                                    isSubtask
                                    component={motion.div}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    layoutId={subtask.uid.toString()}
                                    onUpdate={(updates) =>
                                      onUpdateTask?.(subtask.uid, updates)
                                    }
                                    projects={projects}
                                    onCreateProject={onCreateProject}
                                    onDelete={() =>
                                      onRemoveTasks?.([subtask.uid], true)
                                    }
                                  />
                                ))
                              : undefined
                          }
                          onAddSubtask={(subtask) =>
                            onCreateTask?.({
                              parentTaskId: task.uid,
                              ...subtask,
                            })
                          }
                        />
                      ))}
                    </AnimatePresence>
                    <AnimatePresence mode="wait">
                      {isCreatingTask ? (
                        <motion.form
                          key="new-task-form"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          onSubmit={(e) => {
                            e.preventDefault();
                            void taskForm.handleSubmit();
                          }}
                        >
                          <taskForm.Field
                            name="title"
                            children={(field) => (
                              <FocusTrap>
                                <TextInput
                                  placeholder="New Task"
                                  value={field.state.value}
                                  onFocus={(e) => {
                                    e.currentTarget.scrollIntoView({
                                      behavior: "smooth",
                                    });
                                  }}
                                  onChange={(e) =>
                                    field.handleChange(e.target.value)
                                  }
                                  onBlur={() => setIsCreatingTask(false)}
                                />
                              </FocusTrap>
                            )}
                          />
                        </motion.form>
                      ) : (
                        <motion.div
                          key="task-adders"
                          className="flex gap-3"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <HotKeyHint
                            opened={createTaskTip.opened}
                            withinPortal={false}
                            onClose={createTaskTip.close}
                            isExecuted={createTaskTip.isExecuted}
                            message={
                              <>
                                Press{" "}
                                <Kbd className="align-text-bottom">space</Kbd>{" "}
                                to create a new task
                              </>
                            }
                          >
                            <Button
                              flex={1}
                              leftSection={<IconPlus size={16} />}
                              onMouseEnter={createTaskTip.open}
                              onMouseLeave={createTaskTip.close}
                              onClick={() => {
                                createTaskTip.close();
                                setIsCreatingTask(true);
                              }}
                            >
                              Create Task
                            </Button>
                          </HotKeyHint>
                          {importableTasks.length > 0 && (
                            <Button
                              flex={1}
                              variant="light"
                              color="gray"
                              leftSection={<IconDownload size={16} />}
                              onClick={importPanel.open}
                            >
                              Import Tasks
                            </Button>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Stack>
                </Tabs.Panel>
                <Tabs.Panel value="dnd">
                  <UnassignedTasksContainer tasks={unassignedTasks} />
                </Tabs.Panel>
              </Tabs>
            </ScrollArea>
          </Paper>

          <AnimatePresence>
            {tasks.length > 0 && sprints.length > 0 && (
              <motion.div
                layout
                className="grid max-h-full min-h-0 grid-rows-1"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3 }}
              >
                <SprintBuilder
                  className="max-h-full min-h-0"
                  dndEnabled={mode === "dnd"}
                  sprints={sprints}
                  taskPool={tasks}
                  onAddSprint={onAddSprint}
                  onUpdateSprint={onUpdateSprint}
                  onDropSprint={onDropSprint}
                  onReorderSprints={onReorderSprints}
                  onAssignTasksToSprint={onAssignTasksToSprint}
                  onUnassignTasksFromSprint={onUnassignTasksFromSprint}
                  onReorderSprintTasks={onReorderSprintTasks}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Flex>
      </DndWrapper>
      <SidePanel
        opened={isImportingTasks}
        onClose={() => {
          importTaskSelection.clearSelection();
          importPanel.close();
        }}
      >
        <Flex className="h-full" direction="column" gap="md">
          <Backlog
            flex={1}
            className="min-h-0"
            mode="select"
            tasks={filteredImportableTasks}
            filters={backlogQueryoptions.filters}
            sort={backlogQueryoptions.sort}
            projects={projects}
            onFiltersUpdate={backlogQueryoptions.updateFilters}
            onSortUpdate={backlogQueryoptions.updateSort}
            selectedTasks={importTaskSelection.selection}
            onToggleTaskSelection={importTaskSelection.toggleTasksSelection}
          />
          <Button
            disabled={importTaskSelection.selection.length === 0}
            fullWidth
            onClick={() => {
              const taskIds = importTaskSelection.selection;

              onAddTasks?.(taskIds);

              importTaskSelection.clearSelection();
              importPanel.close();
            }}
          >
            {importTaskSelection.selection.length === 0
              ? "Select Tasks to Add"
              : "Add Tasks"}
          </Button>
        </Flex>
      </SidePanel>
    </>
  );
}

interface EditableTaskProps extends TaskFormProps {
  item: TaskInput;
  ref?: Ref<HTMLDivElement>;
  isSubtask?: boolean;
  onUpdate: (update: TaskInput) => void;
  onDelete?: () => void;
}

const EditableTask = createPolymorphicComponent<"div", EditableTaskProps>(
  ({ item, isSubtask, onUpdate, onDelete, ...props }: EditableTaskProps) => {
    const form = useTaskForm({
      defaultValues: item,
      validators: {
        onChange: taskInputSchema,
        onMount: taskInputSchema,
      },
      onSubmit: ({ value }) => onUpdate(value),
      listeners: {
        onChange: ({ formApi }) => {
          if (formApi.state.isValid) return;
          onUpdate(formApi.state.values);
        },
      },
    });

    if (isSubtask) {
      return <SubtaskForm form={form} onRemove={onDelete} {...props} />;
    }

    return <TaskForm form={form} {...props} />;
  },
);

function UnassignedTasksContainer({ tasks }: { tasks: FlatTask[] }) {
  const { setNodeRef, containerId } = useDroppableTaskPool(true);
  const { active, over } = useDndContext();

  return (
    <Stack ref={setNodeRef}>
      {!active && tasks.length === 0 && (
        <Alert
          icon={<IconCircleCheckFilled size={24} />}
          radius="sm"
          color="green"
          p="xs"
          className="w-xs"
          title="All tasks are assigned"
        />
      )}
      {tasks.map((task) => (
        <DraggableTask key={task.uid} item={task} />
      ))}
      {active && over?.id !== containerId && (
        <Alert
          radius="sm"
          color="gray"
          p="xs"
          className="sticky bottom-0 w-xs"
          classNames={{
            title: "mx-auto",
          }}
          title="Drop task here to unassign it."
        />
      )}
    </Stack>
  );
}

interface DraggableTaskProps {
  item: FlatTask;
}

function DraggableTask({ item }: DraggableTaskProps) {
  const { attributes, listeners, setNodeRef, isDragging, active } =
    useDraggableTask(item, true);

  return (
    <FlatTaskBase
      group={"parent" in item ? item.parent.title : undefined}
      label={item.title}
      className={cn("min-h-[42px] w-xs transition-opacity *:cursor-grab!", {
        "opacity-30": isDragging,
      })}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      rightSection={active ? null : <IconGripVertical size={12} />}
    />
  );
}
