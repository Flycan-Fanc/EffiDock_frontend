import type { ChangeEvent, FormEvent, RefObject } from "react";

import { useI18n } from "@/core/i18n/use-i18n";
import { TagInputField } from "@/features/tags/components/tag-input-field";
import type { TagItem } from "@/features/tags/types/tag";
import type { CreateInspirationInput, InspirationItem } from "@/modules/inspiration/types/inspiration";
import { Button } from "@/shared/components/ui/button";

export type InspirationFormState = CreateInspirationInput;

type InspirationEditorCardProps = {
  mode: "create" | "edit";
  value: InspirationFormState;
  submitting: boolean;
  editingItem?: InspirationItem;
  availableTags: TagItem[];
  containerRef?: RefObject<HTMLElement | null>;
  titleInputRef?: RefObject<HTMLInputElement | null>;
  onChange: (field: keyof InspirationFormState, value: string | string[]) => void;
  onCreateTag: (label: string) => Promise<TagItem | null>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel?: () => void;
};

export function InspirationEditorCard({
  mode,
  value,
  submitting,
  editingItem,
  availableTags,
  containerRef,
  titleInputRef,
  onChange,
  onCreateTag,
  onSubmit,
  onCancel,
}: InspirationEditorCardProps) {
  const { t } = useI18n();
  const isEditMode = mode === "edit";

  return (
    <article className="rounded-[28px] border border-slate-200 bg-white p-6" ref={containerRef}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {isEditMode ? t("inspiration.editor.editBadge") : t("inspiration.editor.createBadge")}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            {isEditMode
              ? editingItem?.title ?? t("inspiration.editor.editFallbackTitle")
              : t("inspiration.editor.createTitle")}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-7 text-slate-500">
            {t("inspiration.editor.description")}
          </p>
        </div>
        {isEditMode && onCancel ? (
          <Button onClick={onCancel} type="button" variant="outline">
            {t("inspiration.editor.cancel")}
          </Button>
        ) : null}
      </div>

      <form className="mt-6 space-y-5" onSubmit={onSubmit}>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">{t("inspiration.editor.titleLabel")}</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-300 focus:bg-white"
            maxLength={120}
            onChange={(event) => onChange("title", event.target.value)}
            placeholder={t("inspiration.editor.titlePlaceholder")}
            ref={titleInputRef}
            value={value.title}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">{t("inspiration.editor.contentLabel")}</span>
          <textarea
            className="min-h-32 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-300 focus:bg-white"
            maxLength={2000}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => onChange("content", event.target.value)}
            placeholder={t("inspiration.editor.contentPlaceholder")}
            value={value.content}
          />
        </label>

        <TagInputField
          availableTags={availableTags}
          onChange={(tagIds) => onChange("tagIds", tagIds)}
          onCreateTag={onCreateTag}
          value={value.tagIds}
        />

        <div className="flex flex-wrap items-center gap-3">
          <Button disabled={submitting} type="submit">
            {isEditMode ? t("inspiration.editor.submitEdit") : t("inspiration.editor.submitCreate")}
          </Button>
          <p className="text-sm text-slate-500">
            {isEditMode ? t("inspiration.editor.submitHintEdit") : t("inspiration.editor.submitHintCreate")}
          </p>
        </div>
      </form>
    </article>
  );
}
