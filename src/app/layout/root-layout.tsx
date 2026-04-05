import { Outlet } from "react-router-dom";

import { ShellHeader } from "@/app/layout/shell-header";
import { ShellSidebar } from "@/app/layout/shell-sidebar";
import { SidebarLayout } from "@/app/layout/sidebar-layout";

export function RootLayout() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f9fc_0%,#eef2f7_100%)] text-foreground">
      <div className="mx-auto min-h-screen max-w-[1440px] p-4 md:p-6">
        <SidebarLayout
          sidebar={<ShellSidebar />}
          header={<ShellHeader />}
          content={<Outlet />}
        />
      </div>
    </div>
  );
}
