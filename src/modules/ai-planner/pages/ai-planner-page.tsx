import { useMemo, useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, Sparkles } from "lucide-react";

import { generatePlannerSuggestion } from "@/core/ai/client";
import type { PlannerHistoryRecord, PlannerSuggestion } from "@/core/ai/types";
import { useI18n } from "@/core/i18n/use-i18n";
import { useAiPlannerStore } from "@/modules/ai-planner/stores/use-ai-planner-store";
import { useAppStore } from "@/stores/use-app-store";
import { useSmoothScrollSection } from "@/shared/hooks/use-smooth-scroll-section";
import { useScrollToEditor } from "@/shared/hooks/use-scroll-to-editor";
import { Button } from "@/shared/components/ui/button";

export function AiPlannerPage() {
  const { locale, t } = useI18n();
  const aiSettings = useAppStore((state) => state.aiSettings);
  const historyRecords = useAiPlannerStore((state) => state.records);
  const saveRecord = useAiPlannerStore((state) => state.saveRecord);
  const [goal, setGoal] = useState("");
  const [backlogText, setBacklogText] = useState("");
  const [result, setResult] = useState<PlannerSuggestion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [editingHistoryId, setEditingHistoryId] = useState<string | null>(null);
  const [viewingHistoryRecord, setViewingHistoryRecord] = useState<PlannerHistoryRecord | null>(null);
  const [editorScrollTrigger, setEditorScrollTrigger] = useState(0);
  const [historyScrollTrigger, setHistoryScrollTrigger] = useState(0);
  const { containerRef: editorRef, focusTargetRef } = useScrollToEditor(
    editingHistoryId ? `history-edit-${editingHistoryId}-${editorScrollTrigger}` : null,
  );
  const { containerRef: historyViewRef } = useSmoothScrollSection(
    viewingHistoryRecord ? `history-view-${viewingHistoryRecord.id}-${historyScrollTrigger}` : null,
  );

  const providerLabel = useMemo(
    () => t(`settings.ai.providerOption.${aiSettings.provider}`),
    [aiSettings.provider, t],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!goal.trim()) {
      setError("aiPlanner.error.goalRequired");
      setResult(null);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const suggestion = await generatePlannerSuggestion(
        {
          goal: goal.trim(),
          backlogText,
          locale,
        },
        aiSettings,
      );

      setResult(suggestion);
      saveRecord({
        goal: goal.trim(),
        backlogText,
        provider: aiSettings.provider,
        model: aiSettings.model,
        suggestion,
      });
      setViewingHistoryRecord(null);
      setEditingHistoryId(null);
    } catch (caughtError) {
      if (caughtError instanceof Error) {
        setError(caughtError.message);
      } else {
        setError("aiPlanner.error.unavailable");
      }
      setResult(null);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
        <article className="rounded-[28px] border border-slate-200 bg-white p-6" ref={editorRef}>
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {editingHistoryId ? t("aiPlanner.edit.badge") : t("aiPlanner.badge")}
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
              {editingHistoryId ? t("aiPlanner.edit.title") : t("aiPlanner.title")}
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-slate-500">
              {editingHistoryId ? t("aiPlanner.edit.description") : t("aiPlanner.description")}
            </p>
          </div>

          <form className="mt-6 space-y-4" onSubmit={(event) => void handleSubmit(event)}>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-800">{t("aiPlanner.goalLabel")}</span>
              <input
                className="w-full rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-300"
                ref={focusTargetRef}
                onChange={(event) => setGoal(event.target.value)}
                placeholder={t("aiPlanner.goalPlaceholder")}
                value={goal}
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-800">{t("aiPlanner.backlogLabel")}</span>
              <textarea
                className="min-h-44 w-full rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition focus:border-slate-300"
                onChange={(event) => setBacklogText(event.target.value)}
                placeholder={t("aiPlanner.backlogPlaceholder")}
                value={backlogText}
              />
            </label>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                {t("aiPlanner.providerStatus", { provider: providerLabel, model: aiSettings.model || "--" })}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                {editingHistoryId ? (
                  <Button
                    className="min-w-36"
                    onClick={() => {
                      setEditingHistoryId(null);
                      setGoal("");
                      setBacklogText("");
                      setError(null);
                    }}
                    type="button"
                    variant="outline"
                  >
                    {t("aiPlanner.edit.cancel")}
                  </Button>
                ) : null}
                <Button className="min-w-36" disabled={submitting} type="submit">
                  {submitting ? t("aiPlanner.submitLoading") : t("aiPlanner.submit")}
                </Button>
              </div>
            </div>
          </form>
        </article>

        <article className="rounded-[28px] bg-slate-950 p-6 text-slate-50">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-slate-50">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">{t("aiPlanner.sidecar.title")}</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {t("aiPlanner.sidecar.description")}
              </p>
            </div>
          </div>
          <div className="mt-6 space-y-3 text-sm text-slate-300">
            <div className="rounded-[20px] bg-white/5 px-4 py-4">
              <p className="font-semibold text-white">{t("aiPlanner.sidecar.currentProvider")}</p>
              <p className="mt-2">{providerLabel}</p>
            </div>
            <div className="rounded-[20px] bg-white/5 px-4 py-4">
              <p className="font-semibold text-white">{t("aiPlanner.sidecar.behavior")}</p>
              <p className="mt-2">{t(`settings.ai.providerHelp.${aiSettings.provider}`)}</p>
            </div>
          </div>
        </article>
      </div>

      {error ? (
        <div className="flex items-start gap-3 rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{t(error)}</span>
        </div>
      ) : null}

      {viewingHistoryRecord ? (
        <article className="rounded-[28px] border border-slate-200 bg-white p-6" ref={historyViewRef}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                {t("aiPlanner.history.detailBadge")}
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                {viewingHistoryRecord.goal}
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                {t("aiPlanner.history.meta", {
                  provider: t(`settings.ai.providerOption.${viewingHistoryRecord.provider}`),
                  model: viewingHistoryRecord.model || "--",
                  createdAt: new Date(viewingHistoryRecord.createdAt).toLocaleString(locale),
                })}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={() => {
                  setViewingHistoryRecord(null);
                  setError(null);
                }}
                type="button"
                variant="outline"
              >
                {t("aiPlanner.history.close")}
              </Button>
              <Button
                onClick={() => {
                  setViewingHistoryRecord(null);
                  setEditingHistoryId(viewingHistoryRecord.id);
                  setGoal(viewingHistoryRecord.goal);
                  setBacklogText(viewingHistoryRecord.backlogText);
                  setResult(null);
                  setError(null);
                  setEditorScrollTrigger((value) => value + 1);
                }}
                type="button"
              >
                {t("aiPlanner.history.edit")}
              </Button>
            </div>
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-[1.1fr_1fr_1fr]">
            <section className="rounded-[24px] bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-900">{t("aiPlanner.result.overview")}</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {viewingHistoryRecord.suggestion.overview}
              </p>
            </section>
            <PlannerListCard
              items={viewingHistoryRecord.suggestion.milestones}
              title={t("aiPlanner.result.milestones")}
            />
            <PlannerListCard
              items={viewingHistoryRecord.suggestion.nextActions}
              title={t("aiPlanner.result.nextActions")}
            />
          </div>

          <PlannerListCard
            className="mt-4"
            items={viewingHistoryRecord.suggestion.risks}
            title={t("aiPlanner.result.risks")}
          />
        </article>
      ) : result ? (
        <article className="rounded-[28px] border border-slate-200 bg-white p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {t("aiPlanner.result.ready")}
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
              {t("aiPlanner.result.provider", { provider: providerLabel })}
            </span>
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-[1.1fr_1fr_1fr]">
            <section className="rounded-[24px] bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-900">{t("aiPlanner.result.overview")}</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">{result.overview}</p>
            </section>
            <PlannerListCard items={result.milestones} title={t("aiPlanner.result.milestones")} />
            <PlannerListCard items={result.nextActions} title={t("aiPlanner.result.nextActions")} />
          </div>

          <PlannerListCard
            className="mt-4"
            items={result.risks}
            title={t("aiPlanner.result.risks")}
          />
        </article>
      ) : (
        <article className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
          {t("aiPlanner.empty")}
        </article>
      )}

      <article className="rounded-[28px] border border-slate-200 bg-white p-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {t("aiPlanner.history.badge")}
          </p>
          <h3 className="text-xl font-semibold tracking-tight text-slate-950">
            {t("aiPlanner.history.title")}
          </h3>
          <p className="text-sm leading-6 text-slate-500">{t("aiPlanner.history.description")}</p>
        </div>

        {historyRecords.length === 0 ? (
          <div className="mt-5 rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-5 py-6 text-sm text-slate-500">
            {t("aiPlanner.history.empty")}
          </div>
        ) : (
          <div className="mt-5 grid gap-3">
            {historyRecords.map((record) => (
              <HistoryRecordCard
                key={record.id}
                locale={locale}
                record={record}
                onOpen={(selectedRecord) => {
                  setViewingHistoryRecord(selectedRecord);
                  setResult(null);
                  setError(null);
                  setEditingHistoryId(null);
                  setHistoryScrollTrigger((value) => value + 1);
                }}
                onEdit={(selectedRecord) => {
                  setViewingHistoryRecord(null);
                  setEditingHistoryId(selectedRecord.id);
                  setGoal(selectedRecord.goal);
                  setBacklogText(selectedRecord.backlogText);
                  setResult(null);
                  setError(null);
                  setEditorScrollTrigger((value) => value + 1);
                }}
                t={t}
              />
            ))}
          </div>
        )}
      </article>
    </section>
  );
}

