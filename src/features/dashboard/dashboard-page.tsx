import { useI18n } from "@/core/i18n/use-i18n";

export function DashboardPage() {
  const { t } = useI18n();

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
        </article>
        <article className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {t("dashboard.focusBadge")}
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            <li>{t("dashboard.focus.shell")}</li>
            <li>{t("dashboard.focus.navigation")}</li>
            <li>{t("dashboard.focus.boundary")}</li>
          </ul>
        </article>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[24px] border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-900">{t("dashboard.card.todayTasks")}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">--</p>
          <p className="mt-2 text-sm text-slate-500">{t("dashboard.card.todayTasksHint")}</p>
        </article>
        <article className="rounded-[24px] border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-900">{t("dashboard.card.recentDiary")}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">--</p>
          <p className="mt-2 text-sm text-slate-500">{t("dashboard.card.recentDiaryHint")}</p>
        </article>
        <article className="rounded-[24px] border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-900">{t("dashboard.card.recentInspiration")}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">--</p>
          <p className="mt-2 text-sm text-slate-500">{t("dashboard.card.recentInspirationHint")}</p>
        </article>
      </div>
    </section>
  );
}
