import { CreateFilmPersonInput } from './create-film-person.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateFilmPersonInput extends PartialType(CreateFilmPersonInput) {}
