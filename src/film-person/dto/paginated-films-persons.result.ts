import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../shared/paginated';
import { FilmPersonModel } from '../entities/film-person.model';

@ObjectType()
export class PaginatedFilmsPersons extends Paginated(FilmPersonModel) {}
