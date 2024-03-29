import { ObjectType } from '@nestjs/graphql';
import { FilmEntity } from '../entities/film.entity';
import { Paginated } from '@common/pagination/offset';

@ObjectType()
export class PaginatedFilms extends Paginated(FilmEntity) {}
