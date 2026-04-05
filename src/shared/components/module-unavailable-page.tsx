import { Link } from "react-router-dom";

import type { ModuleId } from "@/core/types/module";
import { getModuleManifestById } from "@/core/modules/registry/module-registry";
import { Button } from "@/shared/components/ui/button";

type ModuleUnavailablePageProps = {
  moduleId: ModuleId;
};

export function ModuleUnavailablePage({ moduleId }: ModuleUnavailablePageProps) {
  const moduleManifest = getModuleManifestById(moduleId);

  return (
    <section className="rounded-[28px] border border-slate-200 bg-slate-50 p-8">
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Module Guard
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          {moduleManifest?.name ?? "Module"} 未启用
        </h2>
        <p className="max-w-2xl text-sm leading-7 text-slate-500">
          当前模块已安装但尚未启用。你可以前往模块商店启用它，然后再访问对应页面。
        </p>
        <Button asChild>
          <Link to="/modules">前往模块商店</Link>
        </Button>
      </div>
    </section>
  );
}
