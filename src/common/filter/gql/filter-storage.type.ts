import {
  BooleanFilter,
  DateTimeFilter,
  FloatFilter,
  IDFilter,
  IntFilter,
  StringFilter,
} from './types';
import { Type } from '@nestjs/common';
import { FilterType } from '../common';

export const FilterStorage =
  global.GqlFilterStorage ||
  (global.GqlFilterStorage = new Map<string, Type<FilterType<unknown>>>([
    [IDFilter.name, IDFilter],
    [IntFilter.name, IntFilter],
    [FloatFilter.name, FloatFilter],
    [StringFilter.name, StringFilter],
    [BooleanFilter.name, BooleanFilter],
    [DateTimeFilter.name, DateTimeFilter],
  ]));
