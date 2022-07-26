import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateFilmInput } from './create-film.input';

@InputType()
export class UpdateFilmInput extends PartialType(
  OmitType(CreateFilmInput, ['studiosIds', 'genresIds', 'postersIds']),
) {}
