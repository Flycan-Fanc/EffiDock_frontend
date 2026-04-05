import type { TranslateFn } from "@/core/i18n/types";
import type { ModuleId } from "@/core/types/module";

export function getModuleCopy(moduleId: ModuleId, t: TranslateFn) {
  return {
    name: t(`module.${moduleId}.name`),
    description: t(`module.${moduleId}.description`),
  };
}
