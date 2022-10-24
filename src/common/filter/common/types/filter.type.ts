import {
  BooleanFilterType,
  DateFilterType,
  NumberFilterType,
  StringFilterType,
} from './primitive-filters.type';

export type FilterComparisonGroupType<T> = {
  [P in keyof T]?: FilterComparisonType<T[P]>;
};

export type FilterComparisonType<T> = T extends undefined
  ? undefined
  : T extends Array<infer U>
  ? FilterComparisonType<U>
  : T extends boolean
  ? BooleanFilterType
  : T extends number
  ? NumberFilterType
  : T extends string
  ? StringFilterType
  : T extends Date
  ? DateFilterType
  : T extends object
  ? FilterType<T>
  : undefined;

export type FilterGroupType<T> = {
  and?: FilterType<T>[];
  or?: FilterType<T>[];
};

export type FilterType<T> = FilterGroupType<T> & FilterComparisonGroupType<T>;
