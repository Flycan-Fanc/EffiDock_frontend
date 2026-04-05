import { useI18n } from "@/core/i18n/use-i18n";
import type { TagItem } from "@/features/tags/types/tag";

type TagFiltersFieldProps = {
  value: string;
  availableTags: TagItem[];
  onChange: (tagId: string) => void;
};

export function TagFiltersField({ value, availableTags, onChange }: TagFiltersFieldProps) {
  const { t } = useI18n();

  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{t("tags.filter.label")}</span>
      <select
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-300 focus:bg-white"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        <option value="all">{t("tags.filter.all")}</option>
        {availableTags.map((tag) => (
          <option key={tag.id} value={tag.id}>
            #{tag.label}
          </option>
        ))}
      </select>
    </label>
  );
}
