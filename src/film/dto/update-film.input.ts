import { InputType, PartialType } from '@nestjs/graphql';
import { CreateFilmInput } from './create-film.input';

@InputType()
export class UpdateFilmInput extends PartialType(CreateFilmInput) {}
