export type PaginatedType<T> = {
  data: T[];
  count: number;
  hasNext: boolean;
};
