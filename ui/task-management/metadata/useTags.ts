import { useCallback, useMemo } from "react";

import type { Tag, TagInput } from "@/core/task-management";

import { useTagsStore } from "./useTagsStore";

export interface TagsHookReturn {
  loading: boolean;
  tags: Tag[];
  createTag: (tag: TagInput, callback?: (tag: Tag) => void) => void;
  updateTag: (tagId: Tag["id"], updates: Partial<Omit<Tag, "id">>) => void;
  deleteTag: (tagId: Tag["id"]) => void;
}

/**
 * Manages stored tags.
 */

export function useTags(): TagsHookReturn {
  const tagsStore = useTagsStore();

  const tags = useMemo(
    () =>
      Object.entries(tagsStore.pool).map(([id, tag]) => ({
        id,
        ...tag,
      })),
    [tagsStore.pool],
  );

  const createTag = useCallback<TagsHookReturn["createTag"]>(
    (input, callback) => {
      tagsStore.addTag(input, (tag) => {
        if (callback) callback?.(tag);
        // TODO store tag in backend
      });
    },
    [],
  );

  const updateTag = useCallback<TagsHookReturn["updateTag"]>(
    (tagId, updates) => {
      tagsStore.updateTag(tagId, updates, () => {
        // TODO update in backend
      });
    },
    [],
  );

  const deleteTag = useCallback<TagsHookReturn["deleteTag"]>((tagId) => {
    tagsStore.removeTag(tagId);
    // TODO delete in backend
  }, []);

  return {
    loading: !tagsStore.ready,
    tags,
    createTag,
    updateTag,
    deleteTag,
  };
}
