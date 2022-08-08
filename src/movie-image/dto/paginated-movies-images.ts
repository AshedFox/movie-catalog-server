import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../utils/paginated.helper';
import { MovieImageEntity } from '../entities/movie-image.entity';

@ObjectType()
export class PaginatedMoviesImages extends Paginated(MovieImageEntity) {}
