import { useEffect, useState, type FormEvent } from "react";

import { useI18n } from "@/core/i18n/use-i18n";
import { useTagStore } from "@/features/tags/stores/use-tag-store";
import {
  InspirationEditorCard,
  type InspirationFormState,
} from "@/modules/inspiration/components/inspiration-editor-card";
import { InspirationFiltersBar } from "@/modules/inspiration/components/inspiration-filters-bar";
import { InspirationListCard } from "@/modules/inspiration/components/inspiration-list-card";
import { useInspirationStore } from "@/modules/inspiration/stores/use-inspiration-store";
import type { InspirationItem } from "@/modules/inspiration/types/inspiration";
import { useScrollToEditor } from "@/shared/hooks/use-scroll-to-editor";

const emptyInspirationForm: InspirationFormState = {
  title: "",
  content: "",
  tagIds: [],
};

export function InspirationPage() {
  const { t } = useI18n();
  const {
    items,
    filters,
    hydrated,
    loading,
    error,
    hydrate,
    createInspiration,
    updateInspiration,
    toggleFavorite,
    deleteInspiration,
    clearError,
    setFilters,
    resetFilters,
    getFilteredItems,
  } = useInspirationStore();
  const {
    items: tags,
    hydrated: tagsHydrated,
    hydrate: hydrateTags,
    createTag,
    getTagLabel,
  } = useTagStore();

  const [formState, setFormState] = useState<InspirationFormState>(emptyInspirationForm);
  const [editingItem, setEditingItem] = useState<InspirationItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [editScrollTrigger, setEditScrollTrigger] = useState(0);
  const { containerRef, focusTargetRef } = useScrollToEditor(
    editingItem ? `${editingItem.id}-${editScrollTrigger}` : null,
  );

  useEffect(() => {
    if (!hydrated) {
      void hydrate();
    }
    if (!tagsHydrated) {
      void hydrateTags();
    }
  }, [hydrate, hydrated, hydrateTags, tagsHydrated]);

  const visibleItems = getFilteredItems();
  const favoriteCount = items.filter((item) => item.isFavorite).length;

  const handleFieldChange = (field: keyof InspirationFormState, value: string | string[]) => {
    setFormState((currentState) => ({
      ...currentState,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    const success = editingItem
      ? await updateInspiration({ id: editingItem.id, ...formState })
      : await createInspiration(formState);

    setSubmitting(false);

    if (success) {
      setEditingItem(null);
      setFormState(emptyInspirationForm);
    }
  };

  const handleEdit = (item: InspirationItem) => {
    clearError();
    setEditingItem(item);
    setFormState({
      title: item.title,
      content: item.content,
      tagIds: item.tagIds,
    });
    setEditScrollTrigger((currentValue) => currentValue + 1);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setFormState(emptyInspirationForm);
    clearError();
  };

  const handleDelete = async (itemId: string) => {
    if (editingItem?.id === itemId) {
      handleCancelEdit();
    }

    await deleteInspiration(itemId);
  };

  return (
    <section className="space-y-6">
      <InspirationEditorCard
        containerRef={containerRef}
        editingItem={editingItem ?? undefined}
        mode={editingItem ? "edit" : "create"}
        availableTags={tags}
        onCancel={editingItem ? handleCancelEdit : undefined}
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

      <InspirationFiltersBar
        availableTags={tags}
        filters={filters}
        onChange={(patch) => setFilters(patch)}
        onReset={resetFilters}
      />

      {loading && !hydrated ? (
        <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-10 text-sm text-slate-500">
          {t("inspiration.loading")}
        </div>
      ) : null}

      <InspirationListCard
        favoriteCount={favoriteCount}
        items={visibleItems}
        onDelete={(itemId) => void handleDelete(itemId)}
        onEdit={handleEdit}
        onToggleFavorite={(itemId) => void toggleFavorite(itemId)}
        resolveTagLabel={getTagLabel}
        totalCount={items.length}
      />
    </section>
  );
}
