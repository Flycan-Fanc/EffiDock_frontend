import { PencilLine, Trash2 } from "lucide-react";

import { useI18n } from "@/core/i18n/use-i18n";
import { TagBadgeList } from "@/features/tags/components/tag-badge-list";
import {
  formatDiaryEntryDate,
  formatDiaryUpdatedAt,
} from "@/modules/diary/lib/diary-utils";
import type { DiaryEntry } from "@/modules/diary/types/diary";
import { Button } from "@/shared/components/ui/button";

type DiaryListCardProps = {
  items: DiaryEntry[];
  totalCount: number;
  resolveTagLabel: (tagId: string) => string | undefined;
  onEdit: (entry: DiaryEntry) => void;
  onDelete: (entryId: string) => void;
};

export function DiaryListCard({
  items,
  totalCount,
  resolveTagLabel,
  onEdit,
  onDelete,
}: DiaryListCardProps) {
  const { locale, t } = useI18n();

  return (
    <article className="rounded-[28px] border border-slate-200 bg-white p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {t("diary.list.badge")}
          </p>
          <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">
            {items.length > 0 ? t("diary.list.visible", { count: items.length }) : t("diary.list.emptyTitle")}
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            {t("diary.list.summary", { count: totalCount })}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {items.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
            <p className="text-base font-medium text-slate-900">{t("diary.list.emptyMessage")}</p>
            <p className="mt-2 text-sm leading-7 text-slate-500">{t("diary.list.emptyHint")}</p>
          </div>
        ) : null}

        {items.map((entry) => (
          <div key={entry.id} className="rounded-[24px] border border-slate-200 bg-white px-5 py-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-base font-medium text-slate-950">{entry.title}</p>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {formatDiaryEntryDate(entry.entryDate, locale)}
                  </span>
                </div>

                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                  {entry.content}
                </p>

                <div className="mt-3">
                  <TagBadgeList resolveTagLabel={resolveTagLabel} tagIds={entry.tagIds} />
                </div>

                <p className="mt-4 text-sm text-slate-500">
                  {t("diary.list.updated", { value: formatDiaryUpdatedAt(entry.updatedAt, locale) })}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={() => onEdit(entry)} type="button" variant="outline">
                  <PencilLine className="mr-2 h-4 w-4" />
                  {t("diary.list.edit")}
                </Button>
                <Button onClick={() => onDelete(entry.id)} type="button" variant="secondary">
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t("diary.list.delete")}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
