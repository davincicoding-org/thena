/* eslint-disable max-lines */
// TODO move some components to their own files

import type { UseMutateFunction } from "@tanstack/react-query";
import type { CSSProperties, PropsWithChildren } from "react";
import type { SetRequired } from "type-fest";
import { Fragment, useState } from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ActionIcon,
  Alert,
  Box,
  Button,
  createPolymorphicComponent,
  Divider,
  FocusTrap,
  Kbd,
  TextInput,
} from "@mantine/core";
import { useDebouncedCallback, useHotkeys } from "@mantine/hooks";
import { IconGripVertical, IconPlus, IconTrash } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import { isEqual, pickBy } from "lodash-es";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import z from "zod";

import type {
  ProjectInput,
  ProjectSelect,
  TaskFormValues,
  TaskSelect,
  TaskTree,
  TaskUpdate,
} from "@/core/task-management";
import type { TaskFormProps } from "@/ui/task-management";
import { isTaskTree, taskFormSchema } from "@/core/task-management";
import { HotKeyHint, useHotKeyHint } from "@/ui/components/HotKeyHint";
import {
  SubtaskForm,
  TaskForm,
  TaskWrapper,
  useTaskForm,
} from "@/ui/task-management";
import { cn } from "@/ui/utils";

export interface TaskListEditorProps {
  tasks: TaskTree[];
  onUpdateTask: (task: SetRequired<TaskUpdate, "id" | "parentId">) => void;
  onDeleteTasks: (tasks: TaskSelect[]) => void;
  onCreateTasks: (tasks: TaskFormValues[]) => void;
  onRefineTask?: (task: TaskSelect) => void;
  projects: ProjectSelect[];
  onCreateProject: UseMutateFunction<
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
  projects,
  onCreateProject,
  className,
}: TaskListEditorProps) {
  const t = useTranslations("SessionPlanner");

  return (
    <Box className={cn("mx-auto max-h-full shrink-0 grow-0", className)}>
      <SortableTasksContainer
        tasks={tasks}
        onChangeOrder={(params) => onUpdateTask({ parentId: null, ...params })}
      >
        <AnimatePresence>
          {tasks.length === 0 && (
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

          {tasks.map((task, index) => (
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
  );
}

interface TaskAdderProps {
  hotkey?: string;
  order?: number;
  onCreateTasks: TaskListEditorProps["onCreateTasks"];
}

function TaskAdder({ hotkey = "", onCreateTasks, order }: TaskAdderProps) {
  useHotkeys([
    [
      hotkey,
      () => {
        setOpened(true);
        createTaskTip.markAsExecuted();
      },
    ],
  ]);
  const t = useTranslations("SessionPlanner");
  const createTaskTip = useHotKeyHint();

  const [opened, setOpened] = useState(false);

  const taskForm = useForm({
    defaultValues: {
      title: "",
    },
    validators: {
      onChange: z.object({
        title: z.string().min(3),
      }),
    },
    onSubmit: ({ value }) => {
      onCreateTasks([
        {
          ...value,
          customSortOrder: order ?? null,
          parentId: null,
          projectId: null,
          priority: null,
          complexity: null,
        },
      ]);
      setOpened(false);
      taskForm.reset();
    },
  });

  return (
    <AnimatePresence mode="wait">
      {opened ? (
        <motion.form
          key="new-task-form"
          className={cn({ "py-5": order !== undefined })}
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
                  placeholder={t("TaskPool.TaskCreator.placeholder")}
                  value={field.state.value}
                  onFocus={(e) => {
                    e.currentTarget.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={() => setOpened(false)}
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
          {order === undefined ? (
            <HotKeyHint
              opened={createTaskTip.opened}
              disabled={!hotkey}
              withinPortal={false}
              onClose={createTaskTip.close}
              isExecuted={createTaskTip.isExecuted}
              message={t.rich("TaskPool.TaskCreator.hotKeyHint", {
                kbd: () => <Kbd>{hotkey}</Kbd>,
              })}
            >
              <Button
                flex={1}
                leftSection={<IconPlus size={16} />}
                onMouseEnter={createTaskTip.open}
                onMouseLeave={createTaskTip.close}
                onClick={() => {
                  createTaskTip.close();
                  setOpened(true);
                }}
              >
                {t("TaskPool.TaskCreator.cta")}
              </Button>
            </HotKeyHint>
          ) : (
            <ActionIcon
              flex={1}
              size="xs"
              variant="light"
              className="my-0.5 opacity-0 transition-opacity hover:opacity-100"
              onClick={() => {
                createTaskTip.close();
                setOpened(true);
              }}
            >
              <IconPlus size={12} />
            </ActionIcon>
          )}
        </motion.div>
      )}
    </AnimatePresence>
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
  const t = useTranslations("SessionPlanner");
  const { attributes, listeners, setNodeRef, active, transform, transition } =
    useSortable({
      id: task.id,
      data: { item: task },
    });

  const style: CSSProperties = {
    // opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <TaskWrapper
      // component={motion.div}
      className="w-xs"
      // initial={{ opacity: 0 }}
      // animate={{ opacity: 1, x: 0 }}
      // exit={{ opacity: 0, x: 25 }}
      // layoutId={task.id.toString()}
      // transition={{ duration: 0.3 }}
      style={style}
      ref={setNodeRef}
      task={
        <EditableTask
          item={{ parentId: null, ...task }}
          onUpdate={(updates) =>
            onUpdateTask?.({ id: task.id, parentId: null, ...updates })
          }
          projects={projects}
          onCreateProject={onCreateProject}
          rightSection={
            <div
              {...attributes}
              {...listeners}
              className={cn(
                "flex items-center self-stretch px-1 focus:text-[var(--mantine-color-primary-filled)] focus:outline-none",
                active ? "cursor-grabbing" : "cursor-grab",
              )}
            >
              <IconGripVertical size={16} />
            </div>
          }
          TaskActions={({ defaultActions, closeMenu }) => (
            <>
              {onRefineTask && (
                <>
                  <Button
                    fullWidth
                    variant="subtle"
                    color="gray"
                    justify="flex-start"
                    onClick={() => onRefineTask({ parentId: null, ...task })}
                  >
                    {t("TaskPool.TaskActions.refine")}
                  </Button>
                  <Divider />
                </>
              )}
              {defaultActions}
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
                  onDeleteTasks?.([
                    {
                      ...task,
                      parentId: null,
                    },
                    ...task.subtasks.map((subtask) => ({
                      ...subtask,
                      parentId: task.id,
                    })),
                  ]);
                }}
              >
                {t("TaskPool.TaskActions.delete")}
              </Button>
            </>
          )}
        />
      }
      subtasks={
        isTaskTree(task) ? (
          <SortableTasksContainer
            tasks={task.subtasks}
            onChangeOrder={(params) =>
              onUpdateTask({ parentId: task.id, ...params })
            }
          >
            {task.subtasks.map((subtask) => (
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
      onAddSubtasks={(titles) =>
        onCreateTasks(
          titles.map((title, index) => ({
            title,
            customSortOrder: task.subtasks.length + index,
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

function SortableTasksContainer({
  tasks,
  children,
  onChangeOrder,
}: PropsWithChildren<{
  tasks: Pick<TaskSelect, "id" | "sortOrder">[];
  onChangeOrder: (params: Pick<TaskSelect, "id" | "customSortOrder">) => void;
}>) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={(event) => {
        const { active, over } = event;
        if (over === null) return;
        if (active.id === over.id) return;

        const activeIndex = tasks.findIndex(({ id }) => id === active.id);
        const activeItemId = Number(active.id);
        const overIndex = tasks.findIndex(({ id }) => id === over.id);

        const reorderedItems = arrayMove(tasks, activeIndex, overIndex);

        const prevItem = reorderedItems[overIndex - 1];
        const nextItem = reorderedItems[overIndex + 1];

        const order = (() => {
          if (prevItem && nextItem) {
            const average = (prevItem.sortOrder + nextItem.sortOrder) / 2;
            if (average === activeItemId) return null;
            return average;
          }

          // Is moved to start of list
          if (nextItem) {
            if (activeItemId < nextItem.id) return null;
            return nextItem.sortOrder - 1;
          }

          // Is moved to end of list
          if (prevItem) {
            if (activeItemId > prevItem.id) return null;
            return prevItem.sortOrder + 0.5;
          }

          return;
        })();

        if (order === undefined) return;

        onChangeOrder({ id: activeItemId, customSortOrder: order });
      }}
    >
      <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
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
  const { attributes, listeners, setNodeRef, active, transform, transition } =
    useSortable({
      id: task.id,
      data: { item: task },
    });

  const style: CSSProperties = {
    // opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <EditableTask
      key={task.id}
      style={style}
      ref={setNodeRef}
      item={task}
      isSubtask
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      rightSection={
        <div
          {...attributes}
          {...listeners}
          className={cn(
            "flex items-center self-stretch px-1 focus:text-[var(--mantine-color-primary-filled)] focus:outline-none",
            active ? "cursor-grabbing" : "cursor-grab",
          )}
        >
          <IconGripVertical size={16} />
        </div>
      }
      layoutId={task.id.toString()}
      onUpdate={(updates) =>
        onUpdateTask?.({ id: task.id, parentId: task.parentId, ...updates })
      }
      projects={projects}
      onCreateProject={onCreateProject}
      onDelete={() => {
        onDeleteTasks?.([task]);
      }}
    />
  );
}

interface EditableTaskProps extends TaskFormProps {
  item: TaskSelect;
  isSubtask?: boolean;
  onUpdate: (update: Partial<TaskFormValues>) => void;
  onDelete?: () => void;
}

const EditableTask = createPolymorphicComponent<"div", EditableTaskProps>(
  ({ item, isSubtask, onUpdate, onDelete, ...props }: EditableTaskProps) => {
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

    if (isSubtask) {
      return <SubtaskForm form={form} onRemove={onDelete} {...props} />;
    }

    return <TaskForm form={form} {...props} />;
  },
);
