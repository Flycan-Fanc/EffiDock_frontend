export function TodoPage() {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-8">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Todo Module
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          Todo 模块占位页
        </h2>
        <p className="max-w-2xl text-sm leading-7 text-slate-500">
          Batch 2 仅完成模块路由接入和守卫。Todo 的新增、编辑、删除、筛选与持久化将在 Batch 3 实现。
        </p>
      </div>
    </section>
  );
}
