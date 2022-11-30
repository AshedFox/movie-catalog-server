import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';
import { PaginatedType } from './paginated.type';

export function Paginated<T>(classRef: Type<T>) {
  @ObjectType({ isAbstract: true })
  abstract class GqlPaginatedType implements PaginatedType<T> {
    @Field(() => Int)
    totalCount: number;

    @Field(() => [classRef])
    edges: T[];

    @Field()
    hasNext: boolean;
  }

  return GqlPaginatedType as Type<PaginatedType<T>>;
}
