export function ModuleStorePage() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Module Store
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          模块商店占位页
        </h2>
        <p className="max-w-2xl text-sm leading-7 text-slate-500">
          当前仅保留页面结构和视觉风格。真正的安装、启用、停用、卸载与状态标识会在后续批次接入。
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-[24px] border border-slate-200 bg-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-lg font-semibold text-slate-950">Todo</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                个人待办管理模块，占位卡片，后续接入模块状态逻辑。
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              Planned
            </span>
          </div>
        </article>

        <article className="rounded-[24px] border border-slate-200 bg-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-lg font-semibold text-slate-950">Diary</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                个人记录模块，占位卡片，后续再接入 manifest 与 registry。
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              Planned
            </span>
          </div>
        </article>
      </div>
    </section>
  );
}
