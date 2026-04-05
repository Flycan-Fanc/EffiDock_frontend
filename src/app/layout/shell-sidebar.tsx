import type { ReactNode } from "react";
import {
  BookOpen,
  Box,
  CheckSquare,
  LayoutDashboard,
  Lightbulb,
  Settings,
  Sparkles,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import { useI18n } from "@/core/i18n/use-i18n";
import { getModuleCopy } from "@/core/modules/copy/module-copy";
import { getModuleRegistry } from "@/core/modules/registry/module-registry";
import type { ModuleNavItem } from "@/core/types/module";
import { useModuleStore } from "@/stores/use-module-store";
import { cn } from "@/shared/lib/utils";

const moduleIcons: Record<ModuleNavItem["icon"], typeof CheckSquare> = {
  "check-square": CheckSquare,
  "book-open": BookOpen,
  lightbulb: Lightbulb,
  sparkles: Sparkles,
};

export function ShellSidebar() {
  const { t } = useI18n();
  const enabledModules = useModuleStore((state) => state.enabledModules);

  const fixedNavItems = [
    {
      to: "/dashboard",
      label: t("sidebar.fixed.dashboard"),
      description: t("sidebar.fixed.dashboardDescription"),
      icon: LayoutDashboard,
    },
    {
      to: "/modules",
      label: t("sidebar.fixed.modules"),
      description: t("sidebar.fixed.modulesDescription"),
      icon: Box,
    },
    {
      to: "/settings",
      label: t("sidebar.fixed.settings"),
      description: t("sidebar.fixed.settingsDescription"),
      icon: Settings,
    },
  ];

  const enabledModuleNavItems = getModuleRegistry()
    .filter((moduleManifest) => enabledModules.includes(moduleManifest.id))
    .map((moduleManifest) => ({
      ...moduleManifest.nav,
      label: getModuleCopy(moduleManifest.id, t).name,
    }));

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="rounded-[24px] bg-slate-950 px-4 py-5 text-slate-50">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-sm font-semibold">
            ED
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide">EffiDock</p>
            <p className="text-xs text-slate-300">{t("sidebar.brandTagline")}</p>
          </div>
        </div>
        <p className="text-sm leading-6 text-slate-300">{t("sidebar.summary")}</p>
      </div>

      <nav className="space-y-2">
        {fixedNavItems.map(({ to, label, description, icon: Icon }) => (
          <NavItem
            key={to}
            to={to}
            label={label}
            description={description}
            icon={<Icon className="h-4 w-4" />}
          />
        ))}
      </nav>

      <div className="space-y-2">
        <p className="px-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {t("sidebar.enabledModules")}
        </p>
        <div className="space-y-2">
          {enabledModuleNavItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 px-3 py-4 text-sm text-slate-500">
              {t("sidebar.noModules")}
            </div>
          ) : (
            enabledModuleNavItems.map((navItem) => {
              const Icon = moduleIcons[navItem.icon];

              return (
                <NavItem
                  key={navItem.to}
                  to={navItem.to}
                  label={navItem.label}
                  description={t("sidebar.moduleEntry")}
                  icon={<Icon className="h-4 w-4" />}
                />
              );
            })
          )}
        </div>
      </div>

      <div className="mt-auto rounded-[24px] border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {t("sidebar.currentScope")}
        </p>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li>{t("sidebar.scope.manifest")}</li>
          <li>{t("sidebar.scope.lifecycle")}</li>
          <li>{t("sidebar.scope.navigation")}</li>
        </ul>
      </div>
    </div>
  );
}

type NavItemProps = {
  to: string;
  label: string;
  description: string;
  icon: ReactNode;
};

function NavItem({ to, label, description, icon }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-start gap-3 rounded-2xl border border-transparent px-3 py-3 transition-all",
          "hover:border-slate-200 hover:bg-slate-50",
          isActive && "border-slate-200 bg-slate-100",
        )
      }
    >
      <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
        {icon}
      </span>
      <span className="space-y-1">
        <span className="block text-sm font-medium text-slate-900">{label}</span>
        <span className="block text-xs leading-5 text-slate-500">{description}</span>
      </span>
    </NavLink>
  );
}
