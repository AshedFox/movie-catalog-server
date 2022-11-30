import { CreateMovieImageTypeInput } from './create-movie-image-type.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMovieImageTypeInput extends PartialType(
  CreateMovieImageTypeInput,
) {}
