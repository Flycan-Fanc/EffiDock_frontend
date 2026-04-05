import { Link } from "react-router-dom";

import { Button } from "@/shared/components/ui/button";

export function NotFoundPage() {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-slate-50 p-8">
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Route Placeholder
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">页面不存在</h2>
        <p className="max-w-2xl text-sm leading-7 text-slate-500">
          当前路由不存在，或者对应模块尚未开放。你可以返回 Dashboard，或前往模块商店检查模块状态。
        </p>
        <div className="flex gap-3">
          <Button asChild>
            <Link to="/dashboard">回到 Dashboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/modules">前往模块商店</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
