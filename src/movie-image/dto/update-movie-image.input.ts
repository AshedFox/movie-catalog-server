import { CreateMovieImageInput } from './create-movie-image.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMovieImageInput extends PartialType(CreateMovieImageInput) {}
