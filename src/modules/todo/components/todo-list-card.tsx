import { PencilLine, Trash2 } from "lucide-react";

import { useI18n } from "@/core/i18n/use-i18n";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import {
  formatDateTime,
  formatDueDate,
  formatTodayLabel,
  getDueTone,
  getPriorityLabel,
} from "@/modules/todo/lib/todo-utils";
import type { TodoItem } from "@/modules/todo/types/todo";

type TodoListCardProps = {
  items: TodoItem[];
  totalCount: number;
  completedCount: number;
  onToggle: (todoId: string) => void;
  onEdit: (todo: TodoItem) => void;
  onDelete: (todoId: string) => void;
};

export function TodoListCard({
  items,
  totalCount,
  completedCount,
  onToggle,
  onEdit,
  onDelete,
}: TodoListCardProps) {
  const { locale, t } = useI18n();
  const openCount = totalCount - completedCount;

  return (
    <article className="rounded-[28px] border border-slate-200 bg-white p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {t("todo.list.badge")}
          </p>
          <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">
            {items.length > 0 ? t("todo.list.visible", { count: items.length }) : t("todo.list.emptyTitle")}
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            {t("todo.list.summary", { open: openCount, completed: completedCount })}
          </p>
        </div>
        <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
          {t("todo.list.today", { date: formatTodayLabel(locale) })}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {items.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
            <p className="text-base font-medium text-slate-900">{t("todo.list.emptyMessage")}</p>
            <p className="mt-2 text-sm leading-7 text-slate-500">{t("todo.list.emptyHint")}</p>
          </div>
        ) : null}

        {items.map((todo) => (
          <div
            className={cn(
              "rounded-[24px] border px-5 py-4 transition",
              todo.completed ? "border-slate-200 bg-slate-50" : "border-slate-200 bg-white",
            )}
            key={todo.id}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex min-w-0 flex-1 items-start gap-4">
                <button
                  aria-label={todo.completed ? t("todo.list.markActive") : t("todo.list.markCompleted")}
                  className={cn(
                    "mt-1 h-5 w-5 rounded-full border transition",
                    todo.completed
                      ? "border-slate-900 bg-slate-900 shadow-[inset_0_0_0_4px_white]"
                      : "border-slate-300 bg-white hover:border-slate-500",
                  )}
                  onClick={() => onToggle(todo.id)}
                  type="button"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p
                      className={cn(
                        "text-base font-medium text-slate-950",
                        todo.completed && "text-slate-500 line-through",
                      )}
                    >
                      {todo.title}
                    </p>
                    <PriorityBadge priority={todo.priority} />
                  </div>

                  {todo.notes ? (
                    <p className="mt-2 text-sm leading-7 text-slate-500">{todo.notes}</p>
                  ) : null}

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                    <span className={cn("font-medium", getDueTone(todo))}>
                      {formatDueDate(todo.dueDate, locale, t)}
                    </span>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-500">
                      {t("todo.list.updated", { value: formatDateTime(todo.updatedAt, locale) })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={() => onEdit(todo)} type="button" variant="outline">
                  <PencilLine className="mr-2 h-4 w-4" />
                  {t("todo.list.edit")}
                </Button>
                <Button onClick={() => onDelete(todo.id)} type="button" variant="secondary">
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t("todo.list.delete")}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function PriorityBadge({ priority }: { priority: TodoItem["priority"] }) {
  const { t } = useI18n();

  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]",
        priority === "high" && "bg-rose-50 text-rose-600",
        priority === "medium" && "bg-amber-50 text-amber-700",
        priority === "low" && "bg-slate-100 text-slate-600",
      )}
    >
      {getPriorityLabel(priority, t)}
    </span>
  );
}
