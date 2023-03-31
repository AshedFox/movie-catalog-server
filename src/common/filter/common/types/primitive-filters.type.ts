import { BetweenType } from './between.type';

export type BooleanFilterType = {
  eq?: boolean;
  neq?: boolean;
};

export type NumberFilterType = {
  gt?: number;
  gte?: number;
  lt?: number;
  lte?: number;
  eq?: number;
  neq?: number;
  in?: number[];
  nin?: number[];
  btwn?: BetweenType<number>;
  nbtwn?: BetweenType<number>;
};

export type StringFilterType = {
  eq?: string;
  neq?: string;
  in?: string[];
  nin?: string[];
  like?: string;
  nlike?: string;
  ilike?: string;
  nilike?: string;
};

export type DateFilterType = {
  gt?: Date;
  gte?: Date;
  lt?: Date;
  lte?: Date;
  eq?: Date;
  neq?: Date;
  in?: Date[];
  nin?: Date[];
  btwn?: BetweenType<Date>;
  nbtwn?: BetweenType<Date>;
};

export type UniversalFilter<T> = {
  eq?: T;
  neq?: T;
  in?: T[];
  nin?: T[];
};
