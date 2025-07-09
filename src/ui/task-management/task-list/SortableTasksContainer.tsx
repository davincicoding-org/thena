import type { PropsWithChildren } from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import type { TaskSelect } from "@/core/task-management";

import { reorderTasks } from "./reorderTasks";

export interface SortableTasksContainerProps {
  tasks: Pick<TaskSelect, "id" | "customSortOrder">[];
  disabled?: boolean;
  onReorder: (tasks: Pick<TaskSelect, "id">[]) => void;
  onChangeOrder: (params: Pick<TaskSelect, "id" | "customSortOrder">) => void;
}

export function SortableTasksContainer({
  tasks,
  children,
  disabled,
  onReorder,
  onChangeOrder,
}: PropsWithChildren<SortableTasksContainerProps>) {
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
        const overIndex = tasks.findIndex(({ id }) => id === over.id);

        const { reorderedItems, updates } = reorderTasks(
          tasks,
          activeIndex,
          overIndex,
        );

        onReorder(reorderedItems);

        // Apply all updates
        updates.forEach((update) => {
          onChangeOrder(update);
        });
      }}
    >
      <SortableContext
        disabled={disabled}
        items={tasks}
        strategy={verticalListSortingStrategy}
      >
        {children}
      </SortableContext>
    </DndContext>
  );
}
