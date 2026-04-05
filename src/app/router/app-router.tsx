import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";

import { RootLayout } from "@/app/layout/root-layout";
import { DashboardPage } from "@/features/dashboard/dashboard-page";
import { ModuleStorePage } from "@/features/module-store/module-store-page";
import { SettingsPage } from "@/features/settings/settings-page";
import { NotFoundPage } from "@/shared/components/not-found-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "modules", element: <ModuleStorePage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
