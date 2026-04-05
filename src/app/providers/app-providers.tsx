import type { PropsWithChildren } from "react";

import { I18nProvider } from "@/core/i18n/provider";

export function AppProviders({ children }: PropsWithChildren) {
  return <I18nProvider>{children}</I18nProvider>;
}
