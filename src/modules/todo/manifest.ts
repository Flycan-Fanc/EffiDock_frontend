import type { ModuleManifest } from "@/core/types/module";

export const todoManifest: ModuleManifest = {
  id: "todo",
  name: "Todo",
  description: "任务记录、筛选与执行追踪模块。",
  version: "0.1.0",
  category: "productivity",
  enabledByDefault: true,
  nav: {
    label: "Todo",
    to: "/todo",
    icon: "check-square",
  },
  routes: [
    {
      path: "/todo",
      title: "Todo",
    },
  ],
};
