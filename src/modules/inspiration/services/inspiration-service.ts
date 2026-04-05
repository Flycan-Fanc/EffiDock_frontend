import type { InspirationItem } from "@/modules/inspiration/types/inspiration";
import {
  EFFIDOCK_STORE_NAMES,
  promisifyRequest,
  withEffiDockStore,
} from "@/shared/lib/storage/effidock-database";

export async function listInspirations() {
  return withEffiDockStore(EFFIDOCK_STORE_NAMES.inspiration, "readonly", async (store) => {
    const records = await promisifyRequest(store.getAll() as IDBRequest<InspirationItem[]>);
    return records;
  });
}

export async function saveInspiration(item: InspirationItem) {
  return withEffiDockStore(EFFIDOCK_STORE_NAMES.inspiration, "readwrite", async (store) => {
    await promisifyRequest(store.put(item));
  });
}

export async function removeInspiration(itemId: string) {
  return withEffiDockStore(EFFIDOCK_STORE_NAMES.inspiration, "readwrite", async (store) => {
    await promisifyRequest(store.delete(itemId));
  });
}
