import type { PropsWithChildren } from "react";

import { ConfirmDialogProvider } from "@/app/providers/confirm-dialog-provider";
import { I18nProvider } from "@/core/i18n/provider";
import { ThemeProvider } from "@/app/providers/theme-provider";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <I18nProvider>
      <ConfirmDialogProvider>
        <ThemeProvider />
        {children}
      </ConfirmDialogProvider>
    </I18nProvider>
  );
}
