import { useEffect, useState } from "react";
import { PencilLine, Trash2 } from "lucide-react";

import { useI18n } from "@/core/i18n/use-i18n";
import { useTagStore } from "@/features/tags/stores/use-tag-store";
import { Button } from "@/shared/components/ui/button";
import { useConfirmDialog } from "@/shared/hooks/use-confirm-dialog";

type TagManagementCardProps = {
  onDeleteTag?: (tagId: string) => void | Promise<void>;
};

export function TagManagementCard({ onDeleteTag }: TagManagementCardProps) {
  const { t } = useI18n();
  const { confirm } = useConfirmDialog();
  const {
    items,
    hydrated,
    loading,
    error,
    hydrate,
    createTag,
    updateTag,
    deleteTag,
    clearError,
  } = useTagStore();
  const [draft, setDraft] = useState("");
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState("");

  useEffect(() => {
    if (!hydrated) {
      void hydrate();
    }
  }, [hydrate, hydrated]);

  const handleCreate = async () => {
    const created = await createTag(draft);

    if (created) {
      setDraft("");
    }
  };

  const handleDelete = async (tagId: string) => {
    const confirmed = await confirm({
      title: t("settings.tags.deleteConfirmTitle"),
      description: t("settings.tags.deleteConfirm", {
        label: getTagLabel(tagId),
      }),
      confirmVariant: "danger",
    });

    if (!confirmed) {
      return;
    }

    const success = await deleteTag(tagId);

    if (!success) {
      return;
    }

    setEditingTagId((currentValue) => (currentValue === tagId ? null : currentValue));

    if (onDeleteTag) {
      await onDeleteTag(tagId);
    }
  };

  const handleSave = async () => {
    if (!editingTagId) {
      return;
    }

    const success = await updateTag(editingTagId, editingLabel);

    if (success) {
      setEditingTagId(null);
      setEditingLabel("");
    }
  };

  function getTagLabel(tagId: string) {
    return items.find((item) => item.id === tagId)?.label ?? "";
  }

  return (
    <article className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 md:col-span-2">
      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-900">{t("settings.tags.title")}</p>
        <p className="text-sm leading-6 text-slate-500">{t("settings.tags.description")}</p>
      </div>

      <div className="mt-4 flex flex-col gap-3 md:flex-row">
        <input
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-300"
          onChange={(event) => setDraft(event.target.value)}
          placeholder={t("settings.tags.placeholder")}
          value={draft}
        />
        <Button onClick={() => void handleCreate()} type="button">
          {t("settings.tags.create")}
        </Button>
      </div>

      {error ? (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {t(error)}
        </div>
      ) : null}

      <div className="mt-5 space-y-3">
        {loading && !hydrated ? (
          <p className="text-sm text-slate-500">{t("tags.loading")}</p>
        ) : null}

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-6 text-sm text-slate-500">
            {t("settings.tags.empty")}
          </div>
        ) : null}

        {items.map((tag) => {
          const isEditing = editingTagId === tag.id;

          return (
            <div
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 md:flex-row md:items-center md:justify-between"
              key={tag.id}
            >
              {isEditing ? (
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-300 focus:bg-white"
                  onChange={(event) => setEditingLabel(event.target.value)}
                  value={editingLabel}
                />
              ) : (
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    #{tag.label}
                  </span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2">
                {isEditing ? (
                  <>
                    <Button onClick={() => void handleSave()} type="button" variant="outline">
                      {t("settings.tags.save")}
                    </Button>
                    <Button
                      onClick={() => {
                        setEditingTagId(null);
                        setEditingLabel("");
                        clearError();
                      }}
                      type="button"
                      variant="secondary"
                    >
                      {t("settings.tags.cancel")}
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => {
                      setEditingTagId(tag.id);
                      setEditingLabel(tag.label);
                      clearError();
                    }}
                    type="button"
                    variant="outline"
                  >
                    <PencilLine className="mr-2 h-4 w-4" />
                    {t("settings.tags.rename")}
                  </Button>
                )}

                <Button onClick={() => void handleDelete(tag.id)} type="button" variant="secondary">
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t("settings.tags.delete")}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}
