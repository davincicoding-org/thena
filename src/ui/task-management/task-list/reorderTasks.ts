import { arrayMove } from "@dnd-kit/sortable";

import type { TaskSelect } from "@/core/task-management";

// MAYBE all the tasks should be normalized

export function reorderTasks(
  tasks: Pick<TaskSelect, "id" | "customSortOrder">[],
  from: number,
  to: number,
) {
  const reorderedItems = arrayMove(tasks, from, to);
  const updates: Pick<TaskSelect, "id" | "customSortOrder">[] = [];

  // Get effective sort order for an item (customSortOrder if it exists, otherwise ID)
  const getEffectiveSortOrder = (
    item: Pick<TaskSelect, "id" | "customSortOrder">,
  ) => {
    return item.customSortOrder ?? item.id;
  };

  // First pass: Check for any items that now have redundant customSortOrder
  const itemsToCleanup: number[] = [];
  for (let i = 0; i < reorderedItems.length; i++) {
    if (i === to) continue; // Skip the moved item for now

    const currentItem = reorderedItems[i]!;
    if (currentItem.customSortOrder !== null) {
      const itemPrevItem = reorderedItems[i - 1];
      const itemNextItem = reorderedItems[i + 1];

      const itemPrevSortOrder = itemPrevItem
        ? getEffectiveSortOrder(itemPrevItem)
        : null;
      const itemNextSortOrder = itemNextItem
        ? getEffectiveSortOrder(itemNextItem)
        : null;
      const itemNaturalOrder = currentItem.id;

      const itemCanUseNaturalPosition =
        (!itemPrevItem || itemPrevSortOrder! < itemNaturalOrder) &&
        (!itemNextItem || itemNaturalOrder < itemNextSortOrder!);

      if (itemCanUseNaturalPosition) {
        itemsToCleanup.push(currentItem.id);
        updates.push({ id: currentItem.id, customSortOrder: null });
      }
    }
  }

  // Create a temporary function that considers cleaned up items as having null customSortOrder
  const getEffectiveSortOrderWithCleanup = (
    item: Pick<TaskSelect, "id" | "customSortOrder">,
  ) => {
    if (itemsToCleanup.includes(item.id)) {
      return item.id; // Use natural position for cleaned up items
    }
    return item.customSortOrder ?? item.id;
  };

  // Second pass: Handle the moved item with updated context
  const movedItem = reorderedItems[to]!;
  const prevItem = reorderedItems[to - 1];
  const nextItem = reorderedItems[to + 1];

  const prevSortOrder = prevItem
    ? getEffectiveSortOrderWithCleanup(prevItem)
    : null;
  const nextSortOrder = nextItem
    ? getEffectiveSortOrderWithCleanup(nextItem)
    : null;
  const movedItemNaturalOrder = movedItem.id;

  // Check if the moved item can use its natural position (ID)
  const canUseNaturalPosition =
    (!prevItem || prevSortOrder! < movedItemNaturalOrder) &&
    (!nextItem || movedItemNaturalOrder < nextSortOrder!);

  if (!canUseNaturalPosition) {
    // Calculate new custom sort order for the moved item
    let newCustomSortOrder: number;

    if (prevItem && nextItem) {
      newCustomSortOrder = (prevSortOrder! + nextSortOrder!) / 2;
    } else if (nextItem) {
      // Moving to first position
      newCustomSortOrder = nextSortOrder! - 0.5;
    } else if (prevItem) {
      // Moving to last position
      newCustomSortOrder = prevSortOrder! + 0.5;
    } else {
      newCustomSortOrder = movedItemNaturalOrder;
    }

    updates.push({
      id: movedItem.id,
      customSortOrder: newCustomSortOrder,
    });
  } else {
    // Item can use natural position, remove customSortOrder if it has one
    if (movedItem.customSortOrder !== null) {
      updates.push({ id: movedItem.id, customSortOrder: null });
    }
  }

  return {
    reorderedItems,
    updates,
  };
}
