import { useEffect, useMemo, type PropsWithChildren } from "react";

import { I18nContext, type I18nContextValue } from "@/core/i18n/context";
import { resolveLocale } from "@/core/i18n/locales";
import { translateMessage } from "@/core/i18n/messages";
import { useAppStore } from "@/stores/use-app-store";

export function I18nProvider({ children }: PropsWithChildren) {
  const preference = useAppStore((state) => state.localePreference);
  const setLocalePreference = useAppStore((state) => state.setLocalePreference);
  const locale = resolveLocale(preference);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      preference,
      setLocalePreference,
      t: (key, params) => translateMessage(locale, key, params),
    }),
    [locale, preference, setLocalePreference],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
