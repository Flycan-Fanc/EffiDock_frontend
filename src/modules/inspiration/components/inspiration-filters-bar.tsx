import { useI18n } from "@/core/i18n/use-i18n";
import { getFavoriteFilterLabel, getInspirationSortLabel } from "@/modules/inspiration/lib/inspiration-utils";
import type { TagItem } from "@/features/tags/types/tag";
import type {
  InspirationFavoriteFilter,
  InspirationFilters,
  InspirationSortMode,
} from "@/modules/inspiration/types/inspiration";

type InspirationFiltersBarProps = {
  filters: InspirationFilters;
  availableTags: TagItem[];
  onChange: (patch: Partial<InspirationFilters>) => void;
  onReset: () => void;
};

const favoriteOptions: InspirationFavoriteFilter[] = ["all", "favorites", "others"];
const sortOptions: InspirationSortMode[] = ["favorite-desc", "updated-desc", "created-desc"];

export function InspirationFiltersBar({
  filters,
  availableTags,
  onChange,
  onReset,
}: InspirationFiltersBarProps) {
  const { t } = useI18n();

  return (
    <article className="rounded-[28px] border border-slate-200 bg-white p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {t("inspiration.filters.badge")}
          </p>
          <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">
            {t("inspiration.filters.title")}
          </h3>
        </div>
        <button
          className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
          onClick={onReset}
          type="button"
        >
          {t("inspiration.filters.reset")}
        </button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">{t("inspiration.filters.search")}</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-300 focus:bg-white"
            onChange={(event) => onChange({ query: event.target.value })}
            placeholder={t("inspiration.filters.searchPlaceholder")}
            value={filters.query}
          />
        </label>

        <SelectField
          label={t("inspiration.filters.favorite")}
          onChange={(value) => onChange({ favorite: value as InspirationFavoriteFilter })}
          options={favoriteOptions.map((option) => ({
            label: getFavoriteFilterLabel(option, t),
            value: option,
          }))}
          value={filters.favorite}
        />

        <SelectField
          label={t("tags.filter.label")}
          onChange={(value) => onChange({ tagId: value })}
          options={[
            { label: t("tags.filter.all"), value: "all" },
            ...availableTags.map((tag) => ({ label: `#${tag.label}`, value: tag.id })),
          ]}
          value={filters.tagId}
        />

        <SelectField
          label={t("inspiration.filters.sort")}
          onChange={(value) => onChange({ sort: value as InspirationSortMode })}
          options={sortOptions.map((option) => ({
            label: getInspirationSortLabel(option, t),
            value: option,
          }))}
          value={filters.sort}
        />
      </div>
    </article>
  );
}

type SelectFieldProps = {
  label: string;
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
};

function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-300 focus:bg-white"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
