import type { TodoItem } from "@/modules/todo/types/todo";

const DATABASE_NAME = "effidock-web-mvp";
const DATABASE_VERSION = 1;
const TODO_STORE_NAME = "todo-items";

function openTodoDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(TODO_STORE_NAME)) {
        database.createObjectStore(TODO_STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Failed to open IndexedDB."));
  });
}

async function withStore<T>(
  mode: IDBTransactionMode,
  runner: (store: IDBObjectStore) => Promise<T>,
) {
  const database = await openTodoDatabase();

  try {
    const transaction = database.transaction(TODO_STORE_NAME, mode);
    const store = transaction.objectStore(TODO_STORE_NAME);

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

export async function listTodos() {
  return withStore("readonly", async (store) => {
    const records = await promisifyRequest(store.getAll() as IDBRequest<TodoItem[]>);
    return records;
  });
}

export async function saveTodo(todo: TodoItem) {
  return withStore("readwrite", async (store) => {
    await promisifyRequest(store.put(todo));
  });
}

export async function removeTodo(todoId: string) {
  return withStore("readwrite", async (store) => {
    await promisifyRequest(store.delete(todoId));
  });
}
