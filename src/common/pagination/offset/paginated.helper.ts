import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';
import { PageInfoType, PaginatedType } from './types';
import { PageInfo } from './page-info';

export function Paginated<T>(classRef: Type<T>) {
  @ObjectType(`Paginated${classRef.name}`, { isAbstract: true })
  abstract class Paginated implements PaginatedType<T> {
    @Field(() => PageInfo)
    pageInfo: PageInfoType;

    @Field(() => [classRef])
    nodes: T[];
  }

  return Paginated as Type<PaginatedType<T>>;
}
