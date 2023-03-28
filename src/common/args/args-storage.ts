import { Type } from '@nestjs/common';
import { ArgsType } from './args.type';

export const ArgsStorage: Map<
  string,
  Type<ArgsType<unknown>>
> = global.GqlFilterStorage ||
(global.GqlFilterStorage = new Map<string, Type<ArgsType<unknown>>>());
