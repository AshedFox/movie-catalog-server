import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PaginatedType } from '@common/pagination';
import { MovieUnion } from '../entities/movie.union';

@ObjectType()
export class PaginatedMoviesUnion implements PaginatedType<typeof MovieUnion> {
  @Field(() => Int)
  totalCount: number;

  @Field(() => [MovieUnion])
  edges: Array<typeof MovieUnion>;

  @Field()
  hasNext: boolean;
}
