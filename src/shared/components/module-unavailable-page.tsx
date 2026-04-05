import { Link } from "react-router-dom";

import { useI18n } from "@/core/i18n/use-i18n";
import { getModuleCopy } from "@/core/modules/copy/module-copy";
import type { ModuleId } from "@/core/types/module";
import { Button } from "@/shared/components/ui/button";

type ModuleUnavailablePageProps = {
  moduleId: ModuleId;
};

export function ModuleUnavailablePage({ moduleId }: ModuleUnavailablePageProps) {
  const { t } = useI18n();
  const moduleCopy = getModuleCopy(moduleId, t);

  return (
    <section className="rounded-[28px] border border-slate-200 bg-slate-50 p-8">
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {t("moduleUnavailable.badge")}
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          {t("moduleUnavailable.title", { name: moduleCopy.name })}
        </h2>
        <p className="max-w-2xl text-sm leading-7 text-slate-500">
          {t("moduleUnavailable.description")}
        </p>
        <Button asChild>
          <Link to="/modules">{t("moduleUnavailable.action")}</Link>
        </Button>
      </div>
    </section>
  );
}
