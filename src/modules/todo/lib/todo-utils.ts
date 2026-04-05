import type { SupportedLocale, TranslateFn } from "@/core/i18n/types";
import { normalizeTagIds } from "@/features/tags/lib/tag-utils";
import type {
  TodoDueFilter,
  TodoFilters,
  TodoItem,
  TodoPriority,
  TodoPriorityFilter,
  TodoSortMode,
  TodoStatusFilter,
} from "@/modules/todo/types/todo";

const priorityRank: Record<TodoPriority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export const defaultTodoFilters: TodoFilters = {
  query: "",
  tagId: "all",
  status: "all",
  priority: "all",
  due: "all",
  sort: "created-desc",
};

export function getTodayDateString() {
  return new Date().toISOString().slice(0, 10);
}

export function createTodoId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `todo-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function normalizeTodoText(value: string) {
  return value.trim();
}

export function normalizeTodoDate(value: string | null) {
  if (!value) {
    return null;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
}

export function getPriorityLabel(priority: TodoPriority, t: TranslateFn) {
  return t(`todo.priority.${priority}`);
}

export function getStatusLabel(status: TodoStatusFilter, t: TranslateFn) {
  return t(`todo.status.${status}`);
}

export function getDueFilterLabel(due: TodoDueFilter, t: TranslateFn) {
  return t(`todo.due.${due}`);
}

export function getPriorityFilterLabel(priority: TodoPriorityFilter, t: TranslateFn) {
  return t(`todo.priorityFilter.${priority}`);
}

export function getSortLabel(sort: TodoSortMode, t: TranslateFn) {
  return t(`todo.sort.${sort}`);
}

export function formatDueDate(dueDate: string | null, locale: SupportedLocale, t: TranslateFn) {
  if (!dueDate) {
    return t("todo.due.none");
  }

  const parsedDate = new Date(`${dueDate}T00:00:00`);

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    weekday: "short",
  }).format(parsedDate);
}

export function formatDateTime(value: string, locale: SupportedLocale) {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatTodayLabel(locale: SupportedLocale) {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date());
}

export function getDueState(todo: TodoItem) {
  if (!todo.dueDate) {
    return "none" as const;
  }

  const today = getTodayDateString();

  if (todo.dueDate < today) {
    return "overdue" as const;
  }

  if (todo.dueDate === today) {
    return "today" as const;
  }

  return "upcoming" as const;
}

export function getDueTone(todo: TodoItem) {
  const dueState = getDueState(todo);

  if (dueState === "overdue") {
    return "text-rose-600";
  }

  if (dueState === "today") {
    return "text-amber-600";
  }

  return "text-slate-500";
}

export function sortTodos(items: TodoItem[], sort: TodoSortMode) {
  const clonedItems = [...items];

  return clonedItems.sort((left, right) => {
    if (sort === "priority-desc") {
      const byPriority = priorityRank[right.priority] - priorityRank[left.priority];
      if (byPriority !== 0) {
        return byPriority;
      }
    }

    if (sort === "due-asc") {
      const leftDue = left.dueDate ?? "9999-12-31";
      const rightDue = right.dueDate ?? "9999-12-31";
      const byDue = leftDue.localeCompare(rightDue);

      if (byDue !== 0) {
        return byDue;
      }
    }

    return right.createdAt.localeCompare(left.createdAt);
  });
}

export function filterTodos(items: TodoItem[], filters: TodoFilters) {
  const normalizedQuery = filters.query.trim().toLowerCase();
  const today = getTodayDateString();

  return items.filter((todo) => {
    const tagIds = normalizeTagIds(todo.tagIds ?? []);

    if (filters.status === "active" && todo.completed) {
      return false;
    }

    if (filters.status === "completed" && !todo.completed) {
      return false;
    }

    if (filters.priority !== "all" && todo.priority !== filters.priority) {
      return false;
    }

    if (filters.due === "today" && todo.dueDate !== today) {
      return false;
    }

    if (filters.due === "upcoming" && (!todo.dueDate || todo.dueDate <= today)) {
      return false;
    }

    if (filters.due === "overdue" && (!todo.dueDate || todo.dueDate >= today || todo.completed)) {
      return false;
    }

    if (filters.due === "none" && todo.dueDate) {
      return false;
    }

    if (filters.tagId !== "all" && !tagIds.includes(filters.tagId)) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return `${todo.title} ${todo.notes}`.toLowerCase().includes(normalizedQuery);
  });
}
