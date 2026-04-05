export function SettingsPage() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Settings
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          设置页占位
        </h2>
        <p className="max-w-2xl text-sm leading-7 text-slate-500">
          当前只保留信息架构和页面气质，不提前接入主题、AI Provider 或导入导出逻辑。
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-medium text-slate-900">Theme</p>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            将在 Batch 10 整理 light / dark / system 结构。
          </p>
        </article>
        <article className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-medium text-slate-900">AI Provider</p>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            将在 Batch 9 与 Batch 10 之间补齐配置页和 Provider 接入。
          </p>
        </article>
      </div>
    </section>
  );
}
