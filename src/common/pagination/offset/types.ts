export type OffsetPaginationArgsType = {
  skip: number;
  take: number;
};

export type PageInfoType = {
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type PaginatedType<T> = {
  nodes: T[];
  pageInfo: PageInfoType;
};
