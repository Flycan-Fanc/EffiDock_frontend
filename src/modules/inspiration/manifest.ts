import type { ModuleManifest } from "@/core/types/module";

export const inspirationManifest: ModuleManifest = {
  id: "inspiration",
  name: "Inspiration",
  description: "快速收集想法与灵感片段的模块。",
  version: "0.1.0",
  category: "productivity",
  enabledByDefault: false,
  nav: {
    label: "Inspiration",
    to: "/inspiration",
    icon: "lightbulb",
  },
  routes: [
    {
      path: "/inspiration",
      title: "Inspiration",
    },
  ],
};
