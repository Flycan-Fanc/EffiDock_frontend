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

import { getModuleRegistry } from "@/core/modules/registry/module-registry";
import type { ModuleNavItem } from "@/core/types/module";
import { useModuleStore } from "@/stores/use-module-store";
import { cn } from "@/shared/lib/utils";

const fixedNavItems = [
  {
    to: "/dashboard",
    label: "Dashboard",
    description: "工作台首页概览",
    icon: LayoutDashboard,
  },
  {
    to: "/modules",
    label: "模块商店",
    description: "安装与启用入口",
    icon: Box,
  },
  {
    to: "/settings",
    label: "Settings",
    description: "偏好与配置占位",
    icon: Settings,
  },
];

const moduleIcons: Record<ModuleNavItem["icon"], typeof CheckSquare> = {
  "check-square": CheckSquare,
  "book-open": BookOpen,
  lightbulb: Lightbulb,
  sparkles: Sparkles,
};

export function ShellSidebar() {
  const enabledModules = useModuleStore((state) => state.enabledModules);
  const enabledModuleNavItems = getModuleRegistry()
    .filter((moduleManifest) => enabledModules.includes(moduleManifest.id))
    .map((moduleManifest) => moduleManifest.nav);

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="rounded-[24px] bg-slate-950 px-4 py-5 text-slate-50">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-sm font-semibold">
            ED
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide">EffiDock</p>
            <p className="text-xs text-slate-300">Personal Productivity Dock</p>
          </div>
        </div>
        <p className="text-sm leading-6 text-slate-300">
          Batch 2 已接入模块清单、状态管理和基础路由守卫，侧边栏会根据启用状态动态显示模块入口。
        </p>
      </div>

      <nav className="space-y-2">
        {fixedNavItems.map(({ to, label, description, icon: Icon }) => (
          <NavItem key={to} to={to} label={label} description={description} icon={<Icon className="h-4 w-4" />} />
        ))}
      </nav>

      <div className="space-y-2">
        <p className="px-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Enabled Modules
        </p>
        <div className="space-y-2">
          {enabledModuleNavItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 px-3 py-4 text-sm text-slate-500">
              当前没有启用中的模块，请前往模块商店开启。
            </div>
          ) : (
            enabledModuleNavItems.map((navItem) => {
              const Icon = moduleIcons[navItem.icon];

              return (
                <NavItem
                  key={navItem.to}
                  to={navItem.to}
                  label={navItem.label}
                  description="模块入口"
                  icon={<Icon className="h-4 w-4" />}
                />
              );
            })
          )}
        </div>
      </div>

      <div className="mt-auto rounded-[24px] border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Current Scope
        </p>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li>模块 manifest 与 registry</li>
          <li>模块 install / enable / disable / uninstall</li>
          <li>根据启用状态动态渲染导航</li>
        </ul>
      </div>
    </div>
  );
}

type NavItemProps = {
  to: string;
  label: string;
  description: string;
  icon: React.ReactNode;
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
