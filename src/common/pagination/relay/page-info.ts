import { Field, ObjectType } from '@nestjs/graphql';
import { PageInfoType } from './types';

@ObjectType('RelayPageInfo')
export class PageInfo implements PageInfoType {
  @Field()
  hasNextPage: boolean;

  @Field()
  hasPreviousPage: boolean;

  @Field({ nullable: true })
  startCursor?: string;

  @Field({ nullable: true })
  endCursor?: string;
}
