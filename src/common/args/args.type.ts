import { FilterType } from '../filter';
import { SortType } from '../sort';
import { OffsetPaginationArgsType } from '../pagination/offset';
import { RelayPaginationArgs } from '../pagination/relay';

export type ArgsType<T> = {
  filter?: FilterType<T>;
  sort?: SortType<T>;
};

export type OffsetArgsType<T> = ArgsType<T> & OffsetPaginationArgsType;

export type RelayArgsType<T> = ArgsType<T> & RelayPaginationArgs;
