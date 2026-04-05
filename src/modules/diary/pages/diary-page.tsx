import { useEffect, useState, type FormEvent } from "react";

import { useI18n } from "@/core/i18n/use-i18n";
import {
  DiaryEditorCard,
  type DiaryFormState,
} from "@/modules/diary/components/diary-editor-card";
import { DiaryFiltersBar } from "@/modules/diary/components/diary-filters-bar";
import { DiaryListCard } from "@/modules/diary/components/diary-list-card";
import { useDiaryStore } from "@/modules/diary/stores/use-diary-store";
import type { DiaryEntry } from "@/modules/diary/types/diary";
import { useScrollToEditor } from "@/shared/hooks/use-scroll-to-editor";

const emptyDiaryForm: DiaryFormState = {
  title: "",
  content: "",
  entryDate: new Date().toISOString().slice(0, 10),
};

export function DiaryPage() {
  const { t } = useI18n();
  const {
    items,
    filters,
    hydrated,
    loading,
    error,
    hydrate,
    createEntry,
    updateEntry,
    deleteEntry,
    clearError,
    setFilters,
    resetFilters,
    getFilteredEntries,
  } = useDiaryStore();

  const [formState, setFormState] = useState<DiaryFormState>(emptyDiaryForm);
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [editScrollTrigger, setEditScrollTrigger] = useState(0);
  const { containerRef, focusTargetRef } = useScrollToEditor(
    editingEntry ? `${editingEntry.id}-${editScrollTrigger}` : null,
  );

  useEffect(() => {
    if (!hydrated) {
      void hydrate();
    }
  }, [hydrate, hydrated]);

  const visibleItems = getFilteredEntries();

  const handleFieldChange = (field: keyof DiaryFormState, value: string) => {
    setFormState((currentState) => ({
      ...currentState,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    const success = editingEntry
      ? await updateEntry({ id: editingEntry.id, ...formState })
      : await createEntry(formState);

    setSubmitting(false);

    if (success) {
      setEditingEntry(null);
      setFormState(emptyDiaryForm);
    }
  };

  const handleEdit = (entry: DiaryEntry) => {
    clearError();
    setEditingEntry(entry);
    setFormState({
      title: entry.title,
      content: entry.content,
      entryDate: entry.entryDate,
    });
    setEditScrollTrigger((currentValue) => currentValue + 1);
  };

  const handleCancelEdit = () => {
    setEditingEntry(null);
    setFormState(emptyDiaryForm);
    clearError();
  };

  const handleDelete = async (entryId: string) => {
    if (editingEntry?.id === entryId) {
      handleCancelEdit();
    }

    await deleteEntry(entryId);
  };

  return (
    <section className="space-y-6">
      <DiaryEditorCard
        containerRef={containerRef}
        editingEntry={editingEntry ?? undefined}
        mode={editingEntry ? "edit" : "create"}
        onCancel={editingEntry ? handleCancelEdit : undefined}
        onChange={handleFieldChange}
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

      <DiaryFiltersBar filters={filters} onChange={(patch) => setFilters(patch)} onReset={resetFilters} />

      {loading && !hydrated ? (
        <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-10 text-sm text-slate-500">
          {t("diary.loading")}
        </div>
      ) : null}

      <DiaryListCard
        items={visibleItems}
        onDelete={(entryId) => void handleDelete(entryId)}
        onEdit={handleEdit}
        totalCount={items.length}
      />
    </section>
  );
}
