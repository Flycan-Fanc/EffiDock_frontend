import type { DiaryEntry } from "@/modules/diary/types/diary";
import {
  EFFIDOCK_STORE_NAMES,
  promisifyRequest,
  withEffiDockStore,
} from "@/shared/lib/storage/effidock-database";

export async function listDiaryEntries() {
  return withEffiDockStore(EFFIDOCK_STORE_NAMES.diary, "readonly", async (store) => {
    const records = await promisifyRequest(store.getAll() as IDBRequest<DiaryEntry[]>);
    return records;
  });
}

export async function saveDiaryEntry(entry: DiaryEntry) {
  return withEffiDockStore(EFFIDOCK_STORE_NAMES.diary, "readwrite", async (store) => {
    await promisifyRequest(store.put(entry));
  });
}

export async function removeDiaryEntry(entryId: string) {
  return withEffiDockStore(EFFIDOCK_STORE_NAMES.diary, "readwrite", async (store) => {
    await promisifyRequest(store.delete(entryId));
  });
}
