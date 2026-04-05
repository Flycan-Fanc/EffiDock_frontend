import type { InspirationItem } from "@/modules/inspiration/types/inspiration";
import { normalizeTagIds } from "@/features/tags/lib/tag-utils";
import {
  EFFIDOCK_STORE_NAMES,
  promisifyRequest,
  withEffiDockStore,
} from "@/shared/lib/storage/effidock-database";

function normalizeInspirationRecord(record: InspirationItem): InspirationItem {
  return {
    ...record,
    tagIds: normalizeTagIds(record.tagIds ?? []),
  };
}

export async function listInspirations() {
  return withEffiDockStore(EFFIDOCK_STORE_NAMES.inspiration, "readonly", async (store) => {
    const records = await promisifyRequest(store.getAll() as IDBRequest<InspirationItem[]>);
    return records.map(normalizeInspirationRecord);
  });
}

export async function saveInspiration(item: InspirationItem) {
  return withEffiDockStore(EFFIDOCK_STORE_NAMES.inspiration, "readwrite", async (store) => {
    await promisifyRequest(store.put(normalizeInspirationRecord(item)));
  });
}

export async function removeInspiration(itemId: string) {
  return withEffiDockStore(EFFIDOCK_STORE_NAMES.inspiration, "readwrite", async (store) => {
    await promisifyRequest(store.delete(itemId));
  });
}
