import { useI18n } from "@/core/i18n/use-i18n";

export function AiPlannerPage() {
  const { t } = useI18n();

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-8">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {t("placeholder.ai.badge")}
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          {t("placeholder.ai.title")}
        </h2>
        <p className="max-w-2xl text-sm leading-7 text-slate-500">
          {t("placeholder.ai.description")}
        </p>
      </div>
    </section>
  );
}
