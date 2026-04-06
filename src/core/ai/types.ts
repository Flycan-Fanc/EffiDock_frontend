export const aiProviderOptions = ["mock", "openai-compatible"] as const;

export const aiModelOptions = [
  "gpt-5.4-mini",
  "gpt-5.4",
  "gpt-4.1-mini",
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "deepseek-chat",
  "deepseek-reasoner",
] as const;

export type AiProviderId = (typeof aiProviderOptions)[number];

export type AiProviderSettings = {
  provider: AiProviderId;
  baseUrl: string;
  model: string;
};

export type PlannerInput = {
  goal: string;
  backlogText: string;
  locale: string;
};

export type PlannerSuggestion = {
  provider: AiProviderId;
  generatedAt: string;
  overview: string;
  milestones: string[];
  nextActions: string[];
  risks: string[];
};

export type PlannerHistoryRecord = {
  id: string;
  goal: string;
  backlogText: string;
  provider: AiProviderId;
  model: string;
  createdAt: string;
  suggestion: PlannerSuggestion;
};

export type PlannerProviderAdapter = {
  id: AiProviderId;
  generateSuggestion: (
    input: PlannerInput,
    settings: AiProviderSettings,
  ) => Promise<PlannerSuggestion>;
};
