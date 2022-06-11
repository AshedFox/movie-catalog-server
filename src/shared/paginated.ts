import { Field, ObjectType } from '@nestjs/graphql';
import { IPaginated } from './paginated.interface';
import { Type } from '@nestjs/common';

export function Paginated<T>(classRef: Type<T>) {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType implements IPaginated<T> {
    @Field()
    count: number;

    @Field(() => [classRef])
    data: T[];

    @Field()
    hasNext: boolean;
  }

  return PaginatedType as Type<IPaginated<T>>;
}
