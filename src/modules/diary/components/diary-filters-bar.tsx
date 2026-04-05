import { useI18n } from "@/core/i18n/use-i18n";
import { TagFiltersField } from "@/features/tags/components/tag-filters-field";
import type { TagItem } from "@/features/tags/types/tag";
import type { DiaryFilters, DiarySortMode } from "@/modules/diary/types/diary";

type DiaryFiltersBarProps = {
  filters: DiaryFilters;
  availableTags: TagItem[];
  onChange: (patch: Partial<DiaryFilters>) => void;
  onReset: () => void;
};

const sortOptions: DiarySortMode[] = ["entry-desc", "entry-asc", "updated-desc"];

export function DiaryFiltersBar({ filters, availableTags, onChange, onReset }: DiaryFiltersBarProps) {
  const { t } = useI18n();

  return (
    <article className="rounded-[28px] border border-slate-200 bg-white p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {t("diary.filters.badge")}
          </p>
          <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">
            {t("diary.filters.title")}
          </h3>
        </div>
        <button
          className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
          onClick={onReset}
          type="button"
        >
          {t("diary.filters.reset")}
        </button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-[1.4fr_1fr_1fr]">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">{t("diary.filters.search")}</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-300 focus:bg-white"
            onChange={(event) => onChange({ query: event.target.value })}
            placeholder={t("diary.filters.searchPlaceholder")}
            value={filters.query}
          />
        </label>

        <TagFiltersField
          availableTags={availableTags}
          onChange={(tagId) => onChange({ tagId })}
          value={filters.tagId}
        />

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">{t("diary.filters.sort")}</span>
          <select
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-300 focus:bg-white"
            onChange={(event) => onChange({ sort: event.target.value as DiarySortMode })}
            value={filters.sort}
          >
            {sortOptions.map((option) => (
              <option key={option} value={option}>
                {t(`diary.sort.${option}`)}
              </option>
            ))}
          </select>
        </label>
      </div>
    </article>
  );
}
