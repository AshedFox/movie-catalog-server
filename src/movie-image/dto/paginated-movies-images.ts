import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../common/pagination';
import { MovieImageEntity } from '../entities/movie-image.entity';

@ObjectType()
export class PaginatedMoviesImages extends Paginated(MovieImageEntity) {}
