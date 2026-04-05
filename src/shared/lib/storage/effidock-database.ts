const DATABASE_NAME = "effidock-web-mvp";
const DATABASE_VERSION = 4;

export const EFFIDOCK_STORE_NAMES = {
  todo: "todo-items",
  diary: "diary-entries",
  inspiration: "inspiration-items",
  tags: "tag-items",
} as const;

function ensureObjectStores(database: IDBDatabase) {
  Object.values(EFFIDOCK_STORE_NAMES).forEach((storeName) => {
    if (!database.objectStoreNames.contains(storeName)) {
      database.createObjectStore(storeName, { keyPath: "id" });
    }
  });
}

export function openEffiDockDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
      ensureObjectStores(request.result);
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Failed to open IndexedDB."));
  });
}

export async function withEffiDockStore<T>(
  storeName: string,
  mode: IDBTransactionMode,
  runner: (store: IDBObjectStore) => Promise<T>,
) {
  const database = await openEffiDockDatabase();

  try {
    const transaction = database.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);

    return await runner(store);
  } finally {
    database.close();
  }
}

export function promisifyRequest<T>(request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed."));
  });
}
