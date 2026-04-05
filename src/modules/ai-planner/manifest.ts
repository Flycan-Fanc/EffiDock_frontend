import type { ModuleManifest } from "@/core/types/module";

export const aiPlannerManifest: ModuleManifest = {
  id: "ai-planner",
  name: "AI Planner",
  description: "目标分析与计划建议模块。",
  version: "0.1.0",
  category: "ai",
  enabledByDefault: false,
  nav: {
    label: "AI Planner",
    to: "/ai-planner",
    icon: "sparkles",
  },
  routes: [
    {
      path: "/ai-planner",
      title: "AI Planner",
    },
  ],
};
