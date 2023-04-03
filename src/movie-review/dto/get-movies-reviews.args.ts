import { ArgsType } from '@nestjs/graphql';
import { GqlArgs } from '@common/args';
import { MovieReviewEntity } from '../entities/movie-review.entity';

@ArgsType()
export class GetMoviesReviewsArgs extends GqlArgs(MovieReviewEntity, 'relay') {}
