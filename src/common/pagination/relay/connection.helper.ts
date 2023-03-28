import { Type } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { ConnectionType, EdgeType } from './types';
import { PageInfo } from './page-info';

type ExtractNodeType<E> = E extends EdgeType<infer N> ? N : never;

export function Connection<E extends EdgeType<N>, N = ExtractNodeType<E>>(
  edgeType: Type<E>,
  nodeType: Type<N>,
) {
  @ObjectType(`${nodeType.name}Connection`, { isAbstract: true })
  abstract class Connection implements ConnectionType<N> {
    @Field(() => PageInfo)
    pageInfo: PageInfo;

    @Field(() => [edgeType])
    edges: EdgeType<N>[];
  }

  return Connection as Type<ConnectionType<N>>;
}
