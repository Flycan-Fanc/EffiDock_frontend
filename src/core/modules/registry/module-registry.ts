import type { ModuleId, ModuleManifest } from "@/core/types/module";
import { aiPlannerManifest } from "@/modules/ai-planner/manifest";
import { diaryManifest } from "@/modules/diary/manifest";
import { inspirationManifest } from "@/modules/inspiration/manifest";
import { todoManifest } from "@/modules/todo/manifest";

const moduleRegistry: ModuleManifest[] = [
  todoManifest,
  diaryManifest,
  inspirationManifest,
  aiPlannerManifest,
];

export function getModuleRegistry() {
  return moduleRegistry;
}

export function getModuleManifestById(moduleId: ModuleId) {
  return moduleRegistry.find((moduleManifest) => moduleManifest.id === moduleId);
}

export function getDefaultInstalledModules() {
  return moduleRegistry.map((moduleManifest) => moduleManifest.id);
}

export function getDefaultEnabledModules() {
  return moduleRegistry
    .filter((moduleManifest) => moduleManifest.enabledByDefault)
    .map((moduleManifest) => moduleManifest.id);
}
