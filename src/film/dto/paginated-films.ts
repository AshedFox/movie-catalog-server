import { ObjectType } from '@nestjs/graphql';
import { FilmEntity } from '../entities/film.entity';
import { Paginated } from '../../utils/paginated.helper';

@ObjectType()
export class PaginatedFilms extends Paginated(FilmEntity) {}
