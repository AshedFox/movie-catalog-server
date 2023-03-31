import { BetweenType } from './between.type';

export type BooleanFilterType = {
  eq?: boolean;
  neq?: boolean;
};

export type NumberFilterType = UniversalFilter<number> & {
  gt?: number;
  gte?: number;
  lt?: number;
  lte?: number;
  btwn?: BetweenType<number>;
  nbtwn?: BetweenType<number>;
};

export type StringFilterType = UniversalFilter<string> & {
  like?: string;
  nlike?: string;
  ilike?: string;
  nilike?: string;
};

export type DateFilterType = UniversalFilter<Date> & {
  gt?: Date;
  gte?: Date;
  lt?: Date;
  lte?: Date;
  btwn?: BetweenType<Date>;
  nbtwn?: BetweenType<Date>;
};

export type UniversalFilter<T> = {
  eq?: T;
  neq?: T;
  in?: T[];
  nin?: T[];
};
