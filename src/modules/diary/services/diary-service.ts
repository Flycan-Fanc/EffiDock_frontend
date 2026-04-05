import type { DiaryEntry } from "@/modules/diary/types/diary";

const DATABASE_NAME = "effidock-web-mvp";
const DATABASE_VERSION = 2;
const TODO_STORE_NAME = "todo-items";
const DIARY_STORE_NAME = "diary-entries";

function ensureObjectStores(database: IDBDatabase) {
  if (!database.objectStoreNames.contains(TODO_STORE_NAME)) {
    database.createObjectStore(TODO_STORE_NAME, { keyPath: "id" });
  }

  if (!database.objectStoreNames.contains(DIARY_STORE_NAME)) {
    database.createObjectStore(DIARY_STORE_NAME, { keyPath: "id" });
  }
}

function openDiaryDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
      ensureObjectStores(request.result);
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Failed to open IndexedDB."));
  });
}

async function withStore<T>(mode: IDBTransactionMode, runner: (store: IDBObjectStore) => Promise<T>) {
  const database = await openDiaryDatabase();

  try {
    const transaction = database.transaction(DIARY_STORE_NAME, mode);
    const store = transaction.objectStore(DIARY_STORE_NAME);

    return await runner(store);
  } finally {
    database.close();
  }
}

function promisifyRequest<T>(request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed."));
  });
}

export async function listDiaryEntries() {
  return withStore("readonly", async (store) => {
    const records = await promisifyRequest(store.getAll() as IDBRequest<DiaryEntry[]>);
    return records;
  });
}

export async function saveDiaryEntry(entry: DiaryEntry) {
  return withStore("readwrite", async (store) => {
    await promisifyRequest(store.put(entry));
  });
}

export async function removeDiaryEntry(entryId: string) {
  return withStore("readwrite", async (store) => {
    await promisifyRequest(store.delete(entryId));
  });
}
