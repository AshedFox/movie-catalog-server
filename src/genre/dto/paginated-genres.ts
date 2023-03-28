import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '@common/pagination/offset';
import { GenreEntity } from '../entities/genre.entity';

@ObjectType()
export class PaginatedGenres extends Paginated(GenreEntity) {}