type PlannerListCardProps = {
  title: string;
  items: string[];
  className?: string;
};

function PlannerListCard({ title, items, className }: PlannerListCardProps) {
  return (
    <section className={`rounded-[24px] bg-slate-50 p-5 ${className ?? ""}`.trim()}>
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <ul className="mt-3 space-y-3">
        {items.map((item, index) => (
          <li
            key={`${title}-${index}`}
            className="rounded-[18px] bg-white px-4 py-3 text-sm leading-6 text-slate-600"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

type HistoryRecordCardProps = {
  record: PlannerHistoryRecord;
  onOpen: (record: PlannerHistoryRecord) => void;
  onEdit: (record: PlannerHistoryRecord) => void;
  locale: string;
  t: (key: string, params?: Record<string, string | number>) => string;
};

function HistoryRecordCard({ record, onOpen, onEdit, locale, t }: HistoryRecordCardProps) {
  const providerLabel = t(`settings.ai.providerOption.${record.provider}`);

  return (
    <div className="flex flex-col gap-4 rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-900">{record.goal}</p>
        <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
          {t("aiPlanner.history.meta", {
            provider: providerLabel,
            model: record.model || "--",
            createdAt: new Date(record.createdAt).toLocaleString(locale),
          })}
        </p>
        <p className="text-sm leading-6 text-slate-500">{record.suggestion.overview}</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={() => onOpen(record)} type="button" variant="outline">
          {t("aiPlanner.history.open")}
        </Button>
        <Button onClick={() => onEdit(record)} type="button">
          {t("aiPlanner.history.edit")}
        </Button>
      </div>
    </div>
  );
}
