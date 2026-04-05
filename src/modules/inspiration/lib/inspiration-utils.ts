import type { TranslateFn } from "@/core/i18n/types";
import type {
  InspirationFavoriteFilter,
  InspirationFilters,
  InspirationItem,
  InspirationSortMode,
} from "@/modules/inspiration/types/inspiration";

export const defaultInspirationFilters: InspirationFilters = {
  query: "",
  favorite: "all",
  sort: "favorite-desc",
};

export function createInspirationId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `inspiration-${crypto.randomUUID()}`;
  }

  return `inspiration-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function normalizeInspirationText(value: string) {
  return value.trim();
}

export function filterInspirations(items: InspirationItem[], filters: InspirationFilters) {
  const normalizedQuery = normalizeInspirationText(filters.query).toLowerCase();

  return items.filter((item) => {
    const matchesQuery =
      !normalizedQuery ||
      item.title.toLowerCase().includes(normalizedQuery) ||
      item.content.toLowerCase().includes(normalizedQuery);

    const matchesFavorite =
      filters.favorite === "all" ||
      (filters.favorite === "favorites" && item.isFavorite) ||
      (filters.favorite === "others" && !item.isFavorite);

    return matchesQuery && matchesFavorite;
  });
}

export function sortInspirations(items: InspirationItem[], sort: InspirationSortMode) {
  return [...items].sort((left, right) => {
    if (sort === "favorite-desc") {
      if (left.isFavorite !== right.isFavorite) {
        return Number(right.isFavorite) - Number(left.isFavorite);
      }

      return right.updatedAt.localeCompare(left.updatedAt);
    }

    if (sort === "updated-desc") {
      return right.updatedAt.localeCompare(left.updatedAt);
    }

    return right.createdAt.localeCompare(left.createdAt);
  });
}

export function formatInspirationTimestamp(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function getFavoriteFilterLabel(value: InspirationFavoriteFilter, t: TranslateFn) {
  return t(`inspiration.favoriteFilter.${value}`);
}

export function getInspirationSortLabel(value: InspirationSortMode, t: TranslateFn) {
  return t(`inspiration.sort.${value}`);
}
