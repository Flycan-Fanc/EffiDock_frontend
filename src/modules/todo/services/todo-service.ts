import type { TodoItem } from "@/modules/todo/types/todo";
import { normalizeTagIds } from "@/features/tags/lib/tag-utils";
import {
  EFFIDOCK_STORE_NAMES,
  promisifyRequest,
  withEffiDockStore,
} from "@/shared/lib/storage/effidock-database";

function normalizeTodoRecord(record: TodoItem): TodoItem {
  return {
    ...record,
    tagIds: normalizeTagIds(record.tagIds ?? []),
  };
}

export async function listTodos() {
  return withEffiDockStore(EFFIDOCK_STORE_NAMES.todo, "readonly", async (store) => {
    const records = await promisifyRequest(store.getAll() as IDBRequest<TodoItem[]>);
    return records.map(normalizeTodoRecord);
  });
}

export async function saveTodo(todo: TodoItem) {
  return withEffiDockStore(EFFIDOCK_STORE_NAMES.todo, "readwrite", async (store) => {
    await promisifyRequest(store.put(normalizeTodoRecord(todo)));
  });
}

export async function removeTodo(todoId: string) {
  return withEffiDockStore(EFFIDOCK_STORE_NAMES.todo, "readwrite", async (store) => {
    await promisifyRequest(store.delete(todoId));
  });
}
