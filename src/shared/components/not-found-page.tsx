import { Link } from "react-router-dom";

import { Button } from "@/shared/components/ui/button";

export function NotFoundPage() {
  return (
    <section className="rounded-3xl border border-border bg-card p-8 shadow-sm">
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Route Placeholder
        </p>
        <h2 className="text-2xl font-semibold tracking-tight">页面不存在</h2>
        <p className="text-sm leading-7 text-muted-foreground">
          当前仅开放 Batch 0 的基础页面。请返回 Dashboard 继续检查路由是否可用。
        </p>
        <Button asChild>
          <Link to="/dashboard">回到 Dashboard</Link>
        </Button>
      </div>
    </section>
  );
}
