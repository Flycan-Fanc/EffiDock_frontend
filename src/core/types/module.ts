export type ModuleId = "todo" | "diary" | "inspiration" | "ai-planner";

export type ModuleNavItem = {
  label: string;
  to: string;
  icon: "check-square" | "book-open" | "lightbulb" | "sparkles";
};

export type ModuleRouteItem = {
  path: string;
  title: string;
};

export type ModuleManifest = {
  id: ModuleId;
  name: string;
  description: string;
  version: string;
  category: "productivity" | "ai";
  enabledByDefault: boolean;
  nav: ModuleNavItem;
  routes: ModuleRouteItem[];
};

export type ModuleInstallState = {
  installedModules: ModuleId[];
  enabledModules: ModuleId[];
};
