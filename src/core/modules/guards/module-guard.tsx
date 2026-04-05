import { Navigate, Outlet } from "react-router-dom";

import type { ModuleId } from "@/core/types/module";
import { useModuleStore } from "@/stores/use-module-store";
import { ModuleUnavailablePage } from "@/shared/components/module-unavailable-page";

type ModuleGuardProps = {
  moduleId: ModuleId;
};

export function ModuleGuard({ moduleId }: ModuleGuardProps) {
  const isInstalled = useModuleStore((state) => state.isInstalled(moduleId));
  const isEnabled = useModuleStore((state) => state.isEnabled(moduleId));

  if (!isInstalled) {
    return <Navigate to="/modules" replace />;
  }

  if (!isEnabled) {
    return <ModuleUnavailablePage moduleId={moduleId} />;
  }

  return <Outlet />;
}
