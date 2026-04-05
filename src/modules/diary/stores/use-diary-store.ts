import { create } from "zustand";

import {
  createDiaryEntryId,
  defaultDiaryFilters,
  filterDiaryEntries,
  normalizeDiaryDate,
  normalizeDiaryText,
  sortDiaryEntries,
} from "@/modules/diary/lib/diary-utils";
import {
  listDiaryEntries,
  removeDiaryEntry,
  saveDiaryEntry,
} from "@/modules/diary/services/diary-service";
import type {
  CreateDiaryEntryInput,
  DiaryEntry,
  DiaryFilters,
  UpdateDiaryEntryInput,
} from "@/modules/diary/types/diary";

type DiaryStore = {
  items: DiaryEntry[];
  filters: DiaryFilters;
  hydrated: boolean;
  loading: boolean;
  error: string | null;
  hydrate: () => Promise<void>;
  createEntry: (input: CreateDiaryEntryInput) => Promise<boolean>;
  updateEntry: (input: UpdateDiaryEntryInput) => Promise<boolean>;
  deleteEntry: (entryId: string) => Promise<void>;
  clearError: () => void;
  setFilters: (patch: Partial<DiaryFilters>) => void;
  resetFilters: () => void;
  getFilteredEntries: () => DiaryEntry[];
};

function getStoreErrorMessage(error: unknown) {
  void error;
  return "diary.error.unavailable";
}

export const useDiaryStore = create<DiaryStore>((set, get) => ({
  items: [],
  filters: defaultDiaryFilters,
  hydrated: false,
  loading: false,
  error: null,
  hydrate: async () => {
    if (get().loading) {
      return;
    }

    set({ loading: true, error: null });

    try {
      const items = await listDiaryEntries();
      set({ items, hydrated: true, loading: false });
    } catch (error) {
      set({
        hydrated: true,
        loading: false,
        error: getStoreErrorMessage(error),
      });
    }
  },
  createEntry: async (input) => {
    const title = normalizeDiaryText(input.title);
    const content = normalizeDiaryText(input.content);
    const entryDate = normalizeDiaryDate(input.entryDate);

    if (!title) {
      set({ error: "diary.error.titleRequired" });
      return false;
    }

    if (!content) {
      set({ error: "diary.error.contentRequired" });
      return false;
    }

    if (!entryDate) {
      set({ error: "diary.error.dateRequired" });
      return false;
    }

    const timestamp = new Date().toISOString();
    const nextEntry: DiaryEntry = {
      id: createDiaryEntryId(),
      title,
      content,
      entryDate,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    try {
      await saveDiaryEntry(nextEntry);
      set((state) => ({ items: [nextEntry, ...state.items], error: null }));
      return true;
    } catch (error) {
      set({ error: getStoreErrorMessage(error) });
      return false;
    }
  },
  updateEntry: async (input) => {
    const title = normalizeDiaryText(input.title);
    const content = normalizeDiaryText(input.content);
    const entryDate = normalizeDiaryDate(input.entryDate);

    if (!title) {
      set({ error: "diary.error.titleRequired" });
      return false;
    }

    if (!content) {
      set({ error: "diary.error.contentRequired" });
      return false;
    }

    if (!entryDate) {
      set({ error: "diary.error.dateRequired" });
      return false;
    }

    const targetEntry = get().items.find((item) => item.id === input.id);

    if (!targetEntry) {
      set({ error: "diary.error.itemMissing" });
      return false;
    }

    const nextEntry: DiaryEntry = {
      ...targetEntry,
      title,
      content,
      entryDate,
      updatedAt: new Date().toISOString(),
    };

    try {
      await saveDiaryEntry(nextEntry);
      set((state) => ({
        items: state.items.map((item) => (item.id === nextEntry.id ? nextEntry : item)),
        error: null,
      }));
      return true;
    } catch (error) {
      set({ error: getStoreErrorMessage(error) });
      return false;
    }
  },
  deleteEntry: async (entryId) => {
    try {
      await removeDiaryEntry(entryId);
      set((state) => ({
        items: state.items.filter((item) => item.id !== entryId),
        error: null,
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
  resetFilters: () => set({ filters: defaultDiaryFilters }),
  getFilteredEntries: () => {
    const state = get();
    return sortDiaryEntries(filterDiaryEntries(state.items, state.filters), state.filters.sort);
  },
}));
