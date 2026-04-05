import type { SupportedLocale } from "@/core/i18n/types";
import { normalizeTagIds } from "@/features/tags/lib/tag-utils";
import type { DiaryEntry, DiaryFilters, DiarySortMode } from "@/modules/diary/types/diary";

export const defaultDiaryFilters: DiaryFilters = {
  query: "",
  tagId: "all",
  sort: "entry-desc",
};

export function createDiaryEntryId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `diary-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function normalizeDiaryText(value: string) {
  return value.trim();
}

export function normalizeDiaryDate(value: string) {
  return value.trim();
}

export function sortDiaryEntries(items: DiaryEntry[], sort: DiarySortMode) {
  const clonedItems = [...items];

  return clonedItems.sort((left, right) => {
    if (sort === "entry-asc") {
      const byDate = left.entryDate.localeCompare(right.entryDate);

      if (byDate !== 0) {
        return byDate;
      }
    }

    if (sort === "entry-desc") {
      const byDate = right.entryDate.localeCompare(left.entryDate);

      if (byDate !== 0) {
        return byDate;
      }
    }

    return right.updatedAt.localeCompare(left.updatedAt);
  });
}

export function filterDiaryEntries(items: DiaryEntry[], filters: DiaryFilters) {
  const normalizedQuery = filters.query.trim().toLowerCase();

  return items.filter((entry) => {
    const tagIds = normalizeTagIds(entry.tagIds ?? []);

    if (filters.tagId !== "all" && !tagIds.includes(filters.tagId)) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return `${entry.title} ${entry.content}`.toLowerCase().includes(normalizedQuery);
  });
}

export function formatDiaryEntryDate(entryDate: string, locale: SupportedLocale) {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "short",
  }).format(new Date(`${entryDate}T00:00:00`));
}

export function formatDiaryUpdatedAt(value: string, locale: SupportedLocale) {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
