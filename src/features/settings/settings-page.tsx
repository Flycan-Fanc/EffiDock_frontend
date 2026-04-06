import { aiModelOptions, aiProviderOptions, type AiProviderId } from "@/core/ai/types";
import { useI18n } from "@/core/i18n/use-i18n";
import type { LocalePreference } from "@/core/i18n/types";
import { TagManagementCard } from "@/features/tags/components/tag-management-card";
import { useDiaryStore } from "@/modules/diary/stores/use-diary-store";
import { useInspirationStore } from "@/modules/inspiration/stores/use-inspiration-store";
import { useTodoStore } from "@/modules/todo/stores/use-todo-store";
import { useAppStore } from "@/stores/use-app-store";

const localeOptions: LocalePreference[] = ["system", "zh-CN", "en-US", "ja-JP"];

export function SettingsPage() {
  const { locale, preference, setLocalePreference, t } = useI18n();
  const aiSettings = useAppStore((state) => state.aiSettings);
  const setAiSettings = useAppStore((state) => state.setAiSettings);
  const removeTodoTag = useTodoStore((state) => state.removeTag);
  const removeDiaryTag = useDiaryStore((state) => state.removeTag);
  const removeInspirationTag = useInspirationStore((state) => state.removeTag);

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {t("settings.badge")}
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          {t("settings.title")}
        </h2>
        <p className="max-w-2xl text-sm leading-7 text-slate-500">
          {t("settings.description")}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-medium text-slate-900">{t("settings.language.title")}</p>
          <p className="mt-3 text-sm leading-6 text-slate-500">{t("settings.language.description")}</p>
          <div className="mt-4 flex flex-col gap-3">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">{t("settings.language.current")}</span>
              <select
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-300"
                onChange={(event) => setLocalePreference(event.target.value as LocalePreference)}
                value={preference}
              >
                {localeOptions.map((option) => (
                  <option key={option} value={option}>
                    {t(`language.${option}`)}
                  </option>
                ))}
              </select>
            </label>
            <p className="text-sm text-slate-500">
              {preference === "system" ? t("settings.language.following") : t("settings.language.manual")}
              {" · "}
              {t(`language.${locale}`)}
            </p>
          </div>
        </article>

        <article className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-medium text-slate-900">{t("settings.theme.title")}</p>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            {t("settings.theme.description")}
          </p>
        </article>

        <article className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 md:col-span-2">
          <p className="text-sm font-medium text-slate-900">{t("settings.ai.title")}</p>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            {t("settings.ai.description")}
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">{t("settings.ai.provider")}</span>
              <select
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-300"
                onChange={(event) =>
                  setAiSettings({ provider: event.target.value as AiProviderId })
                }
                value={aiSettings.provider}
              >
                {aiProviderOptions.map((option) => (
                  <option key={option} value={option}>
                    {t(`settings.ai.providerOption.${option}`)}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">{t("settings.ai.model")}</span>
              <input
                list="ai-model-options"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-300"
                onChange={(event) => setAiSettings({ model: event.target.value })}
                placeholder={t("settings.ai.modelPlaceholder")}
                value={aiSettings.model}
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-slate-700">{t("settings.ai.baseUrl")}</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-300"
                onChange={(event) => setAiSettings({ baseUrl: event.target.value })}
                placeholder={t("settings.ai.baseUrlPlaceholder")}
                value={aiSettings.baseUrl}
              />
            </label>

          </div>
          <datalist id="ai-model-options">
            {aiModelOptions.map((model) => (
              <option key={model} value={model} />
            ))}
          </datalist>
          <div className="mt-4 rounded-[20px] border border-slate-200 bg-white px-4 py-4 text-sm text-slate-500">
            <p>{t(`settings.ai.providerHelp.${aiSettings.provider}`)}</p>
            <p className="mt-2">
              {aiSettings.provider === "mock"
                ? t("settings.ai.status.mockReady")
                : t("settings.ai.status.compatibleConfigured")}
            </p>
            <p className="mt-2">{t("settings.ai.securityHint")}</p>
          </div>
        </article>

        <TagManagementCard
          onDeleteTag={async (tagId) => {
            await Promise.all([
              removeTodoTag(tagId),
              removeDiaryTag(tagId),
              removeInspirationTag(tagId),
            ]);
          }}
        />
      </div>
    </section>
  );
}
