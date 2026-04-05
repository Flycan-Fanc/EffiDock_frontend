export type TagItem = {
  id: string;
  label: string;
  normalizedLabel: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateTagInput = {
  label: string;
};

export type UpdateTagInput = CreateTagInput & {
  id: string;
};
