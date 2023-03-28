export type PageInfoType = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
};

export type EdgeType<T> = {
  node: T;
  cursor: string;
};

export type RelayPaginationArgsType = {
  first?: number;
  after?: string;
  last?: number;
  before?: string;
};

export type ConnectionType<T> = {
  pageInfo: PageInfoType;

  edges: EdgeType<T>[];
};
