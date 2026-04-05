import { Box, LayoutDashboard, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

import { cn } from "@/shared/lib/utils";

const navItems = [
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

export function ShellSidebar() {
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
          Batch 1 仅实现平台壳子、统一布局和占位入口，不包含模块动态逻辑。
        </p>
      </div>

      <nav className="space-y-2">
        {navItems.map(({ to, label, description, icon: Icon }) => (
          <NavLink
            key={to}
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
              <Icon className="h-4 w-4" />
            </span>
            <span className="space-y-1">
              <span className="block text-sm font-medium text-slate-900">{label}</span>
              <span className="block text-xs leading-5 text-slate-500">{description}</span>
            </span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-[24px] border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Current Scope
        </p>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li>统一工作台框架</li>
          <li>左侧导航与主内容区</li>
          <li>Dashboard / 模块商店 / Settings 占位页</li>
        </ul>
      </div>
    </div>
  );
}
