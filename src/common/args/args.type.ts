import { FilterType } from '../filter';
import { GqlOffsetPagination } from '../pagination';
import { SortType } from '../sort';

export type ArgsType<T> = {
  filter?: FilterType<T>;
  pagination?: GqlOffsetPagination;
  order?: SortType<T>;
};
