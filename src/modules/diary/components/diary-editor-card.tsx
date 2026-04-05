import type { ChangeEvent, FormEvent, RefObject } from "react";

import { useI18n } from "@/core/i18n/use-i18n";
import { TagInputField } from "@/features/tags/components/tag-input-field";
import type { TagItem } from "@/features/tags/types/tag";
import { Button } from "@/shared/components/ui/button";
import type { CreateDiaryEntryInput, DiaryEntry } from "@/modules/diary/types/diary";

export type DiaryFormState = CreateDiaryEntryInput;

type DiaryEditorCardProps = {
  mode: "create" | "edit";
  value: DiaryFormState;
  submitting: boolean;
  editingEntry?: DiaryEntry;
  availableTags: TagItem[];
  containerRef?: RefObject<HTMLElement | null>;
  titleInputRef?: RefObject<HTMLInputElement | null>;
  onChange: (field: keyof DiaryFormState, value: string | string[]) => void;
  onCreateTag: (label: string) => Promise<TagItem | null>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel?: () => void;
};

export function DiaryEditorCard({
  mode,
  value,
  submitting,
  editingEntry,
  availableTags,
  containerRef,
  titleInputRef,
  onChange,
  onCreateTag,
  onSubmit,
  onCancel,
}: DiaryEditorCardProps) {
  const { t } = useI18n();
  const isEditMode = mode === "edit";

  return (
    <article className="rounded-[28px] border border-slate-200 bg-white p-6" ref={containerRef}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {isEditMode ? t("diary.editor.editBadge") : t("diary.editor.createBadge")}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            {isEditMode ? editingEntry?.title ?? t("diary.editor.editFallbackTitle") : t("diary.editor.createTitle")}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-7 text-slate-500">
            {t("diary.editor.description")}
          </p>
        </div>
        {isEditMode && onCancel ? (
          <Button variant="outline" onClick={onCancel} type="button">
            {t("diary.editor.cancel")}
          </Button>
        ) : null}
      </div>

      <form className="mt-6 space-y-5" onSubmit={onSubmit}>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">{t("diary.editor.titleLabel")}</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-300 focus:bg-white"
            maxLength={120}
            onChange={(event) => onChange("title", event.target.value)}
            placeholder={t("diary.editor.titlePlaceholder")}
            ref={titleInputRef}
            value={value.title}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">{t("diary.editor.dateLabel")}</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-300 focus:bg-white"
            onChange={(event) => onChange("entryDate", event.target.value)}
            type="date"
            value={value.entryDate}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">{t("diary.editor.contentLabel")}</span>
          <textarea
            className="min-h-40 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-300 focus:bg-white"
            maxLength={3000}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => onChange("content", event.target.value)}
            placeholder={t("diary.editor.contentPlaceholder")}
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
            {isEditMode ? t("diary.editor.submitEdit") : t("diary.editor.submitCreate")}
          </Button>
          <p className="text-sm text-slate-500">
            {isEditMode ? t("diary.editor.submitHintEdit") : t("diary.editor.submitHintCreate")}
          </p>
        </div>
      </form>
    </article>
  );
}
