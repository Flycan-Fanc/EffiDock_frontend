import { Search } from "lucide-react";

import { useI18n } from "@/core/i18n/use-i18n";
import type { LocalePreference } from "@/core/i18n/types";

const localeOptions: LocalePreference[] = ["system", "zh-CN", "en-US", "ja-JP"];

export function ShellHeader() {
  const { preference, setLocalePreference, t } = useI18n();

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {t("shell.badge")}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
          {t("shell.title")}
        </h1>
      </div>

      <div className="flex flex-col gap-3 md:items-end">
        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
          <span className="font-medium text-slate-700">{t("shell.languageLabel")}</span>
          <select
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-300"
            onChange={(event) => setLocalePreference(event.target.value as LocalePreference)}
            value={preference}
          >
            {localeOptions.map((locale) => (
              <option key={locale} value={locale}>
                {t(`language.${locale}`)}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 md:w-[360px]">
          <Search className="h-4 w-4" />
          <span>{t("shell.searchPlaceholder")}</span>
        </div>
      </div>
    </div>
  );
}
