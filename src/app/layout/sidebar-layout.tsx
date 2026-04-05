import type { ReactNode } from "react";

type SidebarLayoutProps = {
  sidebar: ReactNode;
  header: ReactNode;
  content: ReactNode;
};

export function SidebarLayout({ sidebar, header, content }: SidebarLayoutProps) {
  return (
    <div className="grid min-h-[calc(100vh-2rem)] gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="rounded-[28px] border border-white/70 bg-white/85 p-4 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur">
        {sidebar}
      </aside>
      <div className="flex min-h-full flex-col gap-4">
        <header className="rounded-[28px] border border-white/70 bg-white/75 px-5 py-4 shadow-[0_12px_40px_rgba(15,23,42,0.05)] backdrop-blur">
          {header}
        </header>
        <main className="flex-1 rounded-[32px] border border-white/70 bg-white px-5 py-5 shadow-[0_18px_60px_rgba(15,23,42,0.07)] md:px-6 md:py-6">
          {content}
        </main>
      </div>
    </div>
  );
}
