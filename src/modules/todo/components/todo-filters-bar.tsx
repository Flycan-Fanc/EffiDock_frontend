import { useI18n } from "@/core/i18n/use-i18n";
import {
  getDueFilterLabel,
  getPriorityFilterLabel,
  getSortLabel,
  getStatusLabel,
} from "@/modules/todo/lib/todo-utils";
import type {
  TodoDueFilter,
  TodoFilters,
  TodoPriorityFilter,
  TodoSortMode,
  TodoStatusFilter,
} from "@/modules/todo/types/todo";

type TodoFiltersBarProps = {
  filters: TodoFilters;
  onChange: (patch: Partial<TodoFilters>) => void;
  onReset: () => void;
};

const statusOptions: TodoStatusFilter[] = ["all", "active", "completed"];
const priorityOptions: TodoPriorityFilter[] = ["all", "high", "medium", "low"];
const dueOptions: TodoDueFilter[] = ["all", "today", "upcoming", "overdue", "none"];
const sortOptions: TodoSortMode[] = ["created-desc", "due-asc", "priority-desc"];

export function TodoFiltersBar({ filters, onChange, onReset }: TodoFiltersBarProps) {
  const { t } = useI18n();

  return (
    <article className="rounded-[28px] border border-slate-200 bg-white p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {t("todo.filters.badge")}
          </p>
          <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">
            {t("todo.filters.title")}
          </h3>
        </div>
        <button
          className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
          onClick={onReset}
          type="button"
        >
          {t("todo.filters.reset")}
        </button>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.2fr_1fr_1fr_1fr_1fr]">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">{t("todo.filters.search")}</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-300 focus:bg-white"
            onChange={(event) => onChange({ query: event.target.value })}
            placeholder={t("todo.filters.searchPlaceholder")}
            value={filters.query}
          />
        </label>

        <SelectField
          label={t("todo.filters.status")}
          onChange={(value) => onChange({ status: value as TodoStatusFilter })}
          options={statusOptions.map((option) => ({
            label: getStatusLabel(option, t),
            value: option,
          }))}
          value={filters.status}
        />

        <SelectField
          label={t("todo.filters.priority")}
          onChange={(value) => onChange({ priority: value as TodoPriorityFilter })}
          options={priorityOptions.map((option) => ({
            label: getPriorityFilterLabel(option, t),
            value: option,
          }))}
          value={filters.priority}
        />

        <SelectField
          label={t("todo.filters.due")}
          onChange={(value) => onChange({ due: value as TodoDueFilter })}
          options={dueOptions.map((option) => ({
            label: getDueFilterLabel(option, t),
            value: option,
          }))}
          value={filters.due}
        />

        <SelectField
          label={t("todo.filters.sort")}
          onChange={(value) => onChange({ sort: value as TodoSortMode })}
          options={sortOptions.map((option) => ({
            label: getSortLabel(option, t),
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
