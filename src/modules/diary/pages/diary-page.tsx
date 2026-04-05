export function DiaryPage() {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-8">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Diary Module
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          Diary 模块占位页
        </h2>
        <p className="max-w-2xl text-sm leading-7 text-slate-500">
          当前仅验证模块路由守卫和导航接入，具体日记业务会在 Batch 4 开发。
        </p>
      </div>
    </section>
  );
}
