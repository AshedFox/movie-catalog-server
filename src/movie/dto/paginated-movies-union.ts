import { Field, ObjectType } from '@nestjs/graphql';
import {
  PageInfo,
  PageInfoType,
  PaginatedType,
} from '@common/pagination/offset';
import { MovieUnion } from '../entities/movie.union';

@ObjectType()
export class PaginatedMoviesUnion implements PaginatedType<typeof MovieUnion> {
  @Field(() => [MovieUnion])
  nodes: Array<typeof MovieUnion>;

  @Field(() => PageInfo)
  pageInfo: PageInfoType;
}
