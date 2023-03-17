import { Type } from '@nestjs/common';
import { SortType } from '@common/sort/sort.type';

export const SortStorage: Map<
  string,
  Type<SortType<unknown>>
> = global.GqlSortStorage ||
(global.GqlSortStorage = new Map<string, Type<SortType<unknown>>>());
