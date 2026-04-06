import { useRef, useState, type DragEvent } from "react";

import packageJson from "../../../package.json";

import { aiModelOptions, aiProviderOptions, type AiProviderId } from "@/core/ai/types";
import { useI18n } from "@/core/i18n/use-i18n";
import type { LocalePreference } from "@/core/i18n/types";
import { getModuleRegistry } from "@/core/modules/registry/module-registry";
import { exportAllData, importAllDataFromText } from "@/features/settings/lib/data-transfer";
import { TagManagementCard } from "@/features/tags/components/tag-management-card";
import { useDiaryStore } from "@/modules/diary/stores/use-diary-store";
import { useInspirationStore } from "@/modules/inspiration/stores/use-inspiration-store";
import { useTodoStore } from "@/modules/todo/stores/use-todo-store";
import { useAppStore } from "@/stores/use-app-store";
import { useModuleStore } from "@/stores/use-module-store";
import { Button } from "@/shared/components/ui/button";
import { useConfirmDialog } from "@/shared/hooks/use-confirm-dialog";

const localeOptions: LocalePreference[] = ["system", "zh-CN", "en-US", "ja-JP"];
const themeOptions = ["system", "light", "dark"] as const;

export function SettingsPage() {
  const { locale, preference, setLocalePreference, t } = useI18n();
  const themePreference = useAppStore((state) => state.themePreference);
  const setThemePreference = useAppStore((state) => state.setThemePreference);
  const aiSettings = useAppStore((state) => state.aiSettings);
  const setAiSettings = useAppStore((state) => state.setAiSettings);
  const installedModules = useModuleStore((state) => state.installedModules);
  const enabledModules = useModuleStore((state) => state.enabledModules);
  const removeTodoTag = useTodoStore((state) => state.removeTag);
  const removeDiaryTag = useDiaryStore((state) => state.removeTag);
  const removeInspirationTag = useInspirationStore((state) => state.removeTag);
  const { confirm } = useConfirmDialog();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dataMessage, setDataMessage] = useState<string | null>(null);
  const [dataError, setDataError] = useState<string | null>(null);
  const [busyAction, setBusyAction] = useState<"export" | "import" | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const moduleCount = getModuleRegistry().length;

  const handleExport = async () => {
    setBusyAction("export");
    setDataError(null);

    try {
      await exportAllData();
      setDataMessage("settings.data.success.export");
    } catch {
      setDataError("settings.data.error.exportFailed");
    } finally {
      setBusyAction(null);
    }
  };

  const handleImportFile = async (file: File | null) => {
    if (!file) {
      return;
    }

    const confirmed = await confirm({
      title: t("settings.data.importConfirmTitle"),
      description: t("settings.data.importConfirm"),
      confirmVariant: "danger",
    });

    if (!confirmed) {
      return;
    }

    setBusyAction("import");
    setDataError(null);

    try {
      const content = await file.text();
      await importAllDataFromText(content);
      setDataMessage("settings.data.success.import");
    } catch (error) {
      if (error instanceof Error) {
        setDataError(error.message);
      } else {
        setDataError("settings.data.error.importFailed");
      }
    } finally {
      setBusyAction(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDrop = async (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragActive(false);
    await handleImportFile(event.dataTransfer.files?.[0] ?? null);
  };

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
          <div className="mt-4 flex flex-col gap-3">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">{t("settings.theme.current")}</span>
              <select
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-300"
                onChange={(event) =>
                  setThemePreference(event.target.value as (typeof themeOptions)[number])
                }
                value={themePreference}
              >
                {themeOptions.map((option) => (
                  <option key={option} value={option}>
                    {t(`settings.theme.option.${option}`)}
                  </option>
                ))}
              </select>
            </label>
            <p className="text-sm text-slate-500">{t("settings.theme.hint")}</p>
          </div>
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

        <article className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 md:col-span-2">
          <p className="text-sm font-medium text-slate-900">{t("settings.data.title")}</p>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            {t("settings.data.description")}
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Button disabled={busyAction !== null} onClick={() => void handleExport()} type="button">
              {busyAction === "export" ? t("settings.data.exporting") : t("settings.data.export")}
            </Button>
            <Button
              disabled={busyAction !== null}
              onClick={() => fileInputRef.current?.click()}
              type="button"
              variant="outline"
            >
              {busyAction === "import" ? t("settings.data.importing") : t("settings.data.import")}
            </Button>
            <input
              accept="application/json"
              className="hidden"
              onChange={(event) => void handleImportFile(event.target.files?.[0] ?? null)}
              ref={fileInputRef}
              type="file"
            />
          </div>
          <label
            className={`mt-4 flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-[20px] border border-dashed px-4 py-5 text-center text-sm transition ${
              dragActive
                ? "border-slate-400 bg-white text-slate-900"
                : "border-slate-200 bg-white text-slate-500"
            }`}
            onDragEnter={() => setDragActive(true)}
            onDragLeave={() => setDragActive(false)}
            onDragOver={(event) => {
              event.preventDefault();
              setDragActive(true);
            }}
            onDrop={(event) => void handleDrop(event)}
          >
            <span className="font-medium">{t("settings.data.dropzone.title")}</span>
            <span className="mt-2 max-w-xl leading-6">{t("settings.data.dropzone.description")}</span>
            <input
              accept="application/json"
              className="hidden"
              onChange={(event) => void handleImportFile(event.target.files?.[0] ?? null)}
              type="file"
            />
          </label>
          <p className="mt-4 text-sm text-slate-500">{t("settings.data.warning")}</p>
          {dataMessage ? (
            <div className="mt-4 rounded-[20px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {t(dataMessage)}
            </div>
          ) : null}
          {dataError ? (
            <div className="mt-4 rounded-[20px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {t(dataError)}
            </div>
          ) : null}
        </article>

        <article className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 md:col-span-2">
          <p className="text-sm font-medium text-slate-900">{t("settings.about.title")}</p>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            {t("settings.about.description")}
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <InfoCard label={t("settings.about.version")} value={packageJson.version} />
            <InfoCard label={t("settings.about.modules")} value={`${enabledModules.length} / ${moduleCount}`} />
            <InfoCard label={t("settings.about.installed")} value={`${installedModules.length}`} />
          </div>
          <div className="mt-4 rounded-[20px] border border-slate-200 bg-white px-4 py-4 text-sm text-slate-500">
            <p>{t("settings.about.stack")}</p>
          </div>
        </article>
      </div>
    </section>
  );
}

type InfoCardProps = {
  label: string;
  value: string;
};

function InfoCard({ label, value }: InfoCardProps) {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-white px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="mt-3 text-lg font-semibold text-slate-950">{value}</p>
    </div>
  );
}
