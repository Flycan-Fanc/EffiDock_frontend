import packageJson from "../../../../package.json";

import type { PlannerHistoryRecord } from "@/core/ai/types";
import type { ModuleInstallState } from "@/core/types/module";
import { listTags } from "@/features/tags/services/tag-service";
import type { TagItem } from "@/features/tags/types/tag";
import { listDiaryEntries } from "@/modules/diary/services/diary-service";
import type { DiaryEntry } from "@/modules/diary/types/diary";
import { listInspirations } from "@/modules/inspiration/services/inspiration-service";
import type { InspirationItem } from "@/modules/inspiration/types/inspiration";
import { listTodos } from "@/modules/todo/services/todo-service";
import type { TodoItem } from "@/modules/todo/types/todo";
import { useAiPlannerStore } from "@/modules/ai-planner/stores/use-ai-planner-store";
import { useAppStore } from "@/stores/use-app-store";
import { useModuleStore } from "@/stores/use-module-store";
import { replaceEffiDockStoreRecords, EFFIDOCK_STORE_NAMES } from "@/shared/lib/storage/effidock-database";
import { useDiaryStore } from "@/modules/diary/stores/use-diary-store";
import { useInspirationStore } from "@/modules/inspiration/stores/use-inspiration-store";
import { useTodoStore } from "@/modules/todo/stores/use-todo-store";
import { useTagStore } from "@/features/tags/stores/use-tag-store";

type ExportedAppState = Pick<
  ReturnType<typeof useAppStore.getState>,
  "localePreference" | "themePreference" | "aiSettings"
>;

type ExportBundle = {
  schemaVersion: 1;
  exportedAt: string;
  appVersion: string;
  appState: ExportedAppState;
  moduleState: ModuleInstallState;
  aiPlannerHistory: PlannerHistoryRecord[];
  data: {
    todos: TodoItem[];
    diaryEntries: DiaryEntry[];
    inspirationItems: InspirationItem[];
    tags: TagItem[];
  };
};

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isTodoItem(value: unknown): value is TodoItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as TodoItem;
  return (
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    typeof item.notes === "string" &&
    isStringArray(item.tagIds) &&
    typeof item.completed === "boolean" &&
    ["low", "medium", "high"].includes(item.priority) &&
    (item.dueDate === null || typeof item.dueDate === "string") &&
    typeof item.createdAt === "string" &&
    typeof item.updatedAt === "string"
  );
}

function isDiaryEntry(value: unknown): value is DiaryEntry {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as DiaryEntry;
  return (
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    typeof item.content === "string" &&
    typeof item.entryDate === "string" &&
    isStringArray(item.tagIds) &&
    typeof item.createdAt === "string" &&
    typeof item.updatedAt === "string"
  );
}

function isInspirationItem(value: unknown): value is InspirationItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as InspirationItem;
  return (
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    typeof item.content === "string" &&
    isStringArray(item.tagIds) &&
    typeof item.isFavorite === "boolean" &&
    typeof item.createdAt === "string" &&
    typeof item.updatedAt === "string"
  );
}

function isTagItem(value: unknown): value is TagItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as TagItem;
  return (
    typeof item.id === "string" &&
    typeof item.label === "string" &&
    typeof item.normalizedLabel === "string" &&
    typeof item.createdAt === "string" &&
    typeof item.updatedAt === "string"
  );
}

function isPlannerHistoryRecord(value: unknown): value is PlannerHistoryRecord {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as PlannerHistoryRecord;
  return (
    typeof item.id === "string" &&
    typeof item.goal === "string" &&
    typeof item.backlogText === "string" &&
    typeof item.provider === "string" &&
    typeof item.model === "string" &&
    typeof item.createdAt === "string" &&
    !!item.suggestion &&
    typeof item.suggestion === "object" &&
    typeof item.suggestion.overview === "string" &&
    Array.isArray(item.suggestion.milestones) &&
    Array.isArray(item.suggestion.nextActions) &&
    Array.isArray(item.suggestion.risks)
  );
}

