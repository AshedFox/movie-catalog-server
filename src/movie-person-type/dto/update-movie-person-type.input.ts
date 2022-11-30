import { CreateMoviePersonTypeInput } from './create-movie-person-type.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMoviePersonTypeInput extends PartialType(
  CreateMoviePersonTypeInput,
) {}
