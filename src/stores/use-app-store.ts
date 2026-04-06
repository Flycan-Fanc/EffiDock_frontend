import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { AiProviderSettings } from "@/core/ai/types";

type AppStore = {
  initializedAt: string;
  localePreference: "system" | "en-US" | "zh-CN" | "ja-JP";
  themePreference: "system" | "light" | "dark";
  aiSettings: AiProviderSettings;
  setLocalePreference: (preference: AppStore["localePreference"]) => void;
  setThemePreference: (preference: AppStore["themePreference"]) => void;
  setAiSettings: (patch: Partial<AiProviderSettings>) => void;
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      initializedAt: new Date().toISOString(),
      localePreference: "system",
      themePreference: "system",
      aiSettings: {
        provider: "mock",
        baseUrl: "https://api.openai.com/v1",
        model: "gpt-5.4-mini",
      },
      setLocalePreference: (localePreference) => set({ localePreference }),
      setThemePreference: (themePreference) => set({ themePreference }),
      setAiSettings: (patch) =>
        set((state) => ({
          aiSettings: {
            ...state.aiSettings,
            ...patch,
          },
        })),
    }),
    {
      name: "effidock-app-store",
      version: 2,
      migrate: (persistedState) => {
        if (!persistedState || typeof persistedState !== "object") {
          return persistedState;
        }

        const state = persistedState as {
          aiSettings?: AiProviderSettings & { apiKey?: string };
        };

        if (!state.aiSettings) {
          return persistedState;
        }

        const aiSettings = { ...state.aiSettings } as AiProviderSettings & { apiKey?: string };
        delete aiSettings.apiKey;

        return {
          ...state,
          aiSettings,
        };
      },
      partialize: (state) => ({
        localePreference: state.localePreference,
        themePreference: state.themePreference,
        aiSettings: state.aiSettings,
      }),
    },
  ),
);
