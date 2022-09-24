import { CreateMovieReviewInput } from './create-movie-review.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMovieReviewInput extends PartialType(
  CreateMovieReviewInput,
) {}
