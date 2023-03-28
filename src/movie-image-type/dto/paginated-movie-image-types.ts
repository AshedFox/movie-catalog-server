import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '@common/pagination/offset';
import { MovieImageTypeEntity } from '../entities/movie-image-type.entity';

@ObjectType()
export class PaginatedMovieImageTypes extends Paginated(MovieImageTypeEntity) {}
