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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import type { TaskSelect } from "@/core/task-management";

export interface SortableTasksContainerProps {
  tasks: Pick<TaskSelect, "id" | "sortOrder">[];
  onChangeOrder: (params: Pick<TaskSelect, "id" | "customSortOrder">) => void;
}

export function SortableTasksContainer({
  tasks,
  children,
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
