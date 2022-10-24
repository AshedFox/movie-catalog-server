import { registerEnumType } from '@nestjs/graphql';

export enum SortNullsEnum {
  FIRST = 'FIRST',
  first = 'first',
  LAST = 'LAST',
  last = 'last',
}

registerEnumType(SortNullsEnum, { name: 'SortNullsEnum' });
