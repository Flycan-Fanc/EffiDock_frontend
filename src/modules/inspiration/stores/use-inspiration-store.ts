import { create } from "zustand";

import { normalizeTagIds } from "@/features/tags/lib/tag-utils";
import {
  createInspirationId,
  defaultInspirationFilters,
  filterInspirations,
  normalizeInspirationText,
  sortInspirations,
} from "@/modules/inspiration/lib/inspiration-utils";
import {
  listInspirations,
  removeInspiration,
  saveInspiration,
} from "@/modules/inspiration/services/inspiration-service";
import type {
  CreateInspirationInput,
  InspirationFilters,
  InspirationItem,
  UpdateInspirationInput,
} from "@/modules/inspiration/types/inspiration";

type InspirationStore = {
  items: InspirationItem[];
  filters: InspirationFilters;
  hydrated: boolean;
  loading: boolean;
  error: string | null;
  hydrate: () => Promise<void>;
  createInspiration: (input: CreateInspirationInput) => Promise<boolean>;
  updateInspiration: (input: UpdateInspirationInput) => Promise<boolean>;
  toggleFavorite: (itemId: string) => Promise<void>;
  deleteInspiration: (itemId: string) => Promise<void>;
  removeTag: (tagId: string) => Promise<void>;
  clearError: () => void;
  setFilters: (patch: Partial<InspirationFilters>) => void;
  resetFilters: () => void;
  getFilteredItems: () => InspirationItem[];
};

function getStoreErrorMessage(error: unknown) {
  void error;
  return "inspiration.error.unavailable";
}

export const useInspirationStore = create<InspirationStore>((set, get) => ({
  items: [],
  filters: defaultInspirationFilters,
  hydrated: false,
  loading: false,
  error: null,
  hydrate: async () => {
    if (get().loading) {
      return;
    }

    set({ loading: true, error: null });

    try {
      const items = await listInspirations();
      set({ items, hydrated: true, loading: false });
    } catch (error) {
      set({
        hydrated: true,
        loading: false,
        error: getStoreErrorMessage(error),
      });
    }
  },
  createInspiration: async (input) => {
    const title = normalizeInspirationText(input.title);

    if (!title) {
      set({ error: "inspiration.error.titleRequired" });
      return false;
    }

    const timestamp = new Date().toISOString();
    const nextItem: InspirationItem = {
      id: createInspirationId(),
      title,
      content: normalizeInspirationText(input.content),
      tagIds: normalizeTagIds(input.tagIds),
      isFavorite: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    try {
      await saveInspiration(nextItem);
      set((state) => ({ items: [nextItem, ...state.items], error: null }));
      return true;
    } catch (error) {
      set({ error: getStoreErrorMessage(error) });
      return false;
    }
  },
  updateInspiration: async (input) => {
    const title = normalizeInspirationText(input.title);

    if (!title) {
      set({ error: "inspiration.error.titleRequired" });
      return false;
    }

    const targetItem = get().items.find((item) => item.id === input.id);

    if (!targetItem) {
      set({ error: "inspiration.error.itemMissing" });
      return false;
    }

    const nextItem: InspirationItem = {
      ...targetItem,
      title,
      content: normalizeInspirationText(input.content),
      tagIds: normalizeTagIds(input.tagIds),
      updatedAt: new Date().toISOString(),
    };

    try {
      await saveInspiration(nextItem);
      set((state) => ({
        items: state.items.map((item) => (item.id === nextItem.id ? nextItem : item)),
        error: null,
      }));
      return true;
    } catch (error) {
      set({ error: getStoreErrorMessage(error) });
      return false;
    }
  },
  toggleFavorite: async (itemId) => {
    const targetItem = get().items.find((item) => item.id === itemId);

    if (!targetItem) {
      return;
    }

    const nextItem: InspirationItem = {
      ...targetItem,
      isFavorite: !targetItem.isFavorite,
      updatedAt: new Date().toISOString(),
    };

    try {
      await saveInspiration(nextItem);
      set((state) => ({
        items: state.items.map((item) => (item.id === itemId ? nextItem : item)),
        error: null,
      }));
    } catch (error) {
      set({ error: getStoreErrorMessage(error) });
    }
  },
  deleteInspiration: async (itemId) => {
    try {
      await removeInspiration(itemId);
      set((state) => ({
        items: state.items.filter((item) => item.id !== itemId),
        error: null,
      }));
    } catch (error) {
      set({ error: getStoreErrorMessage(error) });
    }
  },
  removeTag: async (tagId) => {
    const affectedItems = get().items.filter((item) => item.tagIds.includes(tagId));

    if (affectedItems.length === 0) {
      return;
    }

    const nextItems = affectedItems.map((item) => ({
      ...item,
      tagIds: item.tagIds.filter((currentTagId) => currentTagId !== tagId),
      updatedAt: new Date().toISOString(),
    }));

    try {
      await Promise.all(nextItems.map((item) => saveInspiration(item)));
      set((state) => ({
        items: state.items.map(
          (item) => nextItems.find((nextItem) => nextItem.id === item.id) ?? item,
        ),
      }));
    } catch (error) {
      set({ error: getStoreErrorMessage(error) });
    }
  },
  clearError: () => set({ error: null }),
  setFilters: (patch) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...patch,
      },
    })),
  resetFilters: () => set({ filters: defaultInspirationFilters }),
  getFilteredItems: () => {
    const state = get();
    return sortInspirations(filterInspirations(state.items, state.filters), state.filters.sort);
  },
}));
