import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '@common/pagination/offset';
import { MovieImageEntity } from '../entities/movie-image.entity';

@ObjectType()
export class PaginatedMoviesImages extends Paginated(MovieImageEntity) {}
