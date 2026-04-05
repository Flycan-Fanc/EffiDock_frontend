import { create } from "zustand";

type AppStore = {
  initializedAt: string;
};

export const useAppStore = create<AppStore>(() => ({
  initializedAt: new Date().toISOString(),
}));
