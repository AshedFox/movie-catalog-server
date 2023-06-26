import { ObjectType } from '@nestjs/graphql';
import { MovieReviewEntity } from '../entities/movie-review.entity';
import { Connection, Edge } from '@common/pagination/relay';
import { Paginated } from '@common/pagination/offset';

@ObjectType()
export class MovieReviewEdge extends Edge(MovieReviewEntity) {}

@ObjectType()
export class RelayPaginatedMoviesReviews extends Connection(
  MovieReviewEdge,
  MovieReviewEntity,
) {}

@ObjectType()
export class OffsetPaginatedMoviesReviews extends Paginated(
  MovieReviewEntity,
) {}
