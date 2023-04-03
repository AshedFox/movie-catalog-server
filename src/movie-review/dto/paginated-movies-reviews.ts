import { ObjectType } from '@nestjs/graphql';
import { MovieReviewEntity } from '../entities/movie-review.entity';
import { Connection, Edge } from '@common/pagination/relay';

@ObjectType()
export class MovieReviewEdge extends Edge(MovieReviewEntity) {}

@ObjectType()
export class PaginatedMoviesReviews extends Connection(
  MovieReviewEdge,
  MovieReviewEntity,
) {}
