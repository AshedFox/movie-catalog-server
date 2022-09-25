import { registerEnumType } from '@nestjs/graphql';

export enum SortDirectionEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(SortDirectionEnum, {
  name: 'SortDirectionEnum',
});
