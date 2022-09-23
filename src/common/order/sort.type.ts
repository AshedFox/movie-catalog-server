import { SortDirectionEnum } from './sort-direction.enum';

type SortVariant<T> = T extends undefined
  ? undefined
  : T extends Array<infer U>
  ? SortType<U>
  : T extends object
  ? SortType<T>
  : SortDirectionEnum;

export type SortType<T> = {
  [P in keyof T]: SortVariant<T[P]>;
};
