"use client";

import type { PaperProps } from "@mantine/core";
import type { UseMutateFunction } from "@tanstack/react-query";
import {
  Button,
  Center,
  Divider,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";

import type {
  FlatTask,
  ProjectInput,
  ProjectSelect,
  TaskFilters,
  TaskId,
  TaskInput,
  TaskSelect,
  TasksSortOptions,
  TaskUpdate,
} from "@/core/task-management";
import type { TaskFormProps } from "@/ui/task-management";
import {
  hasFiltersApplied,
  isTaskTree,
  unflattenTasks,
} from "@/core/task-management";
import { Panel } from "@/ui/components/Panel";
import { TaskForm, taskFormOpts, useTaskForm } from "@/ui/task-management";
import { TasksQueryPanel } from "@/ui/task-management/tasks/TasksQueryPanel";
import { cn } from "@/ui/utils";

import type { TasksQueryOptionsHookReturn } from "../tasks/useTasksQueryOptions";
import { SubtaskForm } from "../task-form/SubtaskForm";
import { TaskWrapper } from "../task-form/TaskWrapper";

// MARK: Component

export interface BacklogProps {
  mode: "select" | "edit";
  tasks: FlatTask[];
  filters: TaskFilters;
  sort: TasksSortOptions;
  onFiltersUpdate: TasksQueryOptionsHookReturn["updateFilters"];
  onSortUpdate: TasksQueryOptionsHookReturn["updateSort"];
  projects: ProjectSelect[];
  onAddTask?: (task: TaskInput) => void;
  onUpdateTask?: (task: TaskUpdate & Pick<TaskSelect, "id">) => void;
  onDeleteTask?: (taskId: TaskId) => void;
  onCreateProject?: UseMutateFunction<
    ProjectSelect | undefined,
    Error,
    ProjectInput
  >;
  selectedTasks?: TaskId[];
  onToggleTaskSelection?: (tasks: TaskId[]) => void;
}

// TODO turn content into a task list and reuse it in taskcolelctor
export function Backlog({
  mode,
  filters,
  sort,
  tasks,
  onFiltersUpdate,
  onSortUpdate,
  projects,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onCreateProject,
  selectedTasks,
  onToggleTaskSelection,
  ...paperProps
}: BacklogProps & PaperProps) {
  tasks = unflattenTasks(tasks);
  return (
    <Panel
      header={
        <TasksQueryPanel
          filters={filters}
          onFiltersUpdate={onFiltersUpdate}
          projects={projects}
          sort={sort}
          onSortUpdate={onSortUpdate}
        />
      }
      {...paperProps}
    >
      {tasks.length > 0 ? (
        <ScrollArea bg="neutral.8">
          <Stack px="md" py="lg">
            {tasks.map((task) => (
              <TaskWrapper
                key={task.id}
                className={
                  mode === "select"
                    ? cn(
                        "cursor-pointer outline! transition-all [&_*]:cursor-pointer!",
                        (() => {
                          if (!selectedTasks?.length) return false;
                          if (!isTaskTree(task))
                            return selectedTasks.includes(task.id);
                          return task.subtasks.every((subtask) =>
                            selectedTasks.includes(subtask.id),
                          );
                        })()
                          ? "outline-[var(--mantine-primary-color-filled)]!"
                          : "outline-transparent! hover:outline! hover:outline-current!",
                      )
                    : undefined
                }
                onClick={
                  mode === "select"
                    ? () =>
                        onToggleTaskSelection?.(
                          isTaskTree(task)
                            ? [...task.subtasks.map((subtask) => subtask.id)]
                            : [task.id],
                        )
                    : undefined
                }
                task={
                  <TaskItem
                    mode={mode}
                    task={task}
                    onUpdate={(updates) =>
                      onUpdateTask?.({ id: task.id, ...updates })
                    }
                    projects={projects}
                    onCreateProject={onCreateProject}
                    TaskActions={({ defaultActions }) => (
                      <>
                        {/* {onRefineTask && (
                          <>
                            <Button
                              fullWidth
                              variant="subtle"
                              color="gray"
                              justify="flex-start"
                              onClick={() => onRefineTask(mainTask)}
                            >
                              Refine
                            </Button>
                            <Divider />
                          </>
                        )} */}
                        {defaultActions}
                        <Divider />
                        <Button
                          fullWidth
                          color="red"
                          radius={0}
                          variant="subtle"
                          justify="flex-start"
                          leftSection={<IconTrash size={16} />}
                          onClick={() => onDeleteTask?.(task.id)}
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
                        <TaskItem
                          key={subtask.id}
                          task={subtask}
                          mode={mode}
                          isSubtask
                          onUpdate={(updates) =>
                            onUpdateTask?.({ id: subtask.id, ...updates })
                          }
                          onDelete={() => onDeleteTask?.(subtask.id)}
                          projects={projects}
                          onCreateProject={onCreateProject}
                        />
                      ))
                    : undefined
                }
                onAddSubtask={(subtask) =>
                  onAddTask?.({
                    parentId: task.id,
                    ...subtask,
                  })
                }
              />
            ))}
            <Text className="not-first:hidden" my="auto">
              Your Backlog is empty
            </Text>
          </Stack>
        </ScrollArea>
      ) : (
        <Center>
          <Text opacity={0.5} size="xl">
            {hasFiltersApplied(filters)
              ? "No tasks match your filters"
              : "Your Backlog is empty"}
          </Text>
        </Center>
      )}
    </Panel>
  );
}

// MARK: Task Item

interface TaskItemProps
  extends Pick<TaskFormProps, "TaskActions" | "projects" | "onCreateProject"> {
  mode: "select" | "edit";
  task: TaskInput;
  isSubtask?: boolean;
  onUpdate: (update: TaskInput) => void;
  onDelete?: () => void;
}

function TaskItem({
  mode,
  task,
  isSubtask,
  onUpdate,
  onDelete,
  projects,
  TaskActions,
  onCreateProject,
}: TaskItemProps) {
  const form = useTaskForm({
    ...taskFormOpts,
    defaultValues: task,
    onSubmit: ({ value }) => onUpdate(value),
    listeners: {
      onChange: ({ formApi }) => {
        if (formApi.state.isValid) return;
        onUpdate(formApi.state.values);
      },
    },
  });

  if (isSubtask) return <SubtaskForm form={form} onRemove={onDelete} />;

  return (
    <TaskForm
      form={form}
      readOnly={mode !== "edit"}
      projects={projects}
      TaskActions={TaskActions}
      onCreateProject={onCreateProject}
    />
  );

  {
    /* <form.Subscribe
        selector={(state) => !isEqual(state.values, task) && state.isValid}
        children={(hasChanged) => (
          <Collapse in={hasChanged} mt={4}>
            <Button
              ml="auto"
              size="xs"
              fullWidth
              onClick={(e) => {
                void form.handleSubmit();
                e.currentTarget.blur();
              }}
            >
              Save Changes
            </Button>
          </Collapse>
        )}
      /> */
  }
}
