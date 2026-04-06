import { mockPlannerProvider } from "@/core/ai/adapters/mock-planner-provider";
import { openAiCompatiblePlannerProvider } from "@/core/ai/adapters/openai-compatible-provider";
import type { AiProviderSettings, PlannerInput, PlannerProviderAdapter } from "@/core/ai/types";

const providerRegistry: Record<AiProviderSettings["provider"], PlannerProviderAdapter> = {
  mock: mockPlannerProvider,
  "openai-compatible": openAiCompatiblePlannerProvider,
};

export async function generatePlannerSuggestion(
  input: PlannerInput,
  settings: AiProviderSettings,
) {
  const provider = providerRegistry[settings.provider];

  if (!provider) {
    throw new Error("aiPlanner.error.providerUnavailable");
  }

  return provider.generateSuggestion(input, settings);
}
