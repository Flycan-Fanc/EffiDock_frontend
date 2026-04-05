import type { ChangeEvent, FormEvent, RefObject } from "react";

import { useI18n } from "@/core/i18n/use-i18n";
import { TagInputField } from "@/features/tags/components/tag-input-field";
import type { TagItem } from "@/features/tags/types/tag";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { getPriorityLabel } from "@/modules/todo/lib/todo-utils";
import type { CreateTodoInput, TodoItem, TodoPriority } from "@/modules/todo/types/todo";

export type TodoFormState = CreateTodoInput;

type TodoEditorCardProps = {
  mode: "create" | "edit";
  value: TodoFormState;
  submitting: boolean;
  editingTodo?: TodoItem;
  availableTags: TagItem[];
  containerRef?: RefObject<HTMLElement | null>;
  titleInputRef?: RefObject<HTMLInputElement | null>;
  onChange: (field: keyof TodoFormState, value: string | string[]) => void;
  onCreateTag: (label: string) => Promise<TagItem | null>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel?: () => void;
};

const priorityOptions: TodoPriority[] = ["high", "medium", "low"];

export function TodoEditorCard({
  mode,
  value,
  submitting,
  editingTodo,
  availableTags,
  containerRef,
  titleInputRef,
  onChange,
  onCreateTag,
  onSubmit,
  onCancel,
}: TodoEditorCardProps) {
  const { t } = useI18n();
  const isEditMode = mode === "edit";

  return (
    <article className="rounded-[28px] border border-slate-200 bg-white p-6" ref={containerRef}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {isEditMode ? t("todo.editor.editBadge") : t("todo.editor.createBadge")}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            {isEditMode ? editingTodo?.title ?? t("todo.editor.editFallbackTitle") : t("todo.editor.createTitle")}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-7 text-slate-500">
            {t("todo.editor.description")}
          </p>
        </div>
        {isEditMode && onCancel ? (
          <Button variant="outline" onClick={onCancel} type="button">
            {t("todo.editor.cancel")}
          </Button>
        ) : null}
      </div>

      <form className="mt-6 space-y-5" onSubmit={onSubmit}>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">{t("todo.editor.titleLabel")}</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-300 focus:bg-white"
            maxLength={120}
            onChange={(event) => onChange("title", event.target.value)}
            placeholder={t("todo.editor.titlePlaceholder")}
            ref={titleInputRef}
            value={value.title}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">{t("todo.editor.notesLabel")}</span>
          <textarea
            className="min-h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-300 focus:bg-white"
            maxLength={500}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => onChange("notes", event.target.value)}
            placeholder={t("todo.editor.notesPlaceholder")}
            value={value.notes}
          />
        </label>

        <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-slate-700">{t("todo.editor.priorityLabel")}</legend>
            <div className="flex flex-wrap gap-2">
              {priorityOptions.map((priority) => {
                const selected = value.priority === priority;

                return (
                  <button
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm transition",
                      selected
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                    )}
                    key={priority}
                    onClick={() => onChange("priority", priority)}
                    type="button"
                  >
                    {getPriorityLabel(priority, t)}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">{t("todo.editor.dueDateLabel")}</span>
            <input
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-300 focus:bg-white"
              onChange={(event) => onChange("dueDate", event.target.value)}
              type="date"
              value={value.dueDate ?? ""}
            />
          </label>
        </div>

        <TagInputField
          availableTags={availableTags}
          onChange={(tagIds) => onChange("tagIds", tagIds)}
          onCreateTag={onCreateTag}
          value={value.tagIds}
        />

        <div className="flex flex-wrap items-center gap-3">
          <Button disabled={submitting} type="submit">
            {isEditMode ? t("todo.editor.submitEdit") : t("todo.editor.submitCreate")}
          </Button>
          <p className="text-sm text-slate-500">
            {isEditMode ? t("todo.editor.submitHintEdit") : t("todo.editor.submitHintCreate")}
          </p>
        </div>
      </form>
    </article>
  );
}
