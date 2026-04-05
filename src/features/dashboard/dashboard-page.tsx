export function DashboardPage() {
  return (
    <section className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <article className="rounded-[28px] bg-slate-950 p-6 text-slate-50">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
            Dashboard
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            统一工作台首页占位
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
            当前页面主要验证平台壳子、页面切换和内容区层级。真正的数据聚合、今日任务、最近记录和已启用模块入口将在后续批次实现。
          </p>
        </article>
        <article className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Batch 1 Focus
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            <li>搭好工作台骨架</li>
            <li>统一左侧导航与主内容区</li>
            <li>保持后续模块接入边界清晰</li>
          </ul>
        </article>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[24px] border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-900">Today Tasks</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">--</p>
          <p className="mt-2 text-sm text-slate-500">Batch 7 再接入 Todo 聚合</p>
        </article>
        <article className="rounded-[24px] border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-900">Recent Diary</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">--</p>
          <p className="mt-2 text-sm text-slate-500">Batch 7 再接入 Diary 聚合</p>
        </article>
        <article className="rounded-[24px] border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-900">Recent Inspiration</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">--</p>
          <p className="mt-2 text-sm text-slate-500">Batch 7 再接入 Inspiration 聚合</p>
        </article>
      </div>
    </section>
  );
}
