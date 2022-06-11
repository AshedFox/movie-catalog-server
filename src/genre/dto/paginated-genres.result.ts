import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../shared/paginated';
import { GenreModel } from '../entities/genre.model';

@ObjectType()
export class PaginatedGenres extends Paginated(GenreModel) {}
