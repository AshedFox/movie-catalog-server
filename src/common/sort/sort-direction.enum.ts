import { registerEnumType } from '@nestjs/graphql';

export enum SortDirectionEnum {
  ASC = 'ASC',
  asc = 'asc',
  DESC = 'DESC',
  desc = 'desc',
}

registerEnumType(SortDirectionEnum, { name: 'SortDirectionEnum' });
