import { useI18n } from "@/core/i18n/use-i18n";
import { getModuleCopy } from "@/core/modules/copy/module-copy";
import { getModuleRegistry } from "@/core/modules/registry/module-registry";
import { useModuleStore } from "@/stores/use-module-store";
import { Button } from "@/shared/components/ui/button";

export function ModuleStorePage() {
  const { t } = useI18n();
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
          {t("moduleStore.badge")}
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          {t("moduleStore.title")}
        </h2>
        <p className="max-w-2xl text-sm leading-7 text-slate-500">
          {t("moduleStore.description")}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {getModuleRegistry().map((moduleManifest) => {
          const isInstalled = installedModules.includes(moduleManifest.id);
          const isEnabled = enabledModules.includes(moduleManifest.id);
          const moduleCopy = getModuleCopy(moduleManifest.id, t);

          return (
            <article
              key={moduleManifest.id}
              className="rounded-[24px] border border-slate-200 bg-white p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-slate-950">{moduleCopy.name}</p>
                  <p className="text-sm leading-6 text-slate-500">{moduleCopy.description}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {getModuleStatusLabel(isInstalled, isEnabled, t)}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {isInstalled ? (
                  <Button variant="outline" onClick={() => uninstallModule(moduleManifest.id)}>
                    {t("moduleStore.action.uninstall")}
                  </Button>
                ) : (
                  <Button onClick={() => installModule(moduleManifest.id)}>
                    {t("moduleStore.action.install")}
                  </Button>
                )}

                {isInstalled && !isEnabled ? (
                  <Button onClick={() => enableModule(moduleManifest.id)}>
                    {t("moduleStore.action.enable")}
                  </Button>
                ) : null}

                {isInstalled && isEnabled ? (
                  <Button variant="secondary" onClick={() => disableModule(moduleManifest.id)}>
                    {t("moduleStore.action.disable")}
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

function getModuleStatusLabel(
  isInstalled: boolean,
  isEnabled: boolean,
  t: (key: string) => string,
) {
  if (!isInstalled) {
    return t("moduleStore.status.notInstalled");
  }

  return isEnabled ? t("moduleStore.status.enabled") : t("moduleStore.status.installed");
}
