import type { UseMutateAsyncFunction } from "@tanstack/react-query";
import type { CSSProperties } from "react";
import type { SetRequired } from "type-fest";
import { Fragment, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ActionIcon,
  Alert,
  Box,
  createPolymorphicComponent,
} from "@mantine/core";
import {
  useDebouncedCallback,
  useDisclosure,
  useHotkeys,
} from "@mantine/hooks";
import { IconGripVertical, IconPlus, IconTrash } from "@tabler/icons-react";
import { isEqual, pickBy } from "lodash-es";
import { AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";

import type {
  BulkTasks,
  ProjectInput,
  ProjectSelect,
  TaskFormValues,
  TaskSelect,
  TaskTree,
  TaskUpdate,
} from "@/core/task-management";
import type { TaskFormProps } from "@/ui/task-management";
import { taskFormSchema } from "@/core/task-management";
import { TaskForm, TaskWrapper, useTaskForm } from "@/ui/task-management";
import { cn, useSyncedState } from "@/ui/utils";

import { BulkCreator } from "./BulkCreator";
import { SortableTasksContainer } from "./SortableTasksContainer";
import { TaskAdder } from "./TaskAdder";

export interface TaskListEditorProps {
  tasks: TaskTree[];
  onUpdateTask: (task: SetRequired<TaskUpdate, "id" | "parentId">) => void;
  onDeleteTasks: (tasks: TaskSelect[]) => void;
  onCreateTasks: (tasks: TaskFormValues[]) => void;
  onBulkCreateTasks: UseMutateAsyncFunction<TaskTree[], Error, BulkTasks>;
  onRefineTask?: (task: TaskSelect) => void;
  projects: ProjectSelect[];
  onCreateProject: UseMutateAsyncFunction<
    ProjectSelect | undefined,
    Error,
    ProjectInput
  >;
  className?: string;
}

export function TaskListEditor({
  tasks,
  onCreateTasks,
  onUpdateTask,
  onRefineTask,
  onDeleteTasks,
  onBulkCreateTasks,
  projects,
  onCreateProject,
  className,
}: TaskListEditorProps) {
  const t = useTranslations("SessionPlanner");
  const [reorderedTasks, setReorderedTasks] = useSyncedState(tasks);

  const [
    isBulkCreatorOpen,
    { open: openBulkCreator, close: closeBulkCreator },
  ] = useDisclosure(false);
  useHotkeys([["mod+p", openBulkCreator]]);

  const [isBulkCreating, setIsBulkCreating] = useState(false);
  const handleBulkCreateTasks = async (tasks: BulkTasks) => {
    setIsBulkCreating(true);
    await onBulkCreateTasks(tasks);
    setIsBulkCreating(false);
    closeBulkCreator();
  };

  return (
    <>
      <Box className={cn("mx-auto max-h-full shrink-0 grow-0", className)}>
        <SortableTasksContainer
          tasks={reorderedTasks}
          onReorder={(updatedOrder) => {
            setReorderedTasks(
              updatedOrder.map((task) => tasks.find((t) => t.id === task.id)!),
            );
          }}
          onChangeOrder={(params) =>
            onUpdateTask({ parentId: null, ...params })
          }
        >
          <AnimatePresence>
            {reorderedTasks.length === 0 && (
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
                {t("TaskPool.emptyMessage")}
              </Alert>
            )}

            {reorderedTasks.map((task, index) => (
              <Fragment key={task.id}>
                {index !== 0 && (
                  <TaskAdder
                    order={(tasks[index - 1]!.sortOrder + task.sortOrder) / 2}
                    onCreateTasks={onCreateTasks}
                  />
                )}
                <TaskTreeItem
                  key={task.id}
                  task={task}
                  onCreateTasks={onCreateTasks}
                  onUpdateTask={onUpdateTask}
                  onRefineTask={onRefineTask}
                  onDeleteTasks={onDeleteTasks}
                  projects={projects}
                  onCreateProject={onCreateProject}
                />
              </Fragment>
            ))}
          </AnimatePresence>
        </SortableTasksContainer>
        <div className="h-[22px]" />
        <TaskAdder hotkey="space" onCreateTasks={onCreateTasks} />
      </Box>
      <BulkCreator
        opened={isBulkCreatorOpen}
        submitting={isBulkCreating}
        onClose={closeBulkCreator}
        onSubmit={handleBulkCreateTasks}
      />
    </>
  );
}

interface TaskItemProps
  extends Pick<
    TaskListEditorProps,
    | "onCreateTasks"
    | "onUpdateTask"
    | "onRefineTask"
    | "onDeleteTasks"
    | "projects"
    | "onCreateProject"
  > {
  task: TaskTree;
}

function TaskTreeItem({
  task,
  onCreateTasks,
  onUpdateTask,
  onRefineTask,
  onDeleteTasks,
  projects,
  onCreateProject,
}: TaskItemProps) {
  const [isAddingSubtask, subtaskAdder] = useDisclosure();

  const [reorderedSubtasks, setReorderedSubtasks] = useSyncedState(
    task.subtasks,
  );

  const t = useTranslations("SessionPlanner");
  const { attributes, listeners, setNodeRef, active, transform, transition } =
    useSortable({
      id: task.id,
      data: { item: task },
    });

  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <TaskWrapper
      className={cn("w-xs", {
        "cursor-grabbing *:pointer-events-none": active,
      })}
      style={style}
      ref={setNodeRef}
      task={
        <TaskEditor
          bg="dark.6"
          item={{ parentId: null, ...task }}
          onUpdate={(updates) =>
            onUpdateTask?.({ id: task.id, parentId: null, ...updates })
          }
          projects={projects}
          disableRightSection={!!active}
          onCreateProject={onCreateProject}
          actions={[
            onRefineTask
              ? {
                  name: "refine",
                  label: t("TaskPool.TaskActions.refine"),
                  onClick: () => onRefineTask({ parentId: null, ...task }),
                }
              : null,
            {
              name: "add-subtasks",
              label: "Add Subtasks",
              icon: <IconPlus size={16} />,
              onClick: () => subtaskAdder.open(),
            },
            "-",
            "assign-project",
            "edit-priority",
            "-",
            {
              name: "delete",
              label: t("TaskPool.TaskActions.delete"),
              color: "red",
              icon: <IconTrash size={16} />,
              onClick: () =>
                onDeleteTasks?.([
                  {
                    ...task,
                    parentId: null,
                  },
                  ...task.subtasks.map((subtask) => ({
                    ...subtask,
                    parentId: task.id,
                  })),
                ]),
            },
          ]}
          rightSection={
            <ActionIcon
              {...attributes}
              {...listeners}
              color="gray"
              variant="transparent"
              className={cn(
                "mr-1 flex !h-8 !w-auto !min-w-0 !cursor-grab px-1 !outline-offset-0",
              )}
            >
              <IconGripVertical size={16} />
            </ActionIcon>
          }
        />
      }
      subtasks={
        reorderedSubtasks.length > 0 ? (
          <SortableTasksContainer
            tasks={task.subtasks}
            onReorder={(updatedOrder) => {
              setReorderedSubtasks(
                updatedOrder.map(
                  (subtask) => task.subtasks.find((t) => t.id === subtask.id)!,
                ),
              );
            }}
            onChangeOrder={(params) =>
              onUpdateTask({ parentId: task.id, ...params })
            }
          >
            {reorderedSubtasks.map((subtask) => (
              <SubtaskItem
                key={subtask.id}
                task={{
                  ...subtask,
                  parentId: task.id,
                }}
                onUpdateTask={onUpdateTask}
                onDeleteTasks={onDeleteTasks}
                projects={projects}
                onCreateProject={onCreateProject}
              />
            ))}
          </SortableTasksContainer>
        ) : undefined
      }
      isAddingSubtask={isAddingSubtask}
      onCloseSubtaskAdder={subtaskAdder.close}
      onAddSubtasks={(titles) =>
        onCreateTasks(
          titles.map((title) => ({
            title,
            customSortOrder: null,
            parentId: task.id,
            projectId: null,
            priority: null,
            complexity: null,
          })),
        )
      }
    />
  );
}

