import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { PlannerHistoryRecord, PlannerSuggestion } from "@/core/ai/types";

type SavePlannerRecordInput = {
  goal: string;
  backlogText: string;
  provider: PlannerHistoryRecord["provider"];
  model: string;
  suggestion: PlannerSuggestion;
};

type AiPlannerStore = {
  records: PlannerHistoryRecord[];
  saveRecord: (input: SavePlannerRecordInput) => PlannerHistoryRecord;
};

export const useAiPlannerStore = create<AiPlannerStore>()(
  persist(
    (set) => ({
      records: [],
      saveRecord: (input) => {
        const record: PlannerHistoryRecord = {
          id: crypto.randomUUID(),
          goal: input.goal,
          backlogText: input.backlogText,
          provider: input.provider,
          model: input.model,
          createdAt: new Date().toISOString(),
          suggestion: input.suggestion,
        };

        set((state) => ({
          records: [record, ...state.records].slice(0, 20),
        }));

        return record;
      },
    }),
    {
      name: "effidock-ai-planner-store",
      partialize: (state) => ({
        records: state.records,
      }),
    },
  ),
);
