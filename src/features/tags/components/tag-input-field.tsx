import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";

import { useI18n } from "@/core/i18n/use-i18n";
import type { TagItem } from "@/features/tags/types/tag";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

type TagInputFieldProps = {
  availableTags: TagItem[];
  value: string[];
  onChange: (tagIds: string[]) => void;
  onCreateTag: (label: string) => Promise<TagItem | null>;
};

export function TagInputField({
  availableTags,
  value,
  onChange,
  onCreateTag,
}: TagInputFieldProps) {
  const { t } = useI18n();
  const [draft, setDraft] = useState("");
  const selectedTags = availableTags.filter((tag) => value.includes(tag.id));

  const toggleTag = (tagId: string) => {
    if (value.includes(tagId)) {
      onChange(value.filter((currentTagId) => currentTagId !== tagId));
      return;
    }

    onChange([...value, tagId]);
  };

  const handleCreate = async () => {
    const createdTag = await onCreateTag(draft);

    if (!createdTag) {
      return;
    }

    if (!value.includes(createdTag.id)) {
      onChange([...value, createdTag.id]);
    }

    setDraft("");
  };

  const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" && event.key !== ",") {
      return;
    }

    event.preventDefault();
    await handleCreate();
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <span className="text-sm font-medium text-slate-700">{t("tags.field.label")}</span>
        <div className="flex flex-wrap gap-2">
          {selectedTags.length === 0 ? (
            <span className="rounded-full bg-slate-100 px-3 py-2 text-xs text-slate-500">
              {t("tags.field.emptySelection")}
            </span>
          ) : null}
          {selectedTags.map((tag) => (
            <button
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-2 text-xs font-medium text-white"
              key={tag.id}
              onClick={() => toggleTag(tag.id)}
              type="button"
            >
              <span>#{tag.label}</span>
              <X className="h-3 w-3" />
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <input
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-300 focus:bg-white"
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => void handleKeyDown(event)}
          placeholder={t("tags.field.placeholder")}
          value={draft}
        />
        <Button onClick={() => void handleCreate()} type="button" variant="outline">
          {t("tags.field.add")}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {availableTags.length === 0 ? (
          <span className="text-sm text-slate-500">{t("tags.field.emptyAvailable")}</span>
        ) : null}

        {availableTags.map((tag) => {
          const selected = value.includes(tag.id);

          return (
            <button
              className={cn(
                "rounded-full border px-3 py-2 text-xs font-medium transition",
                selected
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
              )}
              key={tag.id}
              onClick={() => toggleTag(tag.id)}
              type="button"
            >
              #{tag.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
