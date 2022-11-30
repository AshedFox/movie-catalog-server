import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '@common/pagination';
import { MoviePersonTypeEntity } from '../entities/movie-person-type.entity';

@ObjectType()
export class PaginatedMoviePersonTypes extends Paginated(
  MoviePersonTypeEntity,
) {}
