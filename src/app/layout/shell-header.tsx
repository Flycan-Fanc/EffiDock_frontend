import { Search } from "lucide-react";

export function ShellHeader() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Platform Shell
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
          Modular workspace foundation
        </h1>
      </div>
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 md:w-[320px]">
        <Search className="h-4 w-4" />
        <span>搜索、全局入口等能力在后续批次预留</span>
      </div>
    </div>
  );
}
