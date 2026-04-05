import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { ModuleId, ModuleInstallState } from "@/core/types/module";
import {
  getDefaultEnabledModules,
  getDefaultInstalledModules,
} from "@/core/modules/registry/module-registry";

type ModuleStore = ModuleInstallState & {
  installModule: (moduleId: ModuleId) => void;
  enableModule: (moduleId: ModuleId) => void;
  disableModule: (moduleId: ModuleId) => void;
  uninstallModule: (moduleId: ModuleId) => void;
  isInstalled: (moduleId: ModuleId) => boolean;
  isEnabled: (moduleId: ModuleId) => boolean;
};

const defaultInstalledModules = getDefaultInstalledModules();
const defaultEnabledModules = getDefaultEnabledModules();

export const useModuleStore = create<ModuleStore>()(
  persist(
    (set, get) => ({
      installedModules: defaultInstalledModules,
      enabledModules: defaultEnabledModules,
      installModule: (moduleId) =>
        set((state) => ({
          installedModules: state.installedModules.includes(moduleId)
            ? state.installedModules
            : [...state.installedModules, moduleId],
        })),
      enableModule: (moduleId) =>
        set((state) => {
          const installedModules = state.installedModules.includes(moduleId)
            ? state.installedModules
            : [...state.installedModules, moduleId];

          return {
            installedModules,
            enabledModules: state.enabledModules.includes(moduleId)
              ? state.enabledModules
              : [...state.enabledModules, moduleId],
          };
        }),
      disableModule: (moduleId) =>
        set((state) => ({
          enabledModules: state.enabledModules.filter((currentId) => currentId !== moduleId),
        })),
      uninstallModule: (moduleId) =>
        set((state) => ({
          installedModules: state.installedModules.filter((currentId) => currentId !== moduleId),
          enabledModules: state.enabledModules.filter((currentId) => currentId !== moduleId),
        })),
      isInstalled: (moduleId) => get().installedModules.includes(moduleId),
      isEnabled: (moduleId) => get().enabledModules.includes(moduleId),
    }),
    {
      name: "effidock-module-store",
      partialize: (state) => ({
        installedModules: state.installedModules,
        enabledModules: state.enabledModules,
      }),
    },
  ),
);
