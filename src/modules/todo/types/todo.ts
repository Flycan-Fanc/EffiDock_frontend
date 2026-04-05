export type TodoPriority = "low" | "medium" | "high";

export type TodoStatusFilter = "all" | "active" | "completed";

export type TodoDueFilter = "all" | "today" | "upcoming" | "overdue" | "none";

export type TodoPriorityFilter = "all" | TodoPriority;

export type TodoSortMode = "created-desc" | "due-asc" | "priority-desc";

export type TodoItem = {
  id: string;
  title: string;
  notes: string;
  tagIds: string[];
  completed: boolean;
  priority: TodoPriority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateTodoInput = {
  title: string;
  notes: string;
  tagIds: string[];
  priority: TodoPriority;
  dueDate: string | null;
};

export type UpdateTodoInput = CreateTodoInput & {
  id: string;
};

export type TodoFilters = {
  query: string;
  tagId: string;
  status: TodoStatusFilter;
  priority: TodoPriorityFilter;
  due: TodoDueFilter;
  sort: TodoSortMode;
};
