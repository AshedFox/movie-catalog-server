import { ObjectType } from '@nestjs/graphql';
import { FilmModel } from '../entities/film.model';
import { Paginated } from '../../shared/paginated';

@ObjectType()
export class PaginatedFilms extends Paginated(FilmModel) {}
