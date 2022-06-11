import { CreateGenreInput } from './create-genre.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateGenreInput extends PartialType(CreateGenreInput) {}
