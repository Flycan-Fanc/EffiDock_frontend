import type {
  AiProviderSettings,
  PlannerInput,
  PlannerProviderAdapter,
} from "@/core/ai/types";

function validateSettings(settings: AiProviderSettings) {
  if (!settings.baseUrl.trim()) {
    throw new Error("aiPlanner.error.baseUrlRequired");
  }

  if (!settings.model.trim()) {
    throw new Error("aiPlanner.error.modelRequired");
  }
}

export const openAiCompatiblePlannerProvider: PlannerProviderAdapter = {
  id: "openai-compatible",
  async generateSuggestion(_input: PlannerInput, settings: AiProviderSettings) {
    validateSettings(settings);
    throw new Error("aiPlanner.error.networkDisabled");
  },
};
