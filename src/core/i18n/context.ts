import { createContext } from "react";

import type { LocalePreference, SupportedLocale, TranslateFn } from "@/core/i18n/types";

export type I18nContextValue = {
  locale: SupportedLocale;
  preference: LocalePreference;
  setLocalePreference: (preference: LocalePreference) => void;
  t: TranslateFn;
};

export const I18nContext = createContext<I18nContextValue | null>(null);
