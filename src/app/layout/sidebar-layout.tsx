import type { ReactNode } from "react";

type SidebarLayoutProps = {
  sidebar: ReactNode;
  header: ReactNode;
  content: ReactNode;
};

export function SidebarLayout({ sidebar, header, content }: SidebarLayoutProps) {
  return (
    <div className="grid min-h-[calc(100vh-2rem)] gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="rounded-[28px] border border-[color:var(--shell-chrome-border)] bg-[color:var(--shell-sidebar-bg)] p-4 shadow-[var(--shell-chrome-shadow)] backdrop-blur">
        {sidebar}
      </aside>
      <div className="flex min-h-full flex-col gap-4">
        <header className="rounded-[28px] border border-[color:var(--shell-chrome-border)] bg-[color:var(--shell-header-bg)] px-5 py-4 shadow-[var(--shell-chrome-shadow)] backdrop-blur">
          {header}
        </header>
        <main className="flex-1 rounded-[32px] border border-[color:var(--shell-chrome-border)] bg-[color:var(--shell-main-bg)] px-5 py-5 shadow-[var(--shell-chrome-shadow)] backdrop-blur md:px-6 md:py-6">
          {content}
        </main>
      </div>
    </div>
  );
}
