import { createTagId, normalizeTagIds } from "@/features/tags/lib/tag-utils";
import type { TagItem } from "@/features/tags/types/tag";
import type { DiaryEntry } from "@/modules/diary/types/diary";
import type { InspirationItem } from "@/modules/inspiration/types/inspiration";
import type { TodoItem } from "@/modules/todo/types/todo";
import {
  EFFIDOCK_STORE_NAMES,
  promisifyRequest,
  withEffiDockStore,
} from "@/shared/lib/storage/effidock-database";

function normalizeTagRecord(record: Partial<TagItem> & Pick<TagItem, "id" | "label">): TagItem {
  const timestamp = new Date().toISOString();
  const normalizedLabel = record.normalizedLabel ?? record.label.trim().toLowerCase();

  return {
    id: record.id,
    label: record.label,
    normalizedLabel,
    createdAt: record.createdAt ?? timestamp,
    updatedAt: record.updatedAt ?? record.createdAt ?? timestamp,
  };
}

async function cleanupDeletedTagFromStore<T extends { id: string; tagIds?: string[] }>(
  storeName: string,
  deletedTagId: string,
) {
  return withEffiDockStore(storeName, "readwrite", async (store) => {
    const records = await promisifyRequest(store.getAll() as IDBRequest<T[]>);

    await Promise.all(
      records.map(async (record) => {
        const currentTagIds = normalizeTagIds(record.tagIds ?? []).filter(
          (tagId) => tagId !== deletedTagId,
        );

        if (currentTagIds.length === 0) {
          if ((record.tagIds ?? []).length === 0) {
            return;
          }
        }

        if (currentTagIds.length === (record.tagIds ?? []).length) {
          return;
        }

        await promisifyRequest(store.put({ ...record, tagIds: currentTagIds }));
      }),
    );
  });
}

export async function listTags() {
  return withEffiDockStore(EFFIDOCK_STORE_NAMES.tags, "readonly", async (store) => {
    const records = await promisifyRequest(store.getAll() as IDBRequest<TagItem[]>);
    return records.map((record) => normalizeTagRecord(record));
  });
}

export async function saveTag(tag: TagItem) {
  return withEffiDockStore(EFFIDOCK_STORE_NAMES.tags, "readwrite", async (store) => {
    await promisifyRequest(store.put(tag));
  });
}

export async function removeTag(tagId: string) {
  await withEffiDockStore(EFFIDOCK_STORE_NAMES.tags, "readwrite", async (store) => {
    await promisifyRequest(store.delete(tagId));
  });

  await Promise.all([
    cleanupDeletedTagFromStore<TodoItem>(EFFIDOCK_STORE_NAMES.todo, tagId),
    cleanupDeletedTagFromStore<DiaryEntry>(EFFIDOCK_STORE_NAMES.diary, tagId),
    cleanupDeletedTagFromStore<InspirationItem>(EFFIDOCK_STORE_NAMES.inspiration, tagId),
  ]);
}

export function buildTagRecord(label: string) {
  const timestamp = new Date().toISOString();
  const normalizedLabel = label.trim().toLowerCase();

  return {
    id: createTagId(),
    label,
    normalizedLabel,
    createdAt: timestamp,
    updatedAt: timestamp,
  } satisfies TagItem;
}
