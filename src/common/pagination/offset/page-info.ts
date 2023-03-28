import { Field, ObjectType } from '@nestjs/graphql';
import { PageInfoType } from './types';

@ObjectType('OffsetPageInfo')
export class PageInfo implements PageInfoType {
  @Field()
  hasNextPage: boolean;

  @Field()
  hasPreviousPage: boolean;

  @Field()
  totalCount: number;
}
