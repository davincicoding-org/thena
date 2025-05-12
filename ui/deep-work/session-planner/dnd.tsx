import type { SortableData } from "@dnd-kit/sortable";
import type { StackProps } from "@mantine/core";
import type { PropsWithChildren } from "react";
import { useState } from "react";
import {
  closestCorners,
  DndContext,
  DragOverlay,
  PointerSensor,
  useDndContext,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Alert, Stack } from "@mantine/core";

import type { FlatTask, TaskId } from "@/core/task-management";
import type { FocusSessionPlannerProps } from "@/ui/deep-work/session-planner/FocusSessionPlanner";

import { FlatTaskBase } from "./components";

export const TASK_POOL_ID = "$TASK_POOL$";

interface DraggingTaskData extends Partial<SortableData> {
  item: FlatTask;
}

export interface DndWrapperProps
  extends Pick<
    FocusSessionPlannerProps,
    | "onUnassignTasksFromSprint"
    | "onMoveTask"
    | "onAssignTasksToSprint"
    | "onReorderSprintTasks"
  > {
  enabled: boolean;
}

export function DndWrapper({
  children,
  enabled,
  onAssignTasksToSprint,
  onUnassignTasksFromSprint,
  onMoveTask: onMoveTasks,
  onReorderSprintTasks,
}: PropsWithChildren<DndWrapperProps>) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    // useSensor(KeyboardSensor, {
    //   coordinateGetter: sortableKeyboardCoordinates,
    // }),
  );

  const [activeItem, setActiveItem] = useState<FlatTask>();

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={({ active }) => {
        if (!active.data.current) return;
        const { item } = active.data.current as DraggingTaskData;
        setActiveItem(item);
      }}
      onDragOver={(event) => {
        if (!event.active.data.current) return;
        if (!event.over) return;

        const overData = event.over.data.current as SortableData | undefined;

        const targetContainerId =
          overData?.sortable.containerId ?? event.over.id;

        const active = event.active.data.current as DraggingTaskData;

        if (active.sortable?.containerId === targetContainerId) return;

        if (active.sortable) {
          if (targetContainerId === TASK_POOL_ID) {
            onUnassignTasksFromSprint({
              sprintId: active.sortable.containerId.toString(),
              tasks: [active.item.id],
            });
            return;
          }

          onMoveTasks({
            sourceSprint: active.sortable.containerId.toString(),
            targetSprint: targetContainerId.toString(),
            tasks: [active.item.id],
            targetIndex: (event.over.data.current as SortableData | undefined)
              ?.sortable.index,
          });
          return;
        }
        if (targetContainerId !== TASK_POOL_ID) {
          onAssignTasksToSprint({
            sprintId: targetContainerId.toString(),
            tasks: [active.item.id],
          });
        }
      }}
      onDragEnd={(event) => {
        setActiveItem(undefined);
        if (!event.active.data.current) return;
        if (!event.over?.data.current) return;

        const active = event.active.data.current as DraggingTaskData;
        const over = event.over.data.current as DraggingTaskData;

        if (!active.sortable || !over.sortable) return;

        if (active.sortable.containerId !== over.sortable.containerId) return;

        onReorderSprintTasks({
          sprintId: over.sortable.containerId.toString(),
          from: active.sortable.index,
          to: over.sortable.index,
        });
      }}
    >
      <DragOverlay>
        {activeItem && enabled ? (
          <FlatTaskBase
            className="cursor-grabbing!"
            label={activeItem.title}
            group={activeItem.parent?.title}
          />
        ) : null}
      </DragOverlay>
      {children}
    </DndContext>
  );
}

export function SortableTasksContainer({
  id,
  items,
  stackProps,
  children,
  enabled,
  emptyMessage,
  droppableMessage,
}: PropsWithChildren<{
  id: string;
  items: TaskId[];
  enabled?: boolean;
  stackProps?: StackProps;
  emptyMessage: string;
  droppableMessage: string;
}>) {
  const { setNodeRef, over, active } = useDroppable({
    id,
    disabled: !enabled,
  });

  const overContainerId =
    (over?.data.current as undefined | Partial<SortableData>)?.sortable
      ?.containerId ?? over?.id;

  return (
    <SortableContext
      id={id}
      items={items}
      strategy={verticalListSortingStrategy}
    >
      <Stack gap="sm" p="sm" bg="neutral.8" ref={setNodeRef} {...stackProps}>
        {children}

        {!active && items.length === 0 && (
          <Alert
            title={emptyMessage}
            color="gray"
            className="w-xs"
            variant="transparent"
            p="xs"
            opacity={0.3}
            classNames={{
              title: "mx-auto",
            }}
          />
        )}
        {active && overContainerId !== id && (
          <Alert
            title={droppableMessage}
            color="gray"
            p="xs"
            className="w-xs"
            variant="transparent"
            classNames={{
              title: "mx-auto",
            }}
          />
        )}
      </Stack>
    </SortableContext>
  );
}

// MARK: Hooks

export const useSortableTask = (item: FlatTask, dndEnabled: boolean) => {
  const sortable = useSortable({
    id: item.id,
    disabled: !dndEnabled,
    data: { item } satisfies DraggingTaskData,
  });

  const { active } = useDndContext();

  return {
    ...sortable,
    style: {
      transform: CSS.Transform.toString(sortable.transform),
      transition: sortable.transition,
    },
    active,
  };
};

export const useDraggableTask = (item: FlatTask, dndEnabled: boolean) => {
  const draggable = useDraggable({
    id: item.id,
    disabled: !dndEnabled,
    data: { item } satisfies DraggingTaskData,
  });

  const { active } = useDndContext();

  return {
    ...draggable,
    active,
  };
};

export const useDroppableTaskPool = (enabled: boolean) => {
  const draggable = useDroppable({
    id: TASK_POOL_ID,
    disabled: !enabled,
  });
  return {
    ...draggable,
    containerId: TASK_POOL_ID,
  };
};
