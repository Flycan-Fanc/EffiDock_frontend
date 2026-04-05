import type { TagItem } from "@/features/tags/types/tag";

export function createTagId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `tag-${crypto.randomUUID()}`;
  }

  return `tag-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function normalizeTagLabel(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function normalizeTagLookup(value: string) {
  return normalizeTagLabel(value).toLowerCase();
}

export function normalizeTagIds(tagIds: string[]) {
  return Array.from(
    new Set(
      tagIds
        .map((tagId) => tagId.trim())
        .filter((tagId) => tagId.length > 0),
    ),
  );
}

export function sortTags(items: TagItem[]) {
  return [...items].sort((left, right) => left.label.localeCompare(right.label));
}
