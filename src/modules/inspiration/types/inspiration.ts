export type InspirationItem = {
  id: string;
  title: string;
  content: string;
  tagIds: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateInspirationInput = {
  title: string;
  content: string;
  tagIds: string[];
};

export type UpdateInspirationInput = CreateInspirationInput & {
  id: string;
};

export type InspirationFavoriteFilter = "all" | "favorites" | "others";

export type InspirationSortMode = "created-desc" | "updated-desc" | "favorite-desc";

export type InspirationFilters = {
  query: string;
  tagId: string;
  favorite: InspirationFavoriteFilter;
  sort: InspirationSortMode;
};
