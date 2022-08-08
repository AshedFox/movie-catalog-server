import { CreateMoviePersonInput } from './create-movie-person.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMoviePersonInput extends PartialType(
  CreateMoviePersonInput,
) {}
