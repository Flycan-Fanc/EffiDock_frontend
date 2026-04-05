import { create } from "zustand";
import { persist } from "zustand/middleware";

type AppStore = {
  initializedAt: string;
  localePreference: "system" | "en-US" | "zh-CN" | "ja-JP";
  setLocalePreference: (preference: AppStore["localePreference"]) => void;
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      initializedAt: new Date().toISOString(),
      localePreference: "system",
      setLocalePreference: (localePreference) => set({ localePreference }),
    }),
    {
      name: "effidock-app-store",
      partialize: (state) => ({
        localePreference: state.localePreference,
      }),
    },
  ),
);
