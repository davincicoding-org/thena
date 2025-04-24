import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { Tag } from "@/core/task-management";
import { createUniqueId } from "@/ui/utils";

import { localDB } from "../../store";

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
  devtools(
    persist(
      (set, get) => ({
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
            const { [tagId]: _, ...remainingTags } = state.pool;

            return {
              pool: remainingTags,
            };
          });
        },
      }),
      {
        name: "tags",
        storage: {
          getItem: async (name) => {
            const value = await localDB.getItem(name);
            if (!value) return { state: { pool: {}, ready: true } };

            const pool = JSON.parse(value as string) as TagsStoreState["pool"];
            return {
              state: {
                pool,
                ready: true,
              },
            };
          },
          setItem: (name, { state }) => {
            localDB.setItem(name, JSON.stringify(state.pool));
          },
          removeItem: (name) => {
            localDB.removeItem(name);
          },
        },
      },
    ),
  ),
);
