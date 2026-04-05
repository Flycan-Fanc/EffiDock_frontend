import { create } from "zustand";

import { normalizeTagLabel, normalizeTagLookup, sortTags } from "@/features/tags/lib/tag-utils";
import { buildTagRecord, listTags, removeTag, saveTag } from "@/features/tags/services/tag-service";
import type { TagItem } from "@/features/tags/types/tag";

type TagStore = {
  items: TagItem[];
  hydrated: boolean;
  loading: boolean;
  error: string | null;
  hydrate: () => Promise<void>;
  createTag: (label: string) => Promise<TagItem | null>;
  updateTag: (tagId: string, label: string) => Promise<boolean>;
  deleteTag: (tagId: string) => Promise<boolean>;
  clearError: () => void;
  getTagLabel: (tagId: string) => string | undefined;
};

function getStoreErrorMessage(error: unknown) {
  void error;
  return "tags.error.unavailable";
}

export const useTagStore = create<TagStore>((set, get) => ({
  items: [],
  hydrated: false,
  loading: false,
  error: null,
  hydrate: async () => {
    if (get().loading) {
      return;
    }

    set({ loading: true, error: null });

    try {
      const items = sortTags(await listTags());
      set({ items, hydrated: true, loading: false, error: null });
    } catch (error) {
      set({
        hydrated: true,
        loading: false,
        error: getStoreErrorMessage(error),
      });
    }
  },
  createTag: async (label) => {
    const normalizedLabel = normalizeTagLabel(label);

    if (!normalizedLabel) {
      set({ error: "tags.error.labelRequired" });
      return null;
    }

    const existingItem = get()
      .items.find((item) => item.normalizedLabel === normalizeTagLookup(normalizedLabel));

    if (existingItem) {
      set({ error: null });
      return existingItem;
    }

    const nextTag = buildTagRecord(normalizedLabel);

    try {
      await saveTag(nextTag);
      set((state) => ({
        items: sortTags([...state.items, nextTag]),
        error: null,
      }));
      return nextTag;
    } catch (error) {
      set({ error: getStoreErrorMessage(error) });
      return null;
    }
  },
  updateTag: async (tagId, label) => {
    const normalizedLabel = normalizeTagLabel(label);

    if (!normalizedLabel) {
      set({ error: "tags.error.labelRequired" });
      return false;
    }

    const targetTag = get().items.find((item) => item.id === tagId);

    if (!targetTag) {
      set({ error: "tags.error.itemMissing" });
      return false;
    }

    const duplicatedTag = get().items.find(
      (item) =>
        item.id !== tagId && item.normalizedLabel === normalizeTagLookup(normalizedLabel),
    );

    if (duplicatedTag) {
      set({ error: "tags.error.duplicate" });
      return false;
    }

    const nextTag: TagItem = {
      ...targetTag,
      label: normalizedLabel,
      normalizedLabel: normalizeTagLookup(normalizedLabel),
      updatedAt: new Date().toISOString(),
    };

    try {
      await saveTag(nextTag);
      set((state) => ({
        items: sortTags(state.items.map((item) => (item.id === tagId ? nextTag : item))),
        error: null,
      }));
      return true;
    } catch (error) {
      set({ error: getStoreErrorMessage(error) });
      return false;
    }
  },
  deleteTag: async (tagId) => {
    try {
      await removeTag(tagId);
      set((state) => ({
        items: state.items.filter((item) => item.id !== tagId),
        error: null,
      }));
      return true;
    } catch (error) {
      set({ error: getStoreErrorMessage(error) });
      return false;
    }
  },
  clearError: () => set({ error: null }),
  getTagLabel: (tagId) => get().items.find((item) => item.id === tagId)?.label,
}));
