import { create } from "zustand";
import { devtools } from "zustand/middleware";

import type { Tag } from "@/core/task-management";
import { createUniqueId } from "@/ui/utils";

export type TagMatcher = (tag: Tag) => boolean;

interface TagsStoreState {
  // Tags data - storing tasks without redundant IDs
  pool: Record<string, Omit<Tag, "id">>;
  ready: boolean;

  addTag: (tag: Omit<Tag, "id">, callback?: (tag: Tag) => void) => void;
  addTags: (tags: Omit<Tag, "id">[], callback?: (tags: Tag[]) => void) => void;
  updateTag: (
    tagId: Tag["id"],
    updates: Partial<Omit<Tag, "id">>,
    callback?: (tag: Tag) => void,
  ) => void;
  removeTag: (tagId: Tag["id"]) => void;
}

export const useTagsStore = create<TagsStoreState>()(
  devtools((set) => ({
    pool: {},
    items: [],
    ready: false,
    addTag: (tag, callback) =>
      set((state) => {
        const id = createUniqueId(state.pool);

        callback?.({ ...tag, id });

        return {
          pool: {
            ...state.pool,
            [id]: tag,
          },
        };
      }),
    addTags: (tags, callback) => {
      set((state) => {
        const newTags = tags.reduce<TagsStoreState["pool"]>(
          (acc, tag) => ({
            ...acc,
            [createUniqueId({
              ...acc,
              ...state.pool,
            })]: { ...tag, addedAt: new Date().toISOString() },
          }),
          {},
        );

        callback?.(
          Object.entries(newTags).map(([id, tag]) => ({
            ...tag,
            id,
          })),
        );

        return {
          pool: { ...state.pool, ...newTags },
        };
      });
    },
    updateTag: (tagId, updates, callback) => {
      set((state) => {
        const existingTag = state.pool[tagId];
        if (!existingTag) return state;

        const updatedTag = { ...existingTag, ...updates };

        callback?.({ ...updatedTag, id: tagId });

        return {
          pool: {
            ...state.pool,
            [tagId]: updatedTag,
          },
        };
      });
    },
    removeTag: (tagId) => {
      set((state) => {
        const { [tagId]: _removedTag, ...remainingTags } = state.pool;

        return {
          pool: remainingTags,
        };
      });
    },
  })),
);
