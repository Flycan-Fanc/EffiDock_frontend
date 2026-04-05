export type DiarySortMode = "entry-desc" | "entry-asc" | "updated-desc";

export type DiaryEntry = {
  id: string;
  title: string;
  content: string;
  entryDate: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateDiaryEntryInput = {
  title: string;
  content: string;
  entryDate: string;
};

export type UpdateDiaryEntryInput = CreateDiaryEntryInput & {
  id: string;
};

export type DiaryFilters = {
  query: string;
  sort: DiarySortMode;
};
