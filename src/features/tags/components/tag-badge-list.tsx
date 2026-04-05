import { useI18n } from "@/core/i18n/use-i18n";

type TagBadgeListProps = {
  tagIds: string[];
  resolveTagLabel: (tagId: string) => string | undefined;
};

export function TagBadgeList({ tagIds, resolveTagLabel }: TagBadgeListProps) {
  const { t } = useI18n();
  const labels = tagIds.map((tagId) => resolveTagLabel(tagId)).filter(Boolean) as string[];

  if (labels.length === 0) {
    return (
      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
        {t("tags.common.none")}
      </span>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {labels.map((label) => (
        <span
          key={label}
          className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
        >
          #{label}
        </span>
      ))}
    </div>
  );
}
