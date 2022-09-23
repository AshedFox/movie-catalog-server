import { FilterType } from '../filter';
import { GqlOffsetPagination } from '../pagination';
import { SortType } from '../order';

export type ArgsType<T> = {
  filter?: FilterType<T>;
  pagination?: GqlOffsetPagination;
  order?: SortType<T>;
};
