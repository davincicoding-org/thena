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
  tasks: Pick<TaskSelect, "id" | "customSortOrder">[];
  onReorder: (tasks: Pick<TaskSelect, "id">[]) => void;
  onChangeOrder: (params: Pick<TaskSelect, "id" | "customSortOrder">) => void;
}

export function SortableTasksContainer({
  tasks,
  children,
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

        const reorderedItems = arrayMove(tasks, activeIndex, overIndex);

        onReorder(reorderedItems);

        // Calculate which items need customSortOrder updates
        const updates: Pick<TaskSelect, "id" | "customSortOrder">[] = [];

        // Start by assuming all items will use their natural sortOrder (their ID)
        const effectiveSortOrders = new Map<number, number>();
        reorderedItems.forEach((item) => {
          effectiveSortOrders.set(item.id, item.id);
        });

        // Check if any items conflict with this natural ordering and need customSortOrder
        for (let i = 0; i < reorderedItems.length; i++) {
          const currentItem = reorderedItems[i]!;
          const prevItem = reorderedItems[i - 1];
          const nextItem = reorderedItems[i + 1];

          const naturalSortOrder = currentItem.id;
          const prevEffectiveSortOrder = prevItem
            ? effectiveSortOrders.get(prevItem.id)!
            : null;
          const nextEffectiveSortOrder = nextItem
            ? effectiveSortOrders.get(nextItem.id)!
            : null;

          const canUseNaturalPosition =
            (!prevItem || prevEffectiveSortOrder! < naturalSortOrder) &&
            (!nextItem || naturalSortOrder < nextEffectiveSortOrder!);

          if (!canUseNaturalPosition) {
            // This item needs a customSortOrder to maintain its position
            let newCustomSortOrder: number;

            if (prevItem && nextItem) {
              newCustomSortOrder =
                (prevEffectiveSortOrder! + nextEffectiveSortOrder!) / 2;
            } else if (nextItem) {
              newCustomSortOrder = nextEffectiveSortOrder! - 0.5;
            } else if (prevItem) {
              newCustomSortOrder = prevEffectiveSortOrder! + 0.5;
            } else {
              newCustomSortOrder = currentItem.id;
            }

            // Update the effective sortOrder for this item
            effectiveSortOrders.set(currentItem.id, newCustomSortOrder);

            if (currentItem.customSortOrder !== newCustomSortOrder) {
              updates.push({
                id: currentItem.id,
                customSortOrder: newCustomSortOrder,
              });
            }
          } else {
            // Item can use natural position, remove customSortOrder if it has one
            if (currentItem.customSortOrder !== null) {
              updates.push({ id: currentItem.id, customSortOrder: null });
            }
          }
        }

        // Apply all updates
        updates.forEach((update) => {
          onChangeOrder(update);
        });
      }}
    >
      <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
}
