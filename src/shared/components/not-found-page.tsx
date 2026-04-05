import { Link } from "react-router-dom";

import { useI18n } from "@/core/i18n/use-i18n";
import { Button } from "@/shared/components/ui/button";

export function NotFoundPage() {
  const { t } = useI18n();

  return (
    <section className="rounded-[28px] border border-slate-200 bg-slate-50 p-8">
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {t("notFound.badge")}
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{t("notFound.title")}</h2>
        <p className="max-w-2xl text-sm leading-7 text-slate-500">
          {t("notFound.description")}
        </p>
        <div className="flex gap-3">
          <Button asChild>
            <Link to="/dashboard">{t("notFound.dashboardAction")}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/modules">{t("notFound.modulesAction")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