function assertExportBundle(value: unknown): asserts value is ExportBundle {
  if (!value || typeof value !== "object") {
    throw new Error("settings.data.error.invalidFile");
  }

  const bundle = value as Partial<ExportBundle>;

  if (bundle.schemaVersion !== 1 || !bundle.data) {
    throw new Error("settings.data.error.invalidFile");
  }

  if (
    !Array.isArray(bundle.data.todos) ||
    !bundle.data.todos.every(isTodoItem) ||
    !Array.isArray(bundle.data.diaryEntries) ||
    !bundle.data.diaryEntries.every(isDiaryEntry) ||
    !Array.isArray(bundle.data.inspirationItems) ||
    !bundle.data.inspirationItems.every(isInspirationItem) ||
    !Array.isArray(bundle.data.tags) ||
    !bundle.data.tags.every(isTagItem)
  ) {
    throw new Error("settings.data.error.invalidFile");
  }

  if (
    !bundle.moduleState ||
    !isStringArray(bundle.moduleState.installedModules) ||
    !isStringArray(bundle.moduleState.enabledModules)
  ) {
    throw new Error("settings.data.error.invalidFile");
  }

  if (
    !bundle.appState ||
    typeof bundle.appState.localePreference !== "string" ||
    typeof bundle.appState.themePreference !== "string" ||
    !bundle.appState.aiSettings
  ) {
    throw new Error("settings.data.error.invalidFile");
  }

  if (
    !Array.isArray(bundle.aiPlannerHistory) ||
    !bundle.aiPlannerHistory.every(isPlannerHistoryRecord)
  ) {
    throw new Error("settings.data.error.invalidFile");
  }
}

export async function buildExportBundle(): Promise<ExportBundle> {
  const [todos, diaryEntries, inspirationItems, tags] = await Promise.all([
    listTodos(),
    listDiaryEntries(),
    listInspirations(),
    listTags(),
  ]);

  const appState = useAppStore.getState();
  const moduleState = useModuleStore.getState();
  const aiPlannerState = useAiPlannerStore.getState();

  return {
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    appVersion: packageJson.version,
    appState: {
      localePreference: appState.localePreference,
      themePreference: appState.themePreference,
      aiSettings: appState.aiSettings,
    },
    moduleState: {
      installedModules: moduleState.installedModules,
      enabledModules: moduleState.enabledModules,
    },
    aiPlannerHistory: aiPlannerState.records,
    data: {
      todos,
      diaryEntries,
      inspirationItems,
      tags,
    },
  };
}

export async function exportAllData() {
  const bundle = await buildExportBundle();
  const content = JSON.stringify(bundle, null, 2);
  const blob = new Blob([content], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `effidock-export-${bundle.exportedAt.slice(0, 19).replace(/[:T]/g, "-")}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function importAllDataFromText(content: string) {
  let parsed: unknown;

  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("settings.data.error.invalidJson");
  }

  assertExportBundle(parsed);

  await Promise.all([
    replaceEffiDockStoreRecords(EFFIDOCK_STORE_NAMES.todo, parsed.data.todos),
    replaceEffiDockStoreRecords(EFFIDOCK_STORE_NAMES.diary, parsed.data.diaryEntries),
    replaceEffiDockStoreRecords(EFFIDOCK_STORE_NAMES.inspiration, parsed.data.inspirationItems),
    replaceEffiDockStoreRecords(EFFIDOCK_STORE_NAMES.tags, parsed.data.tags),
  ]);

  useAppStore.setState({
    localePreference: parsed.appState.localePreference,
    themePreference: parsed.appState.themePreference,
    aiSettings: parsed.appState.aiSettings,
  });

  useModuleStore.setState({
    installedModules: parsed.moduleState.installedModules,
    enabledModules: parsed.moduleState.enabledModules,
  });

  useAiPlannerStore.setState({
    records: parsed.aiPlannerHistory,
  });

  await Promise.all([
    useTodoStore.getState().hydrate(),
    useDiaryStore.getState().hydrate(),
    useInspirationStore.getState().hydrate(),
    useTagStore.getState().hydrate(),
  ]);
}
