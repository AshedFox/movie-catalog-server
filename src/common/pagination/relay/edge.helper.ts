import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';
import { EdgeType } from './types';

export function Edge<T>(classRef: Type<T>) {
  @ObjectType(`${classRef.name}Edge`, { isAbstract: true })
  abstract class Edge implements EdgeType<T> {
    @Field(() => classRef)
    node: T;

    @Field()
    cursor: string;
  }

  return Edge as Type<EdgeType<T>>;
}
