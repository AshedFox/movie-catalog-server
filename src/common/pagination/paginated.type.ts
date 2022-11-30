export type PaginatedType<T> = {
  edges: T[];
  totalCount: number;
  hasNext: boolean;
};
