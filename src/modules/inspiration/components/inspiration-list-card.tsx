import { Heart, PencilLine, Trash2 } from "lucide-react";

import { useI18n } from "@/core/i18n/use-i18n";
import { TagBadgeList } from "@/features/tags/components/tag-badge-list";
import { formatInspirationTimestamp } from "@/modules/inspiration/lib/inspiration-utils";
import type { InspirationItem } from "@/modules/inspiration/types/inspiration";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

type InspirationListCardProps = {
  items: InspirationItem[];
  totalCount: number;
  favoriteCount: number;
  resolveTagLabel: (tagId: string) => string | undefined;
  onToggleFavorite: (itemId: string) => void;
  onEdit: (item: InspirationItem) => void;
  onDelete: (itemId: string) => void;
};

export function InspirationListCard({
  items,
  totalCount,
  favoriteCount,
  resolveTagLabel,
  onToggleFavorite,
  onEdit,
  onDelete,
}: InspirationListCardProps) {
  const { locale, t } = useI18n();

  return (
    <article className="rounded-[28px] border border-slate-200 bg-white p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {t("inspiration.list.badge")}
          </p>
          <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">
            {items.length > 0
              ? t("inspiration.list.visible", { count: items.length })
              : t("inspiration.list.emptyTitle")}
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            {t("inspiration.list.summary", { total: totalCount, favorites: favoriteCount })}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {items.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
            <p className="text-base font-medium text-slate-900">{t("inspiration.list.emptyMessage")}</p>
            <p className="mt-2 text-sm leading-7 text-slate-500">{t("inspiration.list.emptyHint")}</p>
          </div>
        ) : null}

        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "rounded-[24px] border px-5 py-4 transition",
              item.isFavorite ? "border-amber-200 bg-amber-50/40" : "border-slate-200 bg-white",
            )}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-base font-medium text-slate-950">{item.title}</p>
                  {item.isFavorite ? (
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                      {t("inspiration.list.favoriteBadge")}
                    </span>
                  ) : null}
                </div>

                {item.content ? (
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">{item.content}</p>
                ) : (
                  <p className="mt-3 text-sm italic text-slate-400">{t("inspiration.list.emptyContent")}</p>
                )}

                <div className="mt-3">
                  <TagBadgeList resolveTagLabel={resolveTagLabel} tagIds={item.tagIds} />
                </div>

                <p className="mt-4 text-sm text-slate-500">
                  {t("inspiration.list.updated", {
                    value: formatInspirationTimestamp(item.updatedAt, locale),
                  })}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button onClick={() => onToggleFavorite(item.id)} type="button" variant="outline">
                  <Heart className={cn("mr-2 h-4 w-4", item.isFavorite && "fill-current")} />
                  {item.isFavorite ? t("inspiration.list.unfavorite") : t("inspiration.list.favorite")}
                </Button>
                <Button onClick={() => onEdit(item)} type="button" variant="outline">
                  <PencilLine className="mr-2 h-4 w-4" />
                  {t("inspiration.list.edit")}
                </Button>
                <Button onClick={() => onDelete(item.id)} type="button" variant="secondary">
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t("inspiration.list.delete")}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