interface SubtaskItemProps
  extends Pick<
    TaskListEditorProps,
    | "onUpdateTask"
    | "onRefineTask"
    | "onDeleteTasks"
    | "projects"
    | "onCreateProject"
  > {
  task: TaskSelect;
}

function SubtaskItem({
  task,
  onUpdateTask,
  onDeleteTasks,
  projects,
  onCreateProject,
}: SubtaskItemProps) {
  const t = useTranslations("SessionPlanner");
  const { attributes, listeners, setNodeRef, active, transform, transition } =
    useSortable({
      id: task.id,
      data: { item: task },
    });

  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <TaskEditor
      key={task.id}
      style={style}
      ref={setNodeRef}
      item={task}
      className={cn({
        "cursor-grabbing *:pointer-events-none": active,
      })}
      disableHover={!!active}
      disableRightSection={!!active}
      rightSection={
        <ActionIcon
          {...attributes}
          {...listeners}
          color="gray"
          variant="transparent"
          className={cn(
            "mr-1 flex !h-8 !w-auto !min-w-0 !cursor-grab px-1 !outline-offset-0",
          )}
        >
          <IconGripVertical size={16} />
        </ActionIcon>
      }
      actions={[
        "edit-priority",
        "-",
        {
          name: "delete",
          label: t("TaskPool.TaskActions.delete"),
          color: "red",
          icon: <IconTrash size={16} />,
          onClick: () => onDeleteTasks?.([task]),
        },
      ]}
      onUpdate={(updates) =>
        onUpdateTask?.({ id: task.id, parentId: task.parentId, ...updates })
      }
      projects={projects}
      onCreateProject={onCreateProject}
    />
  );
}

interface TaskEditorProps extends TaskFormProps {
  item: TaskSelect;
  onUpdate: (update: Partial<TaskFormValues>) => void;
}

const TaskEditor = createPolymorphicComponent<"div", TaskEditorProps>(
  ({ item, onUpdate, ...props }: TaskEditorProps) => {
    const debouncedUpdate = useDebouncedCallback(onUpdate, {
      delay: 1_000,
    });
    const form = useTaskForm({
      defaultValues: taskFormSchema.strip().parse(item),
      validators: {
        onChange: taskFormSchema,
        onMount: taskFormSchema,
      },
      listeners: {
        onChange: ({ formApi }) => {
          if (!formApi.state.isValid) return;

          const changes = pickBy(
            formApi.state.values,
            (value, key) => !isEqual(value, item[key as keyof TaskFormValues]),
          ) as Partial<TaskFormValues>;
          const { title, ...rest } = changes;
          if (title) {
            debouncedUpdate({ title });
          }
          if (Object.keys(rest).length > 0) {
            onUpdate(rest);
          }
        },
      },
    });

    return <TaskForm form={form} {...props} />;
  },
);
