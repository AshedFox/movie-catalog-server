import { CreateMovieUserInput } from './create-movie-user.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMovieUserInput extends PartialType(CreateMovieUserInput) {}
