import { useEffect, useMemo } from "react";
import { ArrowRight, BookOpen, CheckSquare, Lightbulb, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import { useI18n } from "@/core/i18n/use-i18n";
import { getModuleCopy } from "@/core/modules/copy/module-copy";
import { getModuleRegistry } from "@/core/modules/registry/module-registry";
import type { ModuleNavItem } from "@/core/types/module";
import {
  createExcerpt,
  getDashboardTodoStats,
  getRecentDiaryEntry,
  getRecentInspirationItem,
} from "@/features/dashboard/lib/dashboard-utils";
import { formatDiaryEntryDate, formatDiaryUpdatedAt } from "@/modules/diary/lib/diary-utils";
import { useDiaryStore } from "@/modules/diary/stores/use-diary-store";
import { formatInspirationTimestamp } from "@/modules/inspiration/lib/inspiration-utils";
import { useInspirationStore } from "@/modules/inspiration/stores/use-inspiration-store";
import { formatTodayLabel } from "@/modules/todo/lib/todo-utils";
import { useTodoStore } from "@/modules/todo/stores/use-todo-store";
import { useModuleStore } from "@/stores/use-module-store";
import { Button } from "@/shared/components/ui/button";

const moduleIcons: Record<ModuleNavItem["icon"], typeof CheckSquare> = {
  "check-square": CheckSquare,
  "book-open": BookOpen,
  lightbulb: Lightbulb,
  sparkles: Sparkles,
};

export function DashboardPage() {
  const { locale, t } = useI18n();
  const enabledModules = useModuleStore((state) => state.enabledModules);

  const todoItems = useTodoStore((state) => state.items);
  const todoHydrated = useTodoStore((state) => state.hydrated);
  const todoLoading = useTodoStore((state) => state.loading);
  const hydrateTodos = useTodoStore((state) => state.hydrate);

  const diaryItems = useDiaryStore((state) => state.items);
  const diaryHydrated = useDiaryStore((state) => state.hydrated);
  const diaryLoading = useDiaryStore((state) => state.loading);
  const hydrateDiary = useDiaryStore((state) => state.hydrate);

  const inspirationItems = useInspirationStore((state) => state.items);
  const inspirationHydrated = useInspirationStore((state) => state.hydrated);
  const inspirationLoading = useInspirationStore((state) => state.loading);
  const hydrateInspirations = useInspirationStore((state) => state.hydrate);

  useEffect(() => {
    if (!todoHydrated && !todoLoading) {
      void hydrateTodos();
    }

    if (!diaryHydrated && !diaryLoading) {
      void hydrateDiary();
    }

    if (!inspirationHydrated && !inspirationLoading) {
      void hydrateInspirations();
    }
  }, [
    diaryHydrated,
    diaryLoading,
    hydrateDiary,
    hydrateInspirations,
    hydrateTodos,
    inspirationHydrated,
    inspirationLoading,
    todoHydrated,
    todoLoading,
  ]);

  const todoStats = useMemo(() => getDashboardTodoStats(todoItems), [todoItems]);
  const recentDiaryEntry = useMemo(() => getRecentDiaryEntry(diaryItems), [diaryItems]);
  const recentInspiration = useMemo(
    () => getRecentInspirationItem(inspirationItems),
    [inspirationItems],
  );
  const enabledModuleManifests = useMemo(
    () => getModuleRegistry().filter((moduleManifest) => enabledModules.includes(moduleManifest.id)),
    [enabledModules],
  );

  return (
    <section className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <article className="rounded-[28px] bg-slate-950 p-6 text-slate-50">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
            {t("dashboard.badge")}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">{t("dashboard.title")}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
            {t("dashboard.description")}
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard label={t("sidebar.enabledModules")} value={enabledModuleManifests.length} />
            <SummaryCard label={t("todo.status.active")} value={todoStats.open} />
            <SummaryCard label={t("module.diary.name")} value={diaryItems.length} />
            <SummaryCard label={t("module.inspiration.name")} value={inspirationItems.length} />
          </div>
        </article>
        <article className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {t("sidebar.enabledModules")}
          </p>
          <div className="mt-4 space-y-3">
            {enabledModuleManifests.length === 0 ? (
              <div className="rounded-[22px] border border-dashed border-slate-200 bg-white px-4 py-5 text-sm text-slate-500">
                {t("sidebar.noModules")}
              </div>
            ) : (
              enabledModuleManifests.map((moduleManifest) => {
                const Icon = moduleIcons[moduleManifest.nav.icon];
                const copy = getModuleCopy(moduleManifest.id, t);

                return (
                  <Link
                    key={moduleManifest.id}
                    to={moduleManifest.nav.to}
                    className="flex items-start gap-3 rounded-[22px] border border-slate-200 bg-white px-4 py-4 transition-colors hover:border-slate-300 hover:bg-slate-100"
                  >
                    <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-slate-900">{copy.name}</span>
                      <span className="mt-1 block text-xs leading-5 text-slate-500">
                        {copy.description}
                      </span>
                    </span>
                    <ArrowRight className="mt-1 h-4 w-4 text-slate-400" />
                  </Link>
                );
              })
            )}
          </div>
        </article>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[24px] border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-900">{t("dashboard.card.todayTasks")}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            {todoStats.dueTodayOpen}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {t("todo.list.today", { date: formatTodayLabel(locale) })}
          </p>
          <div className="mt-4 grid gap-2 text-sm text-slate-600">
            <MetricRow label={t("todo.status.completed")} value={todoStats.dueTodayCompleted} />
            <MetricRow label={t("todo.status.active")} value={todoStats.dueTodayOpen} />
            <MetricRow label={t("todo.due.overdue")} value={todoStats.overdueOpen} />
          </div>
          <p className="mt-2 text-sm text-slate-500">{t("dashboard.card.todayTasksHint")}</p>
          <Button asChild className="mt-5 w-full justify-between">
            <Link to="/todo">
              <span>{t("module.todo.name")}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </article>
        <article className="rounded-[24px] border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-900">{t("dashboard.card.recentDiary")}</p>
          <p className="mt-3 line-clamp-2 text-2xl font-semibold tracking-tight text-slate-950">
            {recentDiaryEntry?.title ?? "--"}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {recentDiaryEntry
              ? formatDiaryEntryDate(recentDiaryEntry.entryDate, locale)
              : "--"}
          </p>
          {recentDiaryEntry ? (
            <>
              <p className="mt-4 line-clamp-4 text-sm leading-6 text-slate-600">
                {createExcerpt(recentDiaryEntry.content, 140)}
              </p>
              <p className="mt-3 text-xs text-slate-500">
                {t("diary.list.updated", {
                  value: formatDiaryUpdatedAt(recentDiaryEntry.updatedAt, locale),
                })}
              </p>
            </>
          ) : null}
          <p className="mt-2 text-sm text-slate-500">{t("dashboard.card.recentDiaryHint")}</p>
          <Button asChild className="mt-5 w-full justify-between">
            <Link to="/diary">
              <span>{t("module.diary.name")}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </article>
        <article className="rounded-[24px] border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-900">{t("dashboard.card.recentInspiration")}</p>
          <div className="mt-3 flex items-start justify-between gap-3">
            <p className="line-clamp-2 text-2xl font-semibold tracking-tight text-slate-950">
              {recentInspiration?.title ?? "--"}
            </p>
            {recentInspiration?.isFavorite ? (
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                {t("inspiration.list.favoriteBadge")}
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-sm text-slate-500">
            {recentInspiration
              ? formatInspirationTimestamp(recentInspiration.updatedAt, locale)
              : "--"}
          </p>
          {recentInspiration ? (
            <p className="mt-4 line-clamp-4 text-sm leading-6 text-slate-600">
              {createExcerpt(recentInspiration.content, 140) || t("inspiration.list.emptyContent")}
            </p>
          ) : null}
          <p className="mt-2 text-sm text-slate-500">{t("dashboard.card.recentInspirationHint")}</p>
          <Button asChild className="mt-5 w-full justify-between">
            <Link to="/inspiration">
              <span>{t("module.inspiration.name")}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </article>
      </div>
    </section>
  );
}

type SummaryCardProps = {
  label: string;
  value: number;
};

function SummaryCard({ label, value }: SummaryCardProps) {
  return (
    <div className="rounded-[22px] bg-white/5 px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</p>
    </div>
  );
}

type MetricRowProps = {
  label: string;
  value: number;
};

function MetricRow({ label, value }: MetricRowProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
      <span>{label}</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  );
}
