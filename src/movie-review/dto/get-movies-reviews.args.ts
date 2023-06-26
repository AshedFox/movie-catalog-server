import { ArgsType } from '@nestjs/graphql';
import { GqlArgs } from '@common/args';
import { MovieReviewEntity } from '../entities/movie-review.entity';

@ArgsType()
export class GetMoviesReviewsRelayArgs extends GqlArgs(
  MovieReviewEntity,
  'relay',
) {}

@ArgsType()
export class GetMoviesReviewsOffsetArgs extends GqlArgs(
  MovieReviewEntity,
  'take-skip',
) {}
