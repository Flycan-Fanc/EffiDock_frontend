import { getModuleRegistry } from "@/core/modules/registry/module-registry";
import { useModuleStore } from "@/stores/use-module-store";
import { Button } from "@/shared/components/ui/button";

export function ModuleStorePage() {
  const installedModules = useModuleStore((state) => state.installedModules);
  const enabledModules = useModuleStore((state) => state.enabledModules);
  const installModule = useModuleStore((state) => state.installModule);
  const enableModule = useModuleStore((state) => state.enableModule);
  const disableModule = useModuleStore((state) => state.disableModule);
  const uninstallModule = useModuleStore((state) => state.uninstallModule);

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Module Store
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          模块系统基础设施
        </h2>
        <p className="max-w-2xl text-sm leading-7 text-slate-500">
          当前页面已接入 manifest、registry 与 module store。这里只提供基础状态切换，完整的模块商店交互将在 Batch 8 进一步完善。
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {getModuleRegistry().map((moduleManifest) => {
          const isInstalled = installedModules.includes(moduleManifest.id);
          const isEnabled = enabledModules.includes(moduleManifest.id);

          return (
            <article
              key={moduleManifest.id}
              className="rounded-[24px] border border-slate-200 bg-white p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-slate-950">{moduleManifest.name}</p>
                  <p className="text-sm leading-6 text-slate-500">{moduleManifest.description}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {getModuleStatusLabel(isInstalled, isEnabled)}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {isInstalled ? (
                  <Button variant="outline" onClick={() => uninstallModule(moduleManifest.id)}>
                    卸载
                  </Button>
                ) : (
                  <Button onClick={() => installModule(moduleManifest.id)}>安装</Button>
                )}

                {isInstalled && !isEnabled ? (
                  <Button onClick={() => enableModule(moduleManifest.id)}>启用</Button>
                ) : null}

                {isInstalled && isEnabled ? (
                  <Button variant="secondary" onClick={() => disableModule(moduleManifest.id)}>
                    停用
                  </Button>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function getModuleStatusLabel(isInstalled: boolean, isEnabled: boolean) {
  if (!isInstalled) {
    return "Not Installed";
  }

  return isEnabled ? "Enabled" : "Installed";
}
