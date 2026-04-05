import { create } from "zustand";

import {
  createTodoId,
  defaultTodoFilters,
  filterTodos,
  normalizeTodoDate,
  normalizeTodoText,
  sortTodos,
} from "@/modules/todo/lib/todo-utils";
import { listTodos, removeTodo, saveTodo } from "@/modules/todo/services/todo-service";
import type { CreateTodoInput, TodoFilters, TodoItem, UpdateTodoInput } from "@/modules/todo/types/todo";

type TodoStore = {
  items: TodoItem[];
  filters: TodoFilters;
  hydrated: boolean;
  loading: boolean;
  error: string | null;
  hydrate: () => Promise<void>;
  createTodo: (input: CreateTodoInput) => Promise<boolean>;
  updateTodo: (input: UpdateTodoInput) => Promise<boolean>;
  toggleTodo: (todoId: string) => Promise<void>;
  deleteTodo: (todoId: string) => Promise<void>;
  clearError: () => void;
  setFilters: (patch: Partial<TodoFilters>) => void;
  resetFilters: () => void;
  getFilteredTodos: () => TodoItem[];
};

function getStoreErrorMessage(error: unknown) {
  void error;
  return "todo.error.unavailable";
}

export const useTodoStore = create<TodoStore>((set, get) => ({
  items: [],
  filters: defaultTodoFilters,
  hydrated: false,
  loading: false,
  error: null,
  hydrate: async () => {
    if (get().loading) {
      return;
    }

    set({ loading: true, error: null });

    try {
      const items = await listTodos();
      set({ items, hydrated: true, loading: false });
    } catch (error) {
      set({
        hydrated: true,
        loading: false,
        error: getStoreErrorMessage(error),
      });
    }
  },
  createTodo: async (input) => {
    const title = normalizeTodoText(input.title);

    if (!title) {
      set({ error: "todo.error.titleRequired" });
      return false;
    }

    const timestamp = new Date().toISOString();
    const nextTodo: TodoItem = {
      id: createTodoId(),
      title,
      notes: normalizeTodoText(input.notes),
      completed: false,
      priority: input.priority,
      dueDate: normalizeTodoDate(input.dueDate),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    try {
      await saveTodo(nextTodo);
      set((state) => ({ items: [nextTodo, ...state.items], error: null }));
      return true;
    } catch (error) {
      set({ error: getStoreErrorMessage(error) });
      return false;
    }
  },
  updateTodo: async (input) => {
    const title = normalizeTodoText(input.title);

    if (!title) {
      set({ error: "todo.error.titleRequired" });
      return false;
    }

    const targetTodo = get().items.find((item) => item.id === input.id);

    if (!targetTodo) {
      set({ error: "todo.error.itemMissing" });
      return false;
    }

    const nextTodo: TodoItem = {
      ...targetTodo,
      title,
      notes: normalizeTodoText(input.notes),
      priority: input.priority,
      dueDate: normalizeTodoDate(input.dueDate),
      updatedAt: new Date().toISOString(),
    };

    try {
      await saveTodo(nextTodo);
      set((state) => ({
        items: state.items.map((item) => (item.id === nextTodo.id ? nextTodo : item)),
        error: null,
      }));
      return true;
    } catch (error) {
      set({ error: getStoreErrorMessage(error) });
      return false;
    }
  },
  toggleTodo: async (todoId) => {
    const targetTodo = get().items.find((item) => item.id === todoId);

    if (!targetTodo) {
      return;
    }

    const nextTodo: TodoItem = {
      ...targetTodo,
      completed: !targetTodo.completed,
      updatedAt: new Date().toISOString(),
    };

    try {
      await saveTodo(nextTodo);
      set((state) => ({
        items: state.items.map((item) => (item.id === todoId ? nextTodo : item)),
        error: null,
      }));
    } catch (error) {
      set({ error: getStoreErrorMessage(error) });
    }
  },
  deleteTodo: async (todoId) => {
    try {
      await removeTodo(todoId);
      set((state) => ({
        items: state.items.filter((item) => item.id !== todoId),
        error: null,
      }));
    } catch (error) {
      set({ error: getStoreErrorMessage(error) });
    }
  },
  clearError: () => set({ error: null }),
  setFilters: (patch) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...patch,
      },
    })),
  resetFilters: () => set({ filters: defaultTodoFilters }),
  getFilteredTodos: () => {
    const state = get();
    return sortTodos(filterTodos(state.items, state.filters), state.filters.sort);
  },
}));
