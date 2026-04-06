import { useCallback, useMemo, useRef, useState, type PropsWithChildren } from "react";

import { useI18n } from "@/core/i18n/use-i18n";
import { AppConfirmDialog } from "@/shared/components/app-confirm-dialog";
import {
  ConfirmDialogContext,
  type ConfirmDialogOptions,
} from "@/shared/contexts/confirm-dialog-context";

type DialogState = ConfirmDialogOptions & {
  open: boolean;
};

const initialDialogState: DialogState = {
  open: false,
  title: "",
  description: "",
  confirmLabel: "",
  cancelLabel: "",
  confirmVariant: "default",
};

export function ConfirmDialogProvider({ children }: PropsWithChildren) {
  const { t } = useI18n();
  const resolverRef = useRef<((value: boolean) => void) | null>(null);
  const [dialogState, setDialogState] = useState<DialogState>(initialDialogState);

  const closeDialog = useCallback((value: boolean) => {
    resolverRef.current?.(value);
    resolverRef.current = null;
    setDialogState(initialDialogState);
  }, []);

  const confirm = useCallback(
    (options: ConfirmDialogOptions) =>
      new Promise<boolean>((resolve) => {
        resolverRef.current = resolve;
        setDialogState({
          open: true,
          title: options.title,
          description: options.description,
          confirmLabel: options.confirmLabel ?? t("dialog.confirm"),
          cancelLabel: options.cancelLabel ?? t("dialog.cancel"),
          confirmVariant: options.confirmVariant ?? "default",
        });
      }),
    [t],
  );

  const value = useMemo(() => ({ confirm }), [confirm]);

  return (
    <ConfirmDialogContext.Provider value={value}>
      {children}
      <AppConfirmDialog
        cancelLabel={dialogState.cancelLabel || t("dialog.cancel")}
        confirmLabel={dialogState.confirmLabel || t("dialog.confirm")}
        confirmVariant={dialogState.confirmVariant}
        description={dialogState.description}
        onCancel={() => closeDialog(false)}
        onConfirm={() => closeDialog(true)}
        open={dialogState.open}
        title={dialogState.title}
      />
    </ConfirmDialogContext.Provider>
  );
}
