import type { DiaryEntry } from "@/modules/diary/types/diary";
import type { InspirationItem } from "@/modules/inspiration/types/inspiration";
import { getTodayDateString } from "@/modules/todo/lib/todo-utils";
import type { TodoItem } from "@/modules/todo/types/todo";

export type DashboardTodoStats = {
  total: number;
  open: number;
  completed: number;
  dueToday: number;
  dueTodayOpen: number;
  dueTodayCompleted: number;
  overdueOpen: number;
};

export function getDashboardTodoStats(items: TodoItem[]): DashboardTodoStats {
  const today = getTodayDateString();

  return items.reduce<DashboardTodoStats>(
    (stats, item) => {
      stats.total += 1;

      if (item.completed) {
        stats.completed += 1;
      } else {
        stats.open += 1;
      }

      if (item.dueDate === today) {
        stats.dueToday += 1;

        if (item.completed) {
          stats.dueTodayCompleted += 1;
        } else {
          stats.dueTodayOpen += 1;
        }
      }

      if (!item.completed && item.dueDate && item.dueDate < today) {
        stats.overdueOpen += 1;
      }

      return stats;
    },
    {
      total: 0,
      open: 0,
      completed: 0,
      dueToday: 0,
      dueTodayOpen: 0,
      dueTodayCompleted: 0,
      overdueOpen: 0,
    },
  );
}

export function getRecentDiaryEntry(items: DiaryEntry[]) {
  return [...items].sort((left, right) => {
    const byEntryDate = right.entryDate.localeCompare(left.entryDate);

    if (byEntryDate !== 0) {
      return byEntryDate;
    }

    return right.updatedAt.localeCompare(left.updatedAt);
  })[0];
}

export function getRecentInspirationItem(items: InspirationItem[]) {
  return [...items].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))[0];
}

export function createExcerpt(value: string, maxLength = 120) {
  const normalized = value.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength).trimEnd()}...`;
}
