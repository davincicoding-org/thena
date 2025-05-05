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
import { Stack, Text } from "@mantine/core";

import type { FlatTask, TaskId } from "@/core/task-management";
import { cn } from "@/ui/utils";

import type { SprintBuilderProps } from "./SprintBuilder";
import { FlatTaskBase } from "./components";

export const TASK_POOL_ID = "$TASK_POOL$";

interface DraggingTaskData extends Partial<SortableData> {
  item: FlatTask;
}

export interface DndWrapperProps
  extends Pick<
    SprintBuilderProps,
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
              tasks: [active.item.uid],
            });
            return;
          }

          onMoveTasks({
            sourceSprint: active.sortable.containerId.toString(),
            targetSprint: targetContainerId.toString(),
            tasks: [active.item.uid],
            targetIndex: (event.over.data.current as SortableData | undefined)
              ?.sortable.index,
          });
          return;
        }
        if (targetContainerId !== TASK_POOL_ID) {
          onAssignTasksToSprint({
            sprintId: targetContainerId.toString(),
            tasks: [active.item.uid],
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
            group={"parent" in activeItem ? activeItem.parent.title : undefined}
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
}: PropsWithChildren<{
  id: string;
  items: TaskId[];
  enabled?: boolean;
  stackProps?: StackProps;
}>) {
  const { setNodeRef } = useDroppable({
    id,
    disabled: !enabled,
  });

  return (
    <SortableContext
      id={id}
      items={items}
      strategy={verticalListSortingStrategy}
    >
      <Stack gap="sm" p="sm" bg="neutral.8" ref={setNodeRef} {...stackProps}>
        {children}

        {enabled && items.length === 0 && (
          <Text
            opacity={0.3}
            className={cn("flex items-center justify-center")}
            h={30}
          >
            Drag tasks here
          </Text>
        )}
      </Stack>
    </SortableContext>
  );
}

// MARK: Hooks

export const useSortableTask = (item: FlatTask, dndEnabled: boolean) => {
  const sortable = useSortable({
    id: item.uid,
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
    id: item.uid,
    disabled: !dndEnabled,
    data: { item } satisfies DraggingTaskData,
  });

  const { active } = useDndContext();

  return {
    ...draggable,
    active,
  };
};

export const useDroppableTaskPool = (enabled: boolean) =>
  useDroppable({
    id: TASK_POOL_ID,
    disabled: !enabled,
  });
