import { useEffect, useState, type FormEvent } from "react";

import { useI18n } from "@/core/i18n/use-i18n";
import { useTagStore } from "@/features/tags/stores/use-tag-store";
import { TodoEditorCard, type TodoFormState } from "@/modules/todo/components/todo-editor-card";
import { TodoFiltersBar } from "@/modules/todo/components/todo-filters-bar";
import { TodoListCard } from "@/modules/todo/components/todo-list-card";
import { useTodoStore } from "@/modules/todo/stores/use-todo-store";
import type { TodoItem } from "@/modules/todo/types/todo";
import { useScrollToEditor } from "@/shared/hooks/use-scroll-to-editor";

const emptyTodoForm: TodoFormState = {
  title: "",
  notes: "",
  tagIds: [],
  priority: "medium",
  dueDate: null,
};

export function TodoPage() {
  const { t } = useI18n();
  const {
    items,
    filters,
    hydrated,
    loading,
    error,
    hydrate,
    createTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    clearError,
    setFilters,
    resetFilters,
    getFilteredTodos,
  } = useTodoStore();
  const {
    items: tags,
    hydrated: tagsHydrated,
    hydrate: hydrateTags,
    createTag,
    getTagLabel,
  } = useTagStore();

  const [formState, setFormState] = useState<TodoFormState>(emptyTodoForm);
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [editScrollTrigger, setEditScrollTrigger] = useState(0);
  const { containerRef, focusTargetRef } = useScrollToEditor(
    editingTodo ? `${editingTodo.id}-${editScrollTrigger}` : null,
  );

  useEffect(() => {
    if (!hydrated) {
      void hydrate();
    }
    if (!tagsHydrated) {
      void hydrateTags();
    }
  }, [hydrate, hydrated, hydrateTags, tagsHydrated]);

  const visibleItems = getFilteredTodos();
  const completedCount = items.filter((item) => item.completed).length;

  const handleFieldChange = (field: keyof TodoFormState, value: string | string[]) => {
    setFormState((currentState) => ({
      ...currentState,
      [field]: field === "dueDate" ? value || null : value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    const success = editingTodo
      ? await updateTodo({ id: editingTodo.id, ...formState })
      : await createTodo(formState);

    setSubmitting(false);

    if (success) {
      setEditingTodo(null);
      setFormState(emptyTodoForm);
    }
  };

  const handleEdit = (todo: TodoItem) => {
    clearError();
    setEditingTodo(todo);
    setFormState({
      title: todo.title,
      notes: todo.notes,
      tagIds: todo.tagIds,
      priority: todo.priority,
      dueDate: todo.dueDate,
    });
    setEditScrollTrigger((currentValue) => currentValue + 1);
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
    setFormState(emptyTodoForm);
    clearError();
  };

  const handleDelete = async (todoId: string) => {
    if (editingTodo?.id === todoId) {
      handleCancelEdit();
    }

    await deleteTodo(todoId);
  };

  return (
    <section className="space-y-6">
      <TodoEditorCard
        containerRef={containerRef}
        editingTodo={editingTodo ?? undefined}
        mode={editingTodo ? "edit" : "create"}
        availableTags={tags}
        onCancel={editingTodo ? handleCancelEdit : undefined}
        onChange={handleFieldChange}
        onCreateTag={createTag}
        onSubmit={handleSubmit}
        submitting={submitting}
        titleInputRef={focusTargetRef}
        value={formState}
      />

      {error ? (
        <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {t(error)}
        </div>
      ) : null}

      <TodoFiltersBar
        availableTags={tags}
        filters={filters}
        onChange={(patch) => setFilters(patch)}
        onReset={resetFilters}
      />

      {loading && !hydrated ? (
        <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-10 text-sm text-slate-500">
          {t("todo.loading")}
        </div>
      ) : null}

      <TodoListCard
        completedCount={completedCount}
        items={visibleItems}
        onDelete={(todoId) => void handleDelete(todoId)}
        onEdit={handleEdit}
        onToggle={(todoId) => void toggleTodo(todoId)}
        resolveTagLabel={getTagLabel}
        totalCount={items.length}
      />
    </section>
  );
}
