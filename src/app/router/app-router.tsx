import type { ReactElement } from "react";
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";

import { RootLayout } from "@/app/layout/root-layout";
import { ModuleGuard } from "@/core/modules/guards/module-guard";
import { getModuleRegistry } from "@/core/modules/registry/module-registry";
import type { ModuleId } from "@/core/types/module";
import { DashboardPage } from "@/features/dashboard/dashboard-page";
import { ModuleStorePage } from "@/features/module-store/module-store-page";
import { SettingsPage } from "@/features/settings/settings-page";
import { AiPlannerPage } from "@/modules/ai-planner/pages/ai-planner-page";
import { DiaryPage } from "@/modules/diary/pages/diary-page";
import { InspirationPage } from "@/modules/inspiration/pages/inspiration-page";
import { TodoPage } from "@/modules/todo/pages/todo-page";
import { NotFoundPage } from "@/shared/components/not-found-page";

const modulePageMap: Record<ModuleId, ReactElement> = {
  todo: <TodoPage />,
  diary: <DiaryPage />,
  inspiration: <InspirationPage />,
  "ai-planner": <AiPlannerPage />,
};

const moduleRoutes = getModuleRegistry().flatMap((moduleManifest) =>
  moduleManifest.routes.map((routeItem) => ({
    path: routeItem.path.replace(/^\//, ""),
    element: <ModuleGuard moduleId={moduleManifest.id} />,
    children: [{ index: true, element: modulePageMap[moduleManifest.id] }],
  })),
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "modules", element: <ModuleStorePage /> },
      { path: "settings", element: <SettingsPage /> },
      ...moduleRoutes,
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
