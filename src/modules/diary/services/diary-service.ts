import type { DiaryEntry } from "@/modules/diary/types/diary";
import { normalizeTagIds } from "@/features/tags/lib/tag-utils";
import {
  EFFIDOCK_STORE_NAMES,
  promisifyRequest,
  withEffiDockStore,
} from "@/shared/lib/storage/effidock-database";

function normalizeDiaryRecord(record: DiaryEntry): DiaryEntry {
  return {
    ...record,
    tagIds: normalizeTagIds(record.tagIds ?? []),
  };
}

export async function listDiaryEntries() {
  return withEffiDockStore(EFFIDOCK_STORE_NAMES.diary, "readonly", async (store) => {
    const records = await promisifyRequest(store.getAll() as IDBRequest<DiaryEntry[]>);
    return records.map(normalizeDiaryRecord);
  });
}

export async function saveDiaryEntry(entry: DiaryEntry) {
  return withEffiDockStore(EFFIDOCK_STORE_NAMES.diary, "readwrite", async (store) => {
    await promisifyRequest(store.put(normalizeDiaryRecord(entry)));
  });
}

export async function removeDiaryEntry(entryId: string) {
  return withEffiDockStore(EFFIDOCK_STORE_NAMES.diary, "readwrite", async (store) => {
    await promisifyRequest(store.delete(entryId));
  });
}
