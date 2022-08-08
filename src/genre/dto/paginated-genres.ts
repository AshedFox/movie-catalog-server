import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../utils/paginated.helper';
import { GenreEntity } from '../entities/genre.entity';

@ObjectType()
export class PaginatedGenres extends Paginated(GenreEntity) {}
