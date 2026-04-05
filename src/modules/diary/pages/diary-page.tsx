import { useI18n } from "@/core/i18n/use-i18n";

export function DiaryPage() {
  const { t } = useI18n();

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-8">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {t("placeholder.diary.badge")}
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          {t("placeholder.diary.title")}
        </h2>
        <p className="max-w-2xl text-sm leading-7 text-slate-500">
          {t("placeholder.diary.description")}
        </p>
      </div>
    </section>
  );
}
