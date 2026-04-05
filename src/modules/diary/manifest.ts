import type { ModuleManifest } from "@/core/types/module";

export const diaryManifest: ModuleManifest = {
  id: "diary",
  name: "Diary",
  description: "按日期沉淀记录与复盘内容的模块。",
  version: "0.1.0",
  category: "productivity",
  enabledByDefault: false,
  nav: {
    label: "Diary",
    to: "/diary",
    icon: "book-open",
  },
  routes: [
    {
      path: "/diary",
      title: "Diary",
    },
  ],
};
