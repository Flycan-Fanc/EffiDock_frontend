import type { TodoItem } from "@/modules/todo/types/todo";
import {
  EFFIDOCK_STORE_NAMES,
  promisifyRequest,
  withEffiDockStore,
} from "@/shared/lib/storage/effidock-database";

export async function listTodos() {
  return withEffiDockStore(EFFIDOCK_STORE_NAMES.todo, "readonly", async (store) => {
    const records = await promisifyRequest(store.getAll() as IDBRequest<TodoItem[]>);
    return records;
  });
}

export async function saveTodo(todo: TodoItem) {
  return withEffiDockStore(EFFIDOCK_STORE_NAMES.todo, "readwrite", async (store) => {
    await promisifyRequest(store.put(todo));
  });
}

export async function removeTodo(todoId: string) {
  return withEffiDockStore(EFFIDOCK_STORE_NAMES.todo, "readwrite", async (store) => {
    await promisifyRequest(store.delete(todoId));
  });
}
