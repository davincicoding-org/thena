import { useCallback, useState } from "react";
import { nanoid } from "nanoid";

import { Tag } from "@/core/task-management";
import { ExternalState } from "@/ui/utils";

export interface TagsHookOptions {
  initialTags?: Tag[];
  externalState?: ExternalState<Tag[]>;
}

export interface TagsHookReturn {
  tags: Tag[];
  createTag: (tag: Omit<Tag, "id">) => Tag;
  updateTag: (id: string, updates: Partial<Omit<Tag, "id">>) => void;
  deleteTag: (id: string) => void;
}

/**
 * Manages stored tags.
 */
export function useTags({
  initialTags = [],
  externalState: [tags, setTags] = useState<Tag[]>(initialTags),
}: TagsHookOptions = {}): TagsHookReturn {
  const createTag = useCallback(
    (tag: Omit<Tag, "id">) => {
      const newTag: Tag = {
        ...tag,
        id: nanoid(),
      };
      setTags([...tags, newTag]);
      return newTag;
    },
    [tags, setTags],
  );

  const updateTag = useCallback<TagsHookReturn["updateTag"]>(
    (id, updates) => {
      setTags(
        tags.map((tag) => (tag.id === id ? { ...tag, ...updates } : tag)),
      );
    },
    [tags, setTags],
  );

  const deleteTag = useCallback<TagsHookReturn["deleteTag"]>(
    (id) => {
      setTags(tags.filter((tag) => tag.id !== id));
    },
    [tags, setTags],
  );

  return {
    tags,
    createTag,
    updateTag,
    deleteTag,
  };
}
