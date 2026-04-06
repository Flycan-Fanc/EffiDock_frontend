import { useMemo, useState } from "react";
import { BookOpen, CheckSquare, Lightbulb, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import { useI18n } from "@/core/i18n/use-i18n";
import { getModuleCopy } from "@/core/modules/copy/module-copy";
import { getModuleRegistry } from "@/core/modules/registry/module-registry";
import type { ModuleManifest, ModuleNavItem } from "@/core/types/module";
import { useModuleStore } from "@/stores/use-module-store";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

type ModuleFilter = "all" | "installed" | "not-installed";

const moduleIcons: Record<ModuleNavItem["icon"], typeof CheckSquare> = {
  "check-square": CheckSquare,
  "book-open": BookOpen,
  lightbulb: Lightbulb,
  sparkles: Sparkles,
};

export function ModuleStorePage() {
  const { t } = useI18n();
  const [activeFilter, setActiveFilter] = useState<ModuleFilter>("all");
  const installedModules = useModuleStore((state) => state.installedModules);
  const enabledModules = useModuleStore((state) => state.enabledModules);
  const installModule = useModuleStore((state) => state.installModule);
  const enableModule = useModuleStore((state) => state.enableModule);
  const disableModule = useModuleStore((state) => state.disableModule);
  const uninstallModule = useModuleStore((state) => state.uninstallModule);

  const moduleCards = useMemo(
    () =>
      getModuleRegistry().map((moduleManifest) => {
        const isInstalled = installedModules.includes(moduleManifest.id);
        const isEnabled = enabledModules.includes(moduleManifest.id);

        return {
          manifest: moduleManifest,
          copy: getModuleCopy(moduleManifest.id, t),
          isInstalled,
          isEnabled,
        };
      }),
    [enabledModules, installedModules, t],
  );

  const filteredModules = moduleCards.filter(({ isInstalled }) => {
    if (activeFilter === "installed") {
      return isInstalled;
    }

    if (activeFilter === "not-installed") {
      return !isInstalled;
    }

    return true;
  });

  const summary = {
    total: moduleCards.length,
    installed: moduleCards.filter((item) => item.isInstalled).length,
    enabled: moduleCards.filter((item) => item.isEnabled).length,
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
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

        <div className="grid grid-cols-3 gap-3 lg:min-w-[360px]">
          <SummaryCard label={t("moduleStore.summary.total")} value={summary.total} />
          <SummaryCard label={t("moduleStore.summary.installed")} value={summary.installed} />
          <SummaryCard label={t("moduleStore.summary.enabled")} value={summary.enabled} />
        </div>
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-900">{t("moduleStore.filter.title")}</p>
            <p className="text-sm text-slate-500">{t("moduleStore.filter.description")}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <FilterButton
              label={t("moduleStore.filter.all")}
              isActive={activeFilter === "all"}
              onClick={() => setActiveFilter("all")}
            />
            <FilterButton
              label={t("moduleStore.filter.installed")}
              isActive={activeFilter === "installed"}
              onClick={() => setActiveFilter("installed")}
            />
            <FilterButton
              label={t("moduleStore.filter.notInstalled")}
              isActive={activeFilter === "not-installed"}
              onClick={() => setActiveFilter("not-installed")}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {filteredModules.map(({ manifest, copy, isInstalled, isEnabled }) => (
          <ModuleCard
            key={manifest.id}
            manifest={manifest}
            name={copy.name}
            description={copy.description}
            isInstalled={isInstalled}
            isEnabled={isEnabled}
            onInstall={() => installModule(manifest.id)}
            onEnable={() => enableModule(manifest.id)}
            onDisable={() => disableModule(manifest.id)}
            onUninstall={() => uninstallModule(manifest.id)}
          />
        ))}
      </div>

      {filteredModules.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-slate-200 bg-white px-6 py-10 text-center">
          <p className="text-base font-semibold text-slate-900">{t("moduleStore.empty.title")}</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">{t("moduleStore.empty.description")}</p>
        </div>
      ) : null}
    </section>
  );
}

type ModuleCardProps = {
  manifest: ModuleManifest;
  name: string;
  description: string;
  isInstalled: boolean;
  isEnabled: boolean;
  onInstall: () => void;
  onEnable: () => void;
  onDisable: () => void;
  onUninstall: () => void;
};

function ModuleCard({
  manifest,
  name,
  description,
  isInstalled,
  isEnabled,
  onInstall,
  onEnable,
  onDisable,
  onUninstall,
}: ModuleCardProps) {
  const { t } = useI18n();
  const Icon = moduleIcons[manifest.nav.icon];

  return (
    <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white">
      <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm ring-1 ring-slate-200">
              <Icon className="h-5 w-5" />
            </span>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-lg font-semibold text-slate-950">{name}</p>
                <StatusBadge isInstalled={isInstalled} isEnabled={isEnabled} />
              </div>
              <p className="text-sm leading-6 text-slate-500">{description}</p>
            </div>
          </div>

          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
            {getCategoryLabel(manifest.category, t)}
          </span>
        </div>
      </div>

      <div className="space-y-5 px-5 py-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <InfoPill label={t("moduleStore.meta.version")} value={manifest.version} />
          <InfoPill label={t("moduleStore.meta.route")} value={manifest.nav.to} />
          <InfoPill
            label={t("moduleStore.meta.default")}
            value={
              manifest.enabledByDefault
                ? t("moduleStore.meta.defaultEnabled")
                : t("moduleStore.meta.defaultManual")
            }
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
          <p className="text-sm font-semibold text-slate-900">{t("moduleStore.intro.title")}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
          {isInstalled ? (
            <p className="mt-3 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
              {isEnabled
                ? t("moduleStore.intro.enabledHint")
                : t("moduleStore.intro.installedHint")}
            </p>
          ) : (
            <p className="mt-3 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
              {t("moduleStore.intro.installHint")}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!isInstalled ? (
            <Button onClick={onInstall}>{t("moduleStore.action.install")}</Button>
          ) : null}

          {isInstalled && !isEnabled ? (
            <Button onClick={onEnable}>{t("moduleStore.action.enable")}</Button>
          ) : null}

          {isInstalled && isEnabled ? (
            <>
              <Button asChild variant="outline">
                <Link to={manifest.nav.to}>{t("moduleStore.action.open")}</Link>
              </Button>
              <Button variant="secondary" onClick={onDisable}>
                {t("moduleStore.action.disable")}
              </Button>
            </>
          ) : null}

          {isInstalled ? (
            <Button variant="outline" onClick={onUninstall}>
              {t("moduleStore.action.uninstall")}
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function StatusBadge({
  isInstalled,
  isEnabled,
}: {
  isInstalled: boolean;
  isEnabled: boolean;
}) {
  const { t } = useI18n();

  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-xs font-medium",
        !isInstalled && "bg-slate-100 text-slate-600",
        isInstalled && !isEnabled && "bg-amber-100 text-amber-700",
        isInstalled && isEnabled && "bg-emerald-100 text-emerald-700",
      )}
    >
      {getModuleStatusLabel(isInstalled, isEnabled, t)}
    </span>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-white px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function FilterButton({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        isActive
          ? "border-slate-950 bg-slate-950 text-white"
          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
      )}
    >
      {label}
    </button>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-medium text-slate-900">{value}</p>
    </div>
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

function getCategoryLabel(category: ModuleManifest["category"], t: (key: string) => string) {
  return category === "ai"
    ? t("moduleStore.category.ai")
    : t("moduleStore.category.productivity");
}
